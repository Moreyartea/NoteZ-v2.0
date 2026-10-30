'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { IconSettings } from '@tabler/icons-react';
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
 * AppShell - Mobile Container & Shell Layout
 * Handles:
 * - One-time initial seed (wallets & settings)
 * - Isolated real-time device clock header
 * - Notification bell & drawer trigger
 * - Quick settings link
 * - Fixed Neo-Brutalism Bottom Navigation
 * - Safe scrollable padding (pb-24)
 */
export const AppShell: React.FC<AppShellProps> = ({
  children,
  headerTitle,
  showClock = true,
}) => {
  useEffect(() => {
    // Run initial seed once on initial mount
    seedInitialData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#0A0A0A] flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#FFFDF7] border-x-[3px] border-[#0A0A0A] shadow-[4px_0px_0px_#0A0A0A] relative">
        {/* Sticky App Header */}
        <header className="sticky top-0 z-30 bg-[#FFFDF7] border-b-[3px] border-[#0A0A0A] px-3.5 py-2.5 flex items-center justify-between shadow-[0px_2px_0px_#0A0A0A]">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Link
              href="/"
              className="text-lg font-black tracking-tighter text-[#0A0A0A] bg-[#FFE135] px-2 py-0.5 rounded-lg border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] select-none"
            >
              NoteZ
            </Link>
            {headerTitle && (
              <span className="text-xs font-extrabold text-gray-700 truncate max-w-[90px]">
                / {headerTitle}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {showClock && <LiveDeviceClock />}
            <NotificationBell />
            <Link
              href="/settings"
              title="Pengaturan & Backup"
              className="w-10 h-10 rounded-xl bg-white border-[2.5px] border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] flex items-center justify-center hover:bg-yellow-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#0A0A0A] transition-all cursor-pointer"
            >
              <IconSettings className="w-5 h-5 text-[#0A0A0A] stroke-[2.5]" />
            </Link>
          </div>
        </header>

        {/* Page Content with bottom padding to avoid BottomNav overlap */}
        <main className="flex-1 p-4 pb-24 overflow-y-auto">
          {children}
        </main>

        {/* Fixed Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};
