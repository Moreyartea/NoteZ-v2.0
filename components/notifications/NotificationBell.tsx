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
        className="relative w-10 h-10 rounded-xl bg-white border-[2.5px] border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] flex items-center justify-center hover:bg-yellow-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#0A0A0A] transition-all cursor-pointer"
      >
        <IconBell className="w-5 h-5 text-[#0A0A0A] stroke-[2.5]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-[#FF3B30] text-white text-[10px] font-black rounded-full border-2 border-[#0A0A0A] flex items-center justify-center leading-none shadow-[1px_1px_0px_#0A0A0A] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

