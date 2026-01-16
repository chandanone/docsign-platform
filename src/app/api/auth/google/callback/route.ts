import { NextRequest, NextResponse } from 'next/server';
import { getGoogleUser } from '@/lib/auth/google';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createSession } from '@/lib/auth/session';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`);
  }

  try {
    const googleUser = await getGoogleUser(code);

    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.googleId, googleUser.googleId))
      .limit(1);

    if (!user) {
      const [existing] = await db
        .select()
        .from(users)
        .where(eq(users.email, googleUser.email))
        .limit(1);

      if (existing) {
        await db
          .update(users)
          .set({ googleId: googleUser.googleId })
          .where(eq(users.id, existing.id));
        user = existing;
      } else {
        [user] = await db
          .insert(users)
          .values({
            email: googleUser.email,
            googleId: googleUser.googleId,
            name: googleUser.name,
          })
          .returning();
      }
    }

    await createSession(user.id);

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
  } catch (err) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`);
  }