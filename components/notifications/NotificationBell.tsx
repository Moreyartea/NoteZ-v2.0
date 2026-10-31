'use client';

import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconBell } from '@tabler/icons-react';
import { db } from '@/app/lib/db';
import { NotificationDrawer } from './NotificationDrawer';

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount =
    useLiveQuery(async () => {
      if (typeof window === 'undefined') return 0;
      try {
        const unread = await db.notifications.filter((n) => !n.isRead).count();
        return unread;
      } catch {
        return 0;
      }
    }, []) || 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Lihat Notifikasi"
        className="relative w-8 h-8 rounded-lg bg-white dark:bg-[#252525] border-2 border-[#0A0A0A] dark:border-[#2E2E2E] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000] flex items-center justify-center hover:bg-yellow-50 dark:hover:bg-[#333333] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex-shrink-0"
      >
        <IconBell className="w-4 h-4 text-[#0A0A0A] dark:text-[#F4F4F0] stroke-[2.5]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] px-0.5 bg-[#FF3B30] text-white text-[9px] font-black rounded-full border border-[#0A0A0A] flex items-center justify-center leading-none shadow-[1px_1px_0px_#0A0A0A] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

