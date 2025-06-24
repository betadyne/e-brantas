'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { ProtectedRoute } from './ProtectedRoute';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto lg:ml-0">
          <div className="p-4 lg:p-6 pt-16 lg:pt-6">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}