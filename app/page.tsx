'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  IconEye,
  IconEyeOff,
  IconPlus,
  IconWallet,
  IconChecklist,
  IconNotes,
  IconMovie,
  IconCoin,
  IconCheck,
  IconFlame,
  IconAlertTriangle,
  IconArrowRight,
  IconStar,
  IconCalendar,
} from '@tabler/icons-react';
import { db } from '@/app/lib/db';
import type {
  Todo,
  Habit,
  WishlistItem,
  MediaItem,
  Wallet,
} from '@/app/lib/types';
import { AppShell } from '@/components/layout/AppShell';
import { NbCard } from '@/components/ui/NbCard';
import { NbBadge } from '@/components/ui/NbBadge';
import { NbButton } from '@/components/ui/NbButton';
import { formatRupiah, cn } from '@/app/lib/utils';
import {
  toggleTodoStatus,
  getLocalTodayDateString,
} from '@/app/lib/services/todoService';
import { toggleHabitToday } from '@/app/lib/services/habitService';
import { incrementEpisode } from '@/app/lib/services/mediaService';
import { getCurrentMonthYear } from '@/app/lib/services/financeService';
import { TransactionModal } from '@/components/finance/TransactionModal';
import { TodoModal } from '@/components/todos/TodoModal';
import { NoteModal } from '@/components/notes/NoteModal';
import { MediaModal } from '@/components/media/MediaModal';
import { WishlistModal } from '@/components/wishlist/WishlistModal';

export default function DashboardPage() {
  const [isHideBalance, setIsHideBalance] = useState<boolean>(false);
  const [greeting, setGreeting] = useState<string>('Selamat Beraktivitas 👋');

  // Modals state for Quick Actions
  const [isTxModalOpen, setIsTxModalOpen] = useState<boolean>(false);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState<boolean>(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState<boolean>(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState<boolean>(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState<boolean>(false);

  const todayStr = getLocalTodayDateString();
  const currentMonth = getCurrentMonthYear();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) setGreeting('Selamat Pagi 🌅');
    else if (hour >= 11 && hour < 15) setGreeting('Selamat Siang ☀️');
    else if (hour >= 15 && hour < 18.5) setGreeting('Selamat Sore 🌇');
    else setGreeting('Selamat Malam 🌙');
  }, []);

  // 1. Reactive Wallets
  const wallets =
    useLiveQuery(async () => {
      if (typeof window === 'undefined') return [];
      return await db.wallets.toArray();
    }, []) || [];

  const totalNetWorth = wallets.reduce((acc, w) => acc + w.balance, 0);

  // 2. Reactive Todos
  const todos =
    useLiveQuery(async () => {
      if (typeof window === 'undefined') return [];
      const list = await db.todos.toArray();
      return list.sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
        return (a.dueDate || '').localeCompare(b.dueDate || '');
      });
    }, []) || [];

  const todayTodos = todos.filter(
    (t) => t.dueDate === todayStr || t.pinToHomeWidget
  );
  const topFocusTodos = todayTodos.slice(0, 5);

  // 3. Reactive Habits
  const habits =
    useLiveQuery(async () => {
      if (typeof window === 'undefined') return [];
      const list = await db.habits.toArray();
      return list.sort((a, b) => b.currentStreak - a.currentStreak);
    }, []) || [];

  // 4. Reactive Highlight Wishlist
  const topWishlist =
    useLiveQuery(async () => {
      if (typeof window === 'undefined') return null;
      const list = await db.wishlists.toArray();
      return list.find((w) => !w.isAchieved) || list[0] || null;
    }, []) || null;

  // 5. Reactive Highlight Media
  const currentWatchingMedia =
    useLiveQuery(async () => {
      if (typeof window === 'undefined') return null;
      const list = await db.media_watchlist.toArray();
      return (
        list.find((m) => m.status === 'watching') ||
        list[0] ||
        null
      );
    }, []) || null;

  // 6. Near-Due Bills & Debts Notification (within next 3 days)
  const urgentAlerts =
    useLiveQuery(async () => {
      if (typeof window === 'undefined') return [];
      const debts = await db.debts.toArray();
      const bills = await db.budgets_and_bills.filter((b) => b.type === 'bill').toArray();

      const alerts: string[] = [];
      const now = new Date();
      const currentDay = now.getDate();

      // Check recurring bills due within 3 days and not yet paid this month
      bills.forEach((bill) => {
        if (
          bill.dueDayOfMonth != null &&
          bill.lastPaidMonth !== currentMonth
        ) {
          const diffDays = bill.dueDayOfMonth - currentDay;
          if (diffDays >= 0 && diffDays <= 3) {
            alerts.push(
              `Tagihan "${bill.category}" jatuh tempo ${diffDays === 0 ? 'hari ini' : `${diffDays} hari lagi`}`
            );
          }
        }
      });

      // Check debts due within 3 days
      const threeDaysLater = new Date(now);
      threeDaysLater.setDate(threeDaysLater.getDate() + 3);
      const threeDaysStr = threeDaysLater.toISOString().split('T')[0];

      debts.forEach((debt) => {
        if (!debt.isSettled && debt.dueDate) {
          if (debt.dueDate <= threeDaysStr && debt.dueDate >= todayStr) {
            alerts.push(
              `${debt.type === 'payable' ? 'Utang ke' : 'Piutang'} ${debt.personName} jatuh tempo ${debt.dueDate === todayStr ? 'hari ini' : debt.dueDate}`
            );
          }
        }
      });

      return alerts;
    }, []) || [];

  return (
    <AppShell headerTitle="Beranda">
      <div className="space-y-4">
        {/* HERO SECTION: Sapaan & Total Saldo */}
        <NbCard bgColor="#FFE135" className="p-4 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase text-[#0A0A0A] tracking-wider">
                {greeting}
              </p>
              <h1 className="text-lg font-black text-[#0A0A0A] leading-tight mt-0.5">
                Dashboard NoteZ v2.0
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setIsHideBalance(!isHideBalance)}
              className="p-1.5 rounded-lg bg-white border-2 border-[#0A0A0A] shadow-[1.5px_1.5px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] text-[#0A0A0A] cursor-pointer"
              title={isHideBalance ? 'Tampilkan Saldo' : 'Sembunyikan Saldo'}
            >
              {isHideBalance ? (
                <IconEyeOff className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <IconEye className="w-4 h-4 stroke-[2.5]" />
              )}
            </button>
          </div>

          <div className="p-3 bg-white rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-gray-500 uppercase block">
                Total Kekayaan Bersih
              </span>
              <p className="font-mono text-xl font-black text-[#0A0A0A] mt-0.5">
                {isHideBalance ? 'Rp •••••••••' : formatRupiah(totalNetWorth)}
              </p>
            </div>

            <NbButton
              size="sm"
              variant="finance"
              onClick={() => setIsTxModalOpen(true)}
              leftIcon={<IconPlus className="w-3.5 h-3.5 stroke-[3]" />}
            >
              + Transaksi
            </NbButton>
          </div>
        </NbCard>

        {/* URGENT BILLS / DEBTS ALERT BANNER */}
        {urgentAlerts.length > 0 && (
          <Link href="/finance">
            <div className="p-3 bg-orange-100 rounded-xl border-2 border-[#FF6B2B] shadow-[2px_2px_0px_#FF6B2B] flex items-start gap-2.5 cursor-pointer">
              <span className="p-1 rounded-md bg-[#FF6B2B] text-white flex-shrink-0 mt-0.5">
                <IconAlertTriangle className="w-4 h-4 stroke-[3]" />
              </span>
              <div className="min-w-0 flex-1 text-xs">
                <p className="font-extrabold text-[#0A0A0A]">
                  Pemberitahuan Jatuh Tempo ({urgentAlerts.length})
                </p>
                <p className="text-gray-800 font-medium truncate mt-0.5">
                  {urgentAlerts[0]}
                </p>
              </div>
              <IconArrowRight className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1" />
            </div>
          </Link>
        )}

        {/* GRID AKSI CEPAT (QUICK ACTIONS BAR) */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-black uppercase text-gray-600 tracking-wider">
            Aksi Cepat ⚡
          </span>

          <div className="grid grid-cols-5 gap-1.5">
            <button
              type="button"
              onClick={() => setIsTxModalOpen(true)}
              className="p-2 bg-white rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] flex flex-col items-center justify-center text-center cursor-pointer select-none"
            >
              <span className="p-1.5 rounded-lg bg-[#00E676] border border-[#0A0A0A] mb-1">
                <IconWallet className="w-4 h-4 text-[#0A0A0A]" />
              </span>
              <span className="text-[9px] font-black text-[#0A0A0A] leading-tight">
                Transaksi
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsTodoModalOpen(true)}
              className="p-2 bg-white rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] flex flex-col items-center justify-center text-center cursor-pointer select-none"
            >
              <span className="p-1.5 rounded-lg bg-[#3B6FFF] border border-[#0A0A0A] mb-1">
                <IconChecklist className="w-4 h-4 text-white" />
              </span>
              <span className="text-[9px] font-black text-[#0A0A0A] leading-tight">
                Tugas
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsNoteModalOpen(true)}
              className="p-2 bg-white rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] flex flex-col items-center justify-center text-center cursor-pointer select-none"
            >
              <span className="p-1.5 rounded-lg bg-[#FFE135] border border-[#0A0A0A] mb-1">
                <IconNotes className="w-4 h-4 text-[#0A0A0A]" />
              </span>
              <span className="text-[9px] font-black text-[#0A0A0A] leading-tight">
                Catatan
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsMediaModalOpen(true)}
              className="p-2 bg-white rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] flex flex-col items-center justify-center text-center cursor-pointer select-none"
            >
              <span className="p-1.5 rounded-lg bg-[#A855F7] border border-[#0A0A0A] mb-1">
                <IconMovie className="w-4 h-4 text-white" />
              </span>
              <span className="text-[9px] font-black text-[#0A0A0A] leading-tight">
                Tontonan
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsWishlistModalOpen(true)}
              className="p-2 bg-white rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] flex flex-col items-center justify-center text-center cursor-pointer select-none"
            >
              <span className="p-1.5 rounded-lg bg-[#FF4DA6] border border-[#0A0A0A] mb-1">
                <IconCoin className="w-4 h-4 text-white" />
              </span>
              <span className="text-[9px] font-black text-[#0A0A0A] leading-tight">
                Wishlist
              </span>
            </button>
          </div>
        </div>

        {/* FOKUS HARI INI (TODAY'S PRIORITY TASKS) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-[#0A0A0A] tracking-wider flex items-center gap-1.5">
              <IconChecklist className="w-4 h-4 text-[#3B6FFF]" />
              <span>Fokus Tugas Hari Ini ({todayTodos.length})</span>
            </span>
            <Link
              href="/todos"
              className="text-[11px] font-extrabold text-[#3B6FFF] hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          {topFocusTodos.length === 0 ? (
            <NbCard className="p-4 text-center text-gray-500">
              <p className="text-xs font-bold text-[#0A0A0A]">
                Tidak ada tugas mendesak hari ini 🎉
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Semua tugas beres atau kamu belum menambahkan rencana hari ini.
              </p>
            </NbCard>
          ) : (
            <div className="space-y-2">
              {topFocusTodos.map((todo) => (
                <NbCard
                  key={todo.id}
                  className="p-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleTodoStatus(todo.id)}
                      className={cn(
                        'w-5 h-5 rounded-md border-2 border-[#0A0A0A] flex items-center justify-center flex-shrink-0 transition-all cursor-pointer',
                        todo.isCompleted ? 'bg-[#00E676]' : 'bg-white'
                      )}
                    >
                      {todo.isCompleted && (
                        <IconCheck className="w-3.5 h-3.5 text-[#0A0A0A] stroke-[4]" />
                      )}
                    </button>
                    <span
                      className={cn(
                        'text-xs font-extrabold truncate',
                        todo.isCompleted
                          ? 'line-through text-gray-400'
                          : 'text-[#0A0A0A]'
                      )}
                    >
                      {todo.title}
                    </span>
                  </div>

                  <NbBadge
                    variant={
                      todo.priority === 'high'
                        ? 'danger'
                        : todo.priority === 'medium'
                        ? 'warning'
                        : 'secondary'
                    }
                  >
                    {todo.priority.toUpperCase()}
                  </NbBadge>
                </NbCard>
              ))}
            </div>
          )}
        </div>

        {/* HABIT TRACKER ROW */}
        {habits.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#0A0A0A] tracking-wider flex items-center gap-1.5">
                <IconFlame className="w-4 h-4 text-[#FF6B2B]" />
                <span>Pertahankan Streak Habit</span>
              </span>
              <Link
                href="/todos"
                className="text-[11px] font-extrabold text-[#FF6B2B] hover:underline"
              >
                Kelola
              </Link>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {habits.map((habit) => {
                const isDone = habit.completedDates.includes(todayStr);

                return (
                  <button
                    key={habit.id}
                    type="button"
                    onClick={() => toggleHabitToday(habit.id)}
                    className={cn(
                      'p-2.5 min-w-[130px] rounded-xl border-2 border-[#0A0A0A] transition-all cursor-pointer flex flex-col justify-between flex-shrink-0 text-left select-none',
                      isDone
                        ? 'bg-[#00E676] shadow-none'
                        : 'bg-white shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px]'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black truncate max-w-[85px]">
                        {habit.title}
                      </span>
                      <span className="w-4 h-4 rounded border border-[#0A0A0A] flex items-center justify-center bg-white">
                        {isDone && <IconCheck className="w-3 h-3 stroke-[3]" />}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mt-2 text-[10px] font-black">
                      <IconFlame className="w-3 h-3 text-[#FF6B2B] fill-current" />
                      <span>{habit.currentStreak} Hari Streak</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* HIGHLIGHT: WATCHLIST & WISHLIST */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Highlight Watchlist */}
          {currentWatchingMedia ? (
            <NbCard className="p-3.5 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded border border-purple-300">
                    Lanjut Nonton 🎬
                  </span>
                  {currentWatchingMedia.tier && (
                    <NbBadge tier={currentWatchingMedia.tier}>
                      {currentWatchingMedia.tier}-TIER
                    </NbBadge>
                  )}
                </div>
                <h4 className="font-black text-sm text-[#0A0A0A] truncate mt-1">
                  {currentWatchingMedia.title}
                </h4>
                <p className="text-xs font-mono font-bold text-gray-600">
                  Season {currentWatchingMedia.currentSeason} • Ep{' '}
                  {currentWatchingMedia.currentEpisode}
                  {currentWatchingMedia.totalEpisodes
                    ? ` / ${currentWatchingMedia.totalEpisodes}`
                    : ''}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <Link
                  href="/media"
                  className="text-[11px] font-bold text-[#3B6FFF] hover:underline"
                >
                  Detail Tontonan
                </Link>
                <NbButton
                  size="sm"
                  variant="primary"
                  onClick={() => incrementEpisode(currentWatchingMedia.id)}
                  leftIcon={<IconPlus className="w-3.5 h-3.5 stroke-[3]" />}
                >
                  +1 Ep
                </NbButton>
              </div>
            </NbCard>
          ) : (
            <Link href="/media" className="block">
              <NbCard hoverEffect className="p-4 text-center text-gray-500 h-full flex flex-col justify-center">
                <p className="text-xs font-bold text-[#0A0A0A]">
                  Belum ada tontonan aktif 🎬
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Catat Anime atau Film favoritmu sekarang.
                </p>
              </NbCard>
            </Link>
          )}

          {/* Highlight Wishlist */}
          {topWishlist ? (
            <NbCard className="p-3.5 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-pink-700 bg-pink-100 px-1.5 py-0.5 rounded border border-pink-300">
                    Celengan Impian 🌟
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 font-mono">
                    {Math.round(
                      (topWishlist.savedAmount / topWishlist.targetPrice) * 100
                    )}
                    %
                  </span>
                </div>
                <h4 className="font-black text-sm text-[#0A0A0A] truncate mt-1">
                  {topWishlist.name}
                </h4>
                <p className="text-xs font-mono font-bold text-[#00A854]">
                  {formatRupiah(topWishlist.savedAmount)}{' '}
                  <span className="text-gray-400 font-normal">
                    / {formatRupiah(topWishlist.targetPrice)}
                  </span>
                </p>
              </div>

              {/* Progress */}
              <div className="w-full h-2 rounded-full bg-gray-200 border border-[#0A0A0A] overflow-hidden">
                <div
                  className="h-full bg-[#FF4DA6]"
                  style={{
                    width: `${Math.min(
                      Math.round(
                        (topWishlist.savedAmount / topWishlist.targetPrice) * 100
                      ),
                      100
                    )}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <Link
                  href="/wishlist"
                  className="text-[11px] font-bold text-[#FF4DA6] hover:underline"
                >
                  Lihat Semua
                </Link>
                <Link href="/wishlist">
                  <NbButton size="sm" variant="wishlist">
                    Nabung
                  </NbButton>
                </Link>
              </div>
            </NbCard>
          ) : (
            <Link href="/wishlist" className="block">
              <NbCard hoverEffect className="p-4 text-center text-gray-500 h-full flex flex-col justify-center">
                <p className="text-xs font-bold text-[#0A0A0A]">
                  Belum ada target wishlist 🌟
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Tambahkan barang impian dan tabung bertahap.
                </p>
              </NbCard>
            </Link>
          )}
        </div>

        {/* MODALS UNTUK QUICK ACTIONS */}
        <TransactionModal
          isOpen={isTxModalOpen}
          onClose={() => setIsTxModalOpen(false)}
          wallets={wallets}
        />
        <TodoModal
          isOpen={isTodoModalOpen}
          onClose={() => setIsTodoModalOpen(false)}
        />
        <NoteModal
          isOpen={isNoteModalOpen}
          onClose={() => setIsNoteModalOpen(false)}
        />
        <MediaModal
          isOpen={isMediaModalOpen}
          onClose={() => setIsMediaModalOpen(false)}
        />
        <WishlistModal
          isOpen={isWishlistModalOpen}
          onClose={() => setIsWishlistModalOpen(false)}
        />
      </div>
    </AppShell>
  );
}
