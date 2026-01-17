// src/lib/actions/auth.ts
'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { createSession, deleteSession } from '@/lib/auth/session';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function registerUser(prevState: any,formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  const passwordHash = await hashPassword(password);

  try {
    const [user] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        name,
      })
      .returning();

    await createSession(user.id);
  } catch (err: any) {
    if (err.code === '23505') {
      return { error: 'Email already exists' };
    }
    return { error: 'Registration failed' };
  }

  redirect('/dashboard');
}

export async function loginUser(prevState: any,formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user || !user.passwordHash) {
    return { error: 'Invalid credentials' };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: 'Invalid credentials' };
  }

  await createSession(user.id);
  redirect('/dashboard');
}

export async function logoutUser() {
  await deleteSession();
  redirect('/login');
}