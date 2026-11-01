'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { IconSettings } from '@tabler/icons-react';
import { seedInitialData } from '@/app/lib/seed';
import {
  requestNotificationPermission,
  initNotificationListeners,
  syncDueNotificationsToDrawer,
} from '@/app/lib/services/notificationService';
import { syncAllWidgets } from '@/app/lib/services/widgetSyncService';
import { initTheme } from '@/app/lib/services/settingsService';
import { LiveDeviceClock } from './LiveDeviceClock';
import { BottomNav } from './BottomNav';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { AppLogo } from '@/components/ui/AppLogo';

export interface AppShellProps {
  children: React.ReactNode;
  headerTitle?: string;
  showClock?: boolean;
}

/**
 * AppShell - Minimalist Mobile Shell Layout (Dark Mode Enabled)
 * Top Bar:
 * - Left: NoteZ official SVG logo badge + subtle page title
 * - Right: Isolated real-time digital clock + Notification bell + Settings gear button
 * Bottom Bar:
 * - 5-tab Neo-Brutalism Bottom Navigation
 */
export const AppShell: React.FC<AppShellProps> = ({
  children,
  headerTitle,
  showClock = true,
}) => {
  useEffect(() => {
    // Run initial seed, notification permission, listeners, drawer sync, and widget data sync
    seedInitialData();
    requestNotificationPermission();
    initNotificationListeners();
    syncDueNotificationsToDrawer();
    syncAllWidgets();
    initTheme();

    // Light 15-second interval to check and sync due task notifications in real-time
    const intervalId = setInterval(() => {
      syncDueNotificationsToDrawer().catch(() => {});
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F2EB] dark:bg-[var(--theme-outer-bg)] text-[#0A0A0A] dark:text-[var(--theme-text-primary)] flex flex-col items-center overflow-x-hidden transition-colors">
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#FFFDF7] dark:bg-[var(--theme-bg)] border-x-[3px] border-[#0A0A0A] dark:border-[var(--theme-shell-border)] shadow-[4px_0px_0px_#0A0A0A] dark:shadow-[4px_0px_0px_#000000] relative">
        {/* Minimalist Top App Header */}
        <header className="sticky top-0 z-30 bg-[#FFFDF7] dark:bg-[var(--theme-surface)] border-b-[3px] border-[#0A0A0A] dark:border-[var(--theme-shell-border)] px-3.5 py-2 flex items-center justify-between shadow-[0px_2px_0px_#0A0A0A] dark:shadow-[0px_2px_0px_#000000]">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <AppLogo size="sm" showText={true} />
            {headerTitle && (
              <span className="text-xs font-black text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                / {headerTitle}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {showClock && <LiveDeviceClock />}
            <NotificationBell />
            <Link
              href="/settings"
              title="Pengaturan"
              aria-label="Buka Pengaturan"
              className="w-8 h-8 rounded-lg bg-white dark:bg-[var(--theme-surface-elevated)] border-2 border-[#0A0A0A] dark:border-[var(--theme-shell-border)] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000] flex items-center justify-center hover:bg-yellow-50 dark:hover:bg-white/10 active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex-shrink-0"
            >
              <IconSettings className="w-4 h-4 text-[#0A0A0A] dark:text-[var(--theme-text-primary)] stroke-[2.5]" />
            </Link>
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
