// src/middleware.ts
import { NextRequest } from 'next/server';
import { authProxy } from './lib/proxy'; // Import from your new proxy file

export async function middleware(request: NextRequest) {
  return await authProxy(request);
}

export const config = {
  matcher: ['/dashboard/:path*', '/documents/:path*', '/login', '/register'],
};