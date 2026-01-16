import { LoginForm } from '@/components/auth/login-form';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <LoginForm />
      <p className="mt-4 text-sm text-center">
        Don't have an account?{' '}
        <Link href="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}