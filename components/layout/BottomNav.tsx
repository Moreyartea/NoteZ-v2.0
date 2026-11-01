'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconLayoutDashboard,
  IconWallet,
  IconChecklist,
  IconNotes,
  IconMovie,
} from '@tabler/icons-react';
import { cn } from '@/app/lib/utils';

export interface NavTabItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navTabs: NavTabItem[] = [
  {
    name: 'Beranda',
    href: '/',
    icon: IconLayoutDashboard,
  },
  {
    name: 'Keuangan',
    href: '/finance',
    icon: IconWallet,
  },
  {
    name: 'Tugas',
    href: '/todos',
    icon: IconChecklist,
  },
  {
    name: 'Catatan',
    href: '/notes',
    icon: IconNotes,
  },
  {
    name: 'Tontonan',
    href: '/media',
    icon: IconMovie,
  },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[var(--theme-surface,#1E1E1E)] border-t-[3px] border-[#0A0A0A] dark:border-[var(--theme-border,#2E2E2E)] shadow-[0px_-2px_0px_#0A0A0A] dark:shadow-[0px_-2px_0px_#000000] transition-colors"
      aria-label="Navigasi Utama Mobile"
    >
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5 pb-2">
        {navTabs.map((tab) => {
          const isActive =
            tab.href === '/'
              ? pathname === '/' || pathname === '/dashboard'
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-75 select-none',
                isActive
                  ? 'bg-[#FFE135] dark:bg-[var(--theme-accent-primary,#FFE135)] text-[#0A0A0A] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] font-extrabold -translate-y-0.5'
                  : 'text-gray-600 dark:text-[var(--theme-text-muted,#8E929E)] hover:text-[#0A0A0A] dark:hover:text-[var(--theme-text-primary,#F4F4F0)] font-semibold active:translate-y-0.5'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 transition-transform',
                  isActive ? 'stroke-[2.5] scale-105' : 'stroke-2'
                )}
              />
              <span className="text-[10px] mt-0.5 tracking-tight leading-none">
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

