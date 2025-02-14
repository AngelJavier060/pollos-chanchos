'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PolloLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/pollo');
    }
  }, [router]);

  return <>{children}</>;
} 