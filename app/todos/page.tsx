'use client';

import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  IconChecklist,
  IconFlame,
  IconClock,
  IconPlus,
} from '@tabler/icons-react';
import { db } from '@/app/lib/db';
import { AppShell } from '@/components/layout/AppShell';
import { NbCard } from '@/components/ui/NbCard';
import { TodoListSection } from '@/components/todos/TodoListSection';
import { TodoModal } from '@/components/todos/TodoModal';
import { HabitTrackerSection } from '@/components/todos/HabitTrackerSection';
import { HabitModal } from '@/components/todos/HabitModal';
import { PomodoroSection } from '@/components/todos/PomodoroSection';
import { getLocalTodayDateString } from '@/app/lib/services/todoService';
import { cn } from '@/app/lib/utils';

type TodoSubTab = 'todos' | 'habits' | 'pomodoro';

export default function TodosPage() {
  const [activeTab, setActiveTab] = useState<TodoSubTab>('todos');
  const [isTodoModalOpen, setIsTodoModalOpen] = useState<boolean>(false);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState<boolean>(false);

  const todayStr = getLocalTodayDateString();

  // Reactive Dexie queries
  const todos =
    useLiveQuery(async () => {
      if (typeof window === 'undefined') return [];
      const list = await db.todos.toArray();
      return list.sort((a, b) => {
        // Priority weight
        const weight: Record<string, number> = { high: 3, medium: 2, low: 1 };
        const diff = (weight[b.priority] || 1) - (weight[a.priority] || 1);
        if (diff !== 0) return diff;
        return (a.dueDate || '').localeCompare(b.dueDate || '');
      });
    }, []) || [];

  const habits =
    useLiveQuery(async () => {
      if (typeof window === 'undefined') return [];
      const list = await db.habits.toArray();
      return list.sort((a, b) => b.currentStreak - a.currentStreak);
    }, []) || [];

  // Metrics
  const todayTasks = todos.filter((t) => t.dueDate === todayStr);
  const completedTodayTasks = todayTasks.filter((t) => t.isCompleted);
  const habitCompletedToday = habits.filter((h) =>
    h.completedDates.includes(todayStr)
  );

  return (
    <AppShell headerTitle="Tugas & Habit">
      <div className="space-y-4">
        {/* HERO CARD: Ringkasan Fokus Harian */}
        <NbCard
          isHero={true}
          bgColor="#3B6FFF"
          className="p-4 text-white dark:bg-[var(--theme-surface)] dark:text-[var(--theme-text-primary)] dark:border-[var(--theme-border-hero)] space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#0A0A0A] bg-[#FFE135] px-2 py-0.5 rounded-md border-2 border-[#0A0A0A] shadow-[1.5px_1.5px_0px_#0A0A0A]">
              Fokus Hari Ini
            </span>
            <span className="text-xs font-bold text-blue-100 dark:text-[var(--theme-text-muted)] font-mono">
              {todayStr}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-white/10 dark:bg-[var(--theme-surface-elevated)] backdrop-blur-sm p-2.5 rounded-xl border border-white/20 dark:border-[var(--theme-border-subtle)]">
              <p className="text-[10px] font-bold text-blue-200 dark:text-[var(--theme-text-muted)] uppercase leading-tight">
                Tugas Hari Ini
              </p>
              <p className="text-lg font-black font-mono text-white dark:text-[var(--theme-text-primary)] mt-1">
                {completedTodayTasks.length} / {todayTasks.length} Selesai
              </p>
            </div>

            <div className="bg-white/10 dark:bg-[var(--theme-surface-elevated)] backdrop-blur-sm p-2.5 rounded-xl border border-white/20 dark:border-[var(--theme-border-subtle)]">
              <p className="text-[10px] font-bold text-blue-200 dark:text-[var(--theme-text-muted)] uppercase leading-tight">
                Habit Tuntas
              </p>
              <p className="text-lg font-black font-mono text-white dark:text-[var(--theme-text-primary)] mt-1">
                {habitCompletedToday.length} / {habits.length} Hari Ini
              </p>
            </div>
          </div>
        </NbCard>

        {/* Sub-Tabs Switcher */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-white dark:bg-[var(--theme-surface)] rounded-xl border-2 border-[#0A0A0A] dark:border-[var(--theme-border-subtle)] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_var(--theme-shadow)]">
          <button
            type="button"
            onClick={() => setActiveTab('todos')}
            className={cn(
              'py-2 text-xs font-black rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer select-none',
              activeTab === 'todos'
                ? 'bg-[#FFE135] dark:bg-[var(--theme-accent-primary)] text-[#0A0A0A] dark:text-[var(--theme-accent-text)] border-2 border-[#0A0A0A] dark:border-[var(--theme-border-hero)] shadow-[1.5px_1.5px_0px_#0A0A0A]'
                : 'text-gray-600 dark:text-[var(--theme-text-muted)] hover:text-[#0A0A0A] dark:hover:text-[var(--theme-text-primary)]'
            )}
          >
            <IconChecklist className="w-4 h-4 stroke-[2.5]" />
            <span>Tugas ({todos.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('habits')}
            className={cn(
              'py-2 text-xs font-black rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer select-none',
              activeTab === 'habits'
                ? 'bg-[#FF6B2B] text-white border-2 border-[#0A0A0A] shadow-[1.5px_1.5px_0px_#0A0A0A]'
                : 'text-gray-600 dark:text-[var(--theme-text-muted)] hover:text-[#0A0A0A] dark:hover:text-[var(--theme-text-primary)]'
            )}
          >
            <IconFlame className="w-4 h-4 stroke-[2.5]" />
            <span>Habit ({habits.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pomodoro')}
            className={cn(
              'py-2 text-xs font-black rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer select-none',
              activeTab === 'pomodoro'
                ? 'bg-[#3B6FFF] text-white border-2 border-[#0A0A0A] shadow-[1.5px_1.5px_0px_#0A0A0A]'
                : 'text-gray-600 dark:text-[var(--theme-text-muted)] hover:text-[#0A0A0A] dark:hover:text-[var(--theme-text-primary)]'
            )}
          >
            <IconClock className="w-4 h-4 stroke-[2.5]" />
            <span>Pomodoro</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        {activeTab === 'todos' && (
          <TodoListSection
            todos={todos}
            onOpenModal={() => setIsTodoModalOpen(true)}
          />
        )}

        {activeTab === 'habits' && (
          <HabitTrackerSection
            habits={habits}
            onOpenModal={() => setIsHabitModalOpen(true)}
          />
        )}

        {activeTab === 'pomodoro' && <PomodoroSection />}

        {/* Dynamic Floating Action Button (FAB) */}
        {activeTab !== 'pomodoro' && (
          <div className="fixed bottom-20 right-4 z-30">
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'todos') setIsTodoModalOpen(true);
                else setIsHabitModalOpen(true);
              }}
              aria-label={activeTab === 'todos' ? 'Tambah Tugas' : 'Tambah Habit'}
              className="w-14 h-14 rounded-2xl bg-[#FFE135] dark:bg-[var(--theme-accent-primary)] text-[#0A0A0A] dark:text-[var(--theme-accent-text)] border-[3px] border-[#0A0A0A] dark:border-[var(--theme-border-hero)] shadow-[4px_4px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_var(--theme-shadow)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#0A0A0A] flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
            >
              <IconPlus className="w-8 h-8 stroke-[3]" />
            </button>
          </div>
        )}

        {/* MODALS */}
        <TodoModal
          isOpen={isTodoModalOpen}
          onClose={() => setIsTodoModalOpen(false)}
        />
        <HabitModal
          isOpen={isHabitModalOpen}
          onClose={() => setIsHabitModalOpen(false)}
        />
      </div>
    </AppShell>
  );
}
