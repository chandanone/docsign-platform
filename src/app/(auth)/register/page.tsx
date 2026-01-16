import { RegisterForm } from '@/components/auth/register-form';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      <RegisterForm />
      <p className="mt-4 text-sm text-center">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}