'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Shield, Plus, List, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Tambah Data', href: '/tambah-data', icon: Plus },
  { name: 'Daftar Tahanan', href: '/daftar-tahanan', icon: List },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 navy-gradient">
        <div className="rounded-lg bg-white/20 p-2">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">E-Brantas</h1>
          <p className="text-sm text-blue-100">Manajemen Tahanan</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Separator className="mx-4" />

      {/* User Info */}
      <div className="p-4">
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              @{user?.username}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="mt-3 w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </Button>
      </div>
    </div>
  );
}