'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/app/lib/auth';
import Navbar from './components/Navbar';
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

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
      <div className="p-6">
        <div className="mb-6">
          <nav className="flex space-x-4">
            <Link 
              href="/admin/dashboard/plan-nutricional"
              className={`px-4 py-2 rounded-lg hover:bg-gray-100 ${
                pathname === '/admin/dashboard/plan-nutricional' 
                  ? 'bg-gray-100 font-semibold' 
                  : ''
              }`}
            >
              Plan de Alimentación
            </Link>
            <Link 
              href="/admin/dashboard/plan-medicacion"
              className={`px-4 py-2 rounded-lg hover:bg-gray-100 ${
                pathname === '/admin/dashboard/plan-medicacion' 
                  ? 'bg-gray-100 font-semibold' 
                  : ''
              }`}
            >
              Plan de Medicación
            </Link>
          </nav>
        </div>
      </div>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}