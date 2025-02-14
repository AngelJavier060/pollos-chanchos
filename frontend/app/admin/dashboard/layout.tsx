'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/lib/auth';
import Navbar from './components/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Temporalmente comentado para desarrollo
    /*if (!authService.isAuthenticated()) {
      router.push('/auth/admin');
      return;
    }

    if (!authService.isAdmin()) {
      router.push('/unauthorized');
      return;
    }*/
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}