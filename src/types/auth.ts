// src/types/auth.ts
export interface User {
  id: string;
  email: string;
  name: string | null;
  passwordHash: string | null;
  googleId: string | null;
  instagramId: string | null;
  instagramUsername: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface SessionWithUser {
  session: Session;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface GoogleUserInfo {
  googleId: string;
  email: string;
  name?: string;
}

export interface InstagramUserInfo {
  instagramId: string;
  username: string;
}

export type AuthProvider = 'email' | 'google' | 'instagram';

export interface AuthError {
  error: string;
  field?: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}