// src/lib/auth/instagram.ts
interface InstagramTokenResponse {
  access_token: string;
  user_id: number;
}

interface InstagramUserResponse {
  id: string;
  username: string;
}

export function getInstagramAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: process.env.INSTAGRAM_CLIENT_ID!,
    redirect_uri: process.env.INSTAGRAM_REDIRECT_URI!,
    scope: 'user_profile',
    response_type: 'code',
  });

  return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
}

export async function getInstagramAccessToken(code: string): Promise<string> {
  const params = new URLSearchParams({
    client_id: process.env.INSTAGRAM_CLIENT_ID!,
    client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
    grant_type: 'authorization_code',
    redirect_uri: process.env.INSTAGRAM_REDIRECT_URI!,
    code,
  });

  const response = await fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error('Failed to get Instagram access token');
  }

  const data: InstagramTokenResponse = await response.json();
  return data.access_token;
}

export async function getInstagramUser(accessToken: string) {
  const response = await fetch(
    `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
  );

  if (!response.ok) {
    throw new Error('Failed to get Instagram user');
  }

  const data: InstagramUserResponse = await response.json();

  return {
    instagramId: data.id,
    username: data.username,
  };
}