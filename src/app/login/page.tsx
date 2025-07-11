'use client';
import { useEffect } from 'react';
import { LoginBox } from '@/components/LoginBox';
import { useAuthContext } from '@/contexts/Auth';
import { useRouter } from 'next/navigation';

export default function Login() {
  const { isAuthLoading, isAuthenticated } = useAuthContext();
  const { push } = useRouter();

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      push('/');
    }
  }, [isAuthLoading, isAuthenticated]);
  return <LoginBox />;
}
