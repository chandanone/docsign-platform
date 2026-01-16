// src/app/api/auth/instagram/route.ts
import { NextResponse } from 'next/server';
import { getInstagramAuthUrl } from '@/lib/auth/instagram';

export async function GET() {
  const url = getInstagramAuthUrl();
  return NextResponse.redirect(url);
}