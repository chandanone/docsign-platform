// src/app/api/auth/instagram/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  getInstagramAccessToken,
  getInstagramUser,
} from '@/lib/auth/instagram';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createSession } from '@/lib/auth/session';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=instagram_auth_failed`);
  }

  try {
    const accessToken = await getInstagramAccessToken(code);
    const instagramUser = await getInstagramUser(accessToken);

    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.instagramId, instagramUser.instagramId))
      .limit(1);

    if (!user) {
      const email = `${instagramUser.username}@instagram.temp`;

      const [existing] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existing) {
        await db
          .update(users)
          .set({
            instagramId: instagramUser.instagramId,
            instagramUsername: instagramUser.username,
          })
          .where(eq(users.id, existing.id));
        user = existing;
      } else {
        [user] = await db
          .insert(users)
          .values({
            email,
            instagramId: instagramUser.instagramId,
            instagramUsername: instagramUser.username,
            name: instagramUser.username,
          })
          .returning();
      }
    }

    await createSession(user.id);

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
  } catch (err) {
    console.error('Instagram auth error:', err);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=instagram_auth_error`);
  }
}