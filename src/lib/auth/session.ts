// src/lib/auth/session.ts
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { sessions, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { SignJWT, jwtVerify } from 'jose';

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;
const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION);
  
  const [session] = await db.insert(sessions).values({
    userId,
    expiresAt,
  }).returning();

  const token = await new SignJWT({ sessionId: session.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresAt)
    .sign(secret);

  (await cookies()).set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  return session;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    const sessionId = payload.sessionId as string;

    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);

    if (!session || session.expiresAt < new Date()) {
      await deleteSession();
      return null;
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    return { session, user };
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      const sessionId = payload.sessionId as string;
      await db.delete(sessions).where(eq(sessions.id, sessionId));
    } catch {}
  }

  cookieStore.delete('session');
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}