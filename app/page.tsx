'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  IconEye,
  IconEyeOff,
  IconWallet,
  IconChecklist,
  IconNotes,
  IconDeviceTv,
  IconFlame,
  IconCheck,
  IconCalendarCheck,
} from '@tabler/icons-react';
import { db } from '@/app/lib/db';
import { AppShell } from '@/components/layout/AppShell';
import { NbCard } from '@/components/ui/NbCard';
import { NbBadge } from '@/components/ui/NbBadge';
import { formatRupiah, cn } from '@/app/lib/utils';
import {
  toggleTodoStatus,
  getLocalTodayDateString,
} from '@/app/lib/services/todoService';
import { toggleHabitToday } from '@/app/lib/services/habitService';
import { TransactionModal } from '@/components/finance/TransactionModal';
import { TodoModal } from '@/components/todos/TodoModal';
import { NoteModal } from '@/components/notes/NoteModal';
import { MediaModal } from '@/components/media/MediaModal';

/**
 * NoteZ v2.0 Streamlined Dashboard
 * 1-Screen Focus Design:
 * - Card 1: Financial & Quick Action Bar (All-in-One)
 * - Card 2: Today's Agenda (Clean Tasks List + 1-Line Habit Row)
 */
export default function DashboardPage() {
  const [isHideBalance, setIsHideBalance] = useState<boolean>(false);

  // Quick Action Modal states
  const [isTxModalOpen, setIsTxModalOpen] = useState<boolean>(false);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState<boolean>(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState<boolean>(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState<boolean>(false);

  const todayStr = getLocalTodayDateString();

  // 1. Reactive Wallets & Total Balance
  const wallets =
    useLiveQuery(async () => {
      if (typeof window === 'undefined') return [];
      return await db.wallets.toArray();
    }, []) || [];

  const totalNetWorth = wallets.reduce((acc, w) => acc + w.balance, 0);

  // 2. Reactive Today's Todos
  const todos =
    useLiveQuery(async () => {
      if (typeof window === 'undefined') return [];
      const list = await db.todos.toArray();
      return list.sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
        const priorityScore: Record<string, number> = { high: 3, medium: 2, low: 1 };
        return (priorityScore[b.priority] || 1) - (priorityScore[a.priority] || 1);
      });
    }, []) || [];

  const todayTodos = todos.filter(
    (t) => t.dueDate === todayStr || t.pinToHomeWidget
  );
  const topTodos = todayTodos.slice(0, 4);
  const completedTodayCount = todayTodos.filter((t) => t.isCompleted).length;

  // 3. Reactive Habits
  const habits =
    useLiveQuery(async () => {
      if (typeof window === 'undefined') return [];
      const list = await db.habits.toArray();
      return list.sort((a, b) => b.currentStreak - a.currentStreak);
    }, []) || [];

  return (
    <AppShell headerTitle="Beranda">
      <div className="space-y-3.5">
        {/* CARD 1: Financial & Quick Action (All-in-One) */}
        <NbCard
          bgColor="#FFFDF7"
          className="p-4 rounded-2xl border-[3px] border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] space-y-3.5"
        >
          {/* Top Section: Net Worth & Balance Peek Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 block">
                Kekayaan Bersih
              </span>
              <p className="font-mono text-2xl font-black text-[#0A0A0A] tracking-tight mt-0.5">
                {isHideBalance ? 'Rp •••••••••' : formatRupiah(totalNetWorth)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsHideBalance(!isHideBalance)}
              className="p-2 rounded-xl bg-white border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] text-[#0A0A0A] cursor-pointer"
              title={isHideBalance ? 'Tampilkan Saldo' : 'Sembunyikan Saldo'}
              aria-label="Toggle sensor intip saldo"
            >
              {isHideBalance ? (
                <IconEyeOff className="w-5 h-5 stroke-[2.5]" />
              ) : (
                <IconEye className="w-5 h-5 stroke-[2.5]" />
              )}
            </button>
          </div>

          {/* Thin Black Divider */}
          <div className="border-t-2 border-[#0A0A0A]" />

          {/* Bottom Section: 4 Quick Actions in 1 Row */}
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setIsTxModalOpen(true)}
              className="py-2 px-1 bg-white hover:bg-emerald-50 rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] flex flex-col items-center justify-center text-center cursor-pointer select-none transition-transform"
            >
              <div className="w-7 h-7 rounded-lg bg-[#00E676] border border-[#0A0A0A] flex items-center justify-center mb-1">
                <IconWallet className="w-4 h-4 text-[#0A0A0A] stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black text-[#0A0A0A] leading-tight">
                + Transaksi
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsTodoModalOpen(true)}
              className="py-2 px-1 bg-white hover:bg-blue-50 rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] flex flex-col items-center justify-center text-center cursor-pointer select-none transition-transform"
            >
              <div className="w-7 h-7 rounded-lg bg-[#3B6FFF] border border-[#0A0A0A] flex items-center justify-center mb-1">
                <IconChecklist className="w-4 h-4 text-white stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black text-[#0A0A0A] leading-tight">
                + Tugas
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsNoteModalOpen(true)}
              className="py-2 px-1 bg-white hover:bg-yellow-50 rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] flex flex-col items-center justify-center text-center cursor-pointer select-none transition-transform"
            >
              <div className="w-7 h-7 rounded-lg bg-[#FFE135] border border-[#0A0A0A] flex items-center justify-center mb-1">
                <IconNotes className="w-4 h-4 text-[#0A0A0A] stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black text-[#0A0A0A] leading-tight">
                + Catatan
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsMediaModalOpen(true)}
              className="py-2 px-1 bg-white hover:bg-purple-50 rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] flex flex-col items-center justify-center text-center cursor-pointer select-none transition-transform"
            >
              <div className="w-7 h-7 rounded-lg bg-[#A855F7] border border-[#0A0A0A] flex items-center justify-center mb-1">
                <IconDeviceTv className="w-4 h-4 text-white stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black text-[#0A0A0A] leading-tight">
                + Tontonan
              </span>
            </button>
          </div>
        </NbCard>

        {/* CARD 2: Agenda Hari Ini (Tugas & Habit Terpadu) */}
        <NbCard
          bgColor="#FFFDF7"
          className="p-4 rounded-2xl border-[3px] border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] space-y-3"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <IconCalendarCheck className="w-4 h-4 text-[#0A0A0A] stroke-[2.5]" />
              <h2 className="text-sm font-black text-[#0A0A0A] tracking-tight">
                Agenda Hari Ini
              </h2>
              {todayTodos.length > 0 && (
                <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-gray-100 border border-[#0A0A0A] text-[#0A0A0A]">
                  {completedTodayCount}/{todayTodos.length}
                </span>
              )}
            </div>

            <Link
              href="/todos"
              className="text-xs font-black text-[#3B6FFF] hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          {/* Today's Tasks List (Max 4 items, 1-line clean list) */}
          <div className="space-y-1.5">
            {topTodos.length === 0 ? (
              <div className="py-4 text-center">
                <p className="text-xs font-bold text-gray-500">
                  Semua tugas hari ini beres!
                </p>
              </div>
            ) : (
              topTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between gap-2.5 p-2 rounded-xl bg-white border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => toggleTodoStatus(todo.id)}
                      className={cn(
                        'w-5 h-5 rounded-md border-2 border-[#0A0A0A] flex items-center justify-center flex-shrink-0 transition-all cursor-pointer',
                        todo.isCompleted ? 'bg-[#00E676]' : 'bg-white'
                      )}
                      aria-label="Toggle status tugas"
                    >
                      {todo.isCompleted && (
                        <IconCheck className="w-3.5 h-3.5 text-[#0A0A0A] stroke-[4]" />
                      )}
                    </button>
                    <span
                      className={cn(
                        'text-xs font-black truncate',
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
                    className="text-[9px] px-1.5 py-0.5 uppercase"
                  >
                    {todo.priority}
                  </NbBadge>
                </div>
              ))
            )}
          </div>

          {/* Thin Black Divider */}
          <div className="border-t-2 border-[#0A0A0A] pt-2.5" />

          {/* Habit Harian: 1 Baris Horizontal Ringkas */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-1 flex-shrink-0 text-[#FF6B2B]">
              <IconFlame className="w-4 h-4 stroke-[2.5]" />
              <span className="text-[11px] font-black uppercase text-[#0A0A0A]">
                Habit:
              </span>
            </div>

            {habits.length === 0 ? (
              <span className="text-xs text-gray-400 font-bold">
                Belum ada habit harian
              </span>
            ) : (
              habits.map((habit) => {
                const isDone = habit.completedDates.includes(todayStr);

                return (
                  <button
                    key={habit.id}
                    type="button"
                    onClick={() => toggleHabitToday(habit.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border-2 border-[#0A0A0A] text-xs font-black transition-all flex-shrink-0 select-none cursor-pointer',
                      isDone
                        ? 'bg-[#00E676] text-[#0A0A0A] shadow-none'
                        : 'bg-white text-gray-800 shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px]'
                    )}
                  >
                    <span
                      className={cn(
                        'w-3.5 h-3.5 rounded-full border border-[#0A0A0A] flex items-center justify-center',
                        isDone ? 'bg-white text-[#0A0A0A]' : 'bg-gray-100'
                      )}
                    >
                      {isDone && <IconCheck className="w-2.5 h-2.5 stroke-[4]" />}
                    </span>
                    <span className="truncate max-w-[85px]">
                      {habit.title}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </NbCard>

        {/* Quick Action Modals */}
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
      </div>
    </AppShell>
  );
}
