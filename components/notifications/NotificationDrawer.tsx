'use client';

import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  IconBell,
  IconX,
  IconCheck,
  IconTrash,
  IconChecklist,
  IconWallet,
  IconMovie,
  IconFlame,
  IconInfoCircle,
} from '@tabler/icons-react';
import { db } from '@/app/lib/db';
import type { AppNotification, NotificationCategory } from '@/app/lib/types';
import { NbBadge } from '@/components/ui/NbBadge';
import { cn } from '@/app/lib/utils';

export interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  // Read notifications reactively from Dexie
  const notifications =
    useLiveQuery(async () => {
      if (typeof window === 'undefined') return [];
      const list = await db.notifications.toArray();
      // Sort newest first
      return list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }, []) || [];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleMarkAllAsRead = async () => {
    try {
      const unreadList = notifications.filter((n) => !n.isRead);
      await Promise.all(
        unreadList.map((n) => db.notifications.update(n.id, { isRead: true }))
      );
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const handleClearAll = async () => {
    try {
      await db.notifications.clear();
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await db.notifications.update(id, { isRead: true });
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'todo':
        return <IconChecklist className="w-4 h-4 text-white" />;
      case 'finance':
        return <IconWallet className="w-4 h-4 text-[#0A0A0A]" />;
      case 'media':
        return <IconMovie className="w-4 h-4 text-white" />;
      case 'habit':
        return <IconFlame className="w-4 h-4 text-white" />;
      case 'system':
      default:
        return <IconInfoCircle className="w-4 h-4 text-[#0A0A0A]" />;
    }
  };

  const getCategoryBadgeVariant = (category: NotificationCategory) => {
    switch (category) {
      case 'todo':
        return 'secondary' as const;
      case 'finance':
        return 'finance' as const;
      case 'media':
        return 'media' as const;
      case 'habit':
        return 'warning' as const;
      case 'system':
      default:
        return 'primary' as const;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-150"
      onClick={onClose}
    >
      <aside
        className="w-full max-w-sm h-full bg-[#FFFDF7] border-l-[3px] border-[#0A0A0A] shadow-[-6px_0px_0px_#0A0A0A] flex flex-col z-50 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Laci Notifikasi"
      >
        {/* Header */}
        <div className="p-4 bg-white border-b-[3px] border-[#0A0A0A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#FFE135] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]">
              <IconBell className="w-5 h-5 text-[#0A0A0A] stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#0A0A0A] leading-tight">
                Notifikasi
              </h2>
              <p className="text-[11px] font-semibold text-gray-600">
                {unreadCount > 0
                  ? `${unreadCount} belum dibaca`
                  : 'Semua sudah dibaca'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="w-8 h-8 rounded-lg bg-[#FF3B30] text-white border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] flex items-center justify-center hover:bg-[#E02E24] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            <IconX className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="px-4 py-2.5 bg-[#FFFDF7] border-b-2 border-[#0A0A0A] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border-2 border-[#0A0A0A] transition-all',
              unreadCount > 0
                ? 'bg-white shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] hover:bg-yellow-50 cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
            )}
          >
            <IconCheck className="w-3.5 h-3.5 stroke-[3]" />
            <span>Tandai Semua Dibaca</span>
          </button>

          <button
            type="button"
            onClick={handleClearAll}
            disabled={notifications.length === 0}
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border-2 border-[#0A0A0A] transition-all',
              notifications.length > 0
                ? 'bg-[#FF3B30] text-white shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] hover:bg-[#E02E24] cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
            )}
          >
            <IconTrash className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Hapus Semua</span>
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
              <div className="w-14 h-14 rounded-2xl bg-[#FFE135] border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] flex items-center justify-center mb-3">
                <IconBell className="w-7 h-7 text-[#0A0A0A] stroke-[2]" />
              </div>
              <p className="font-bold text-sm text-[#0A0A0A]">
                Belum ada notifikasi
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Pengingat tugas, habit, transaksi, dan jadwal tayang akan muncul di sini.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                className={cn(
                  'p-3 rounded-xl border-[2.5px] border-[#0A0A0A] transition-all cursor-pointer select-none',
                  item.isRead
                    ? 'bg-white opacity-75 shadow-[2px_2px_0px_#0A0A0A]'
                    : 'bg-[#FFF9C4] shadow-[4px_4px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px]'
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <NbBadge
                      variant={getCategoryBadgeVariant(item.category)}
                      icon={getCategoryIcon(item.category)}
                    >
                      {item.category}
                    </NbBadge>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#FF3B30] inline-block" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">
                    {new Date(item.createdAt).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm text-[#0A0A0A] leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  {item.message}
                </p>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
};

