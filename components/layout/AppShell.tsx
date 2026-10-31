'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { seedInitialData } from '@/app/lib/seed';
import { LiveDeviceClock } from './LiveDeviceClock';
import { BottomNav } from './BottomNav';
import { NotificationBell } from '@/components/notifications/NotificationBell';

export interface AppShellProps {
  children: React.ReactNode;
  headerTitle?: string;
  showClock?: boolean;
}

/**
 * AppShell - Minimalist Mobile Shell Layout
 * Top Bar:
 * - Left: NoteZ solid brand badge + subtle page title
 * - Right: Isolated real-time digital clock + Notification bell
 * Bottom Bar:
 * - 5-tab Neo-Brutalism Bottom Navigation
 */
export const AppShell: React.FC<AppShellProps> = ({
  children,
  headerTitle,
  showClock = true,
}) => {
  useEffect(() => {
    // Run initial seed once on mount
    seedInitialData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#0A0A0A] flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#FFFDF7] border-x-[3px] border-[#0A0A0A] shadow-[4px_0px_0px_#0A0A0A] relative">
        {/* Minimalist Top App Header */}
        <header className="sticky top-0 z-30 bg-[#FFFDF7] border-b-[3px] border-[#0A0A0A] px-3.5 py-2 flex items-center justify-between shadow-[0px_2px_0px_#0A0A0A]">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Link
              href="/"
              className="text-base font-black tracking-tight text-[#0A0A0A] bg-[#FFE135] px-2 py-0.5 rounded-lg border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] select-none"
            >
              NoteZ
            </Link>
            {headerTitle && (
              <span className="text-xs font-black text-gray-700 truncate max-w-[120px]">
                / {headerTitle}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {showClock && <LiveDeviceClock />}
            <NotificationBell />
          </div>
        </header>

        {/* Page Content with bottom padding to avoid BottomNav overlap */}
        <main className="flex-1 p-3.5 pb-24 overflow-y-auto">
          {children}
        </main>

        {/* Fixed Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};
