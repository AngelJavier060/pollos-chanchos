'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (!authService.isAuthenticated()) {
        router.push('/auth/admin');
        return;
      }

      if (authService.isTokenExpired()) {
        authService.logout();
        return;
      }

      if (requiredRole) {
        const userData = authService.getUserData();
        if (!userData || !requiredRole.includes(userData.role)) {
          router.push('/unauthorized');
          return;
        }
      }

      setIsAuthorized(true);
    };

    checkAuth();
  }, [router, requiredRole]);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
} 