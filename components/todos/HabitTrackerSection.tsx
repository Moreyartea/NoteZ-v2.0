'use client';

import React, { useState } from 'react';
import {
  IconCheck,
  IconFlame,
  IconTrophy,
  IconTrash,
} from '@tabler/icons-react';
import type { Habit } from '@/app/lib/types';
import { NbCard } from '@/components/ui/NbCard';
import { NbConfirmModal } from '@/components/ui/NbConfirmModal';
import {
  toggleHabitToday,
  deleteHabit,
  getLocalTodayDateString,
  formatDateToString,
} from '@/app/lib/services/habitService';
import { cn } from '@/app/lib/utils';

export interface HabitTrackerSectionProps {
  habits: Habit[];
  onOpenModal: () => void;
}

const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export const HabitTrackerSection: React.FC<HabitTrackerSectionProps> = ({
  habits,
  onOpenModal,
}) => {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const todayStr = getLocalTodayDateString();

  // Generate last 7 days list (from 6 days ago up to today)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      dateStr: formatDateToString(d),
      dayLabel: dayNames[d.getDay()],
      dateNum: d.getDate(),
      isToday: formatDateToString(d) === todayStr,
    };
  });

  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      setIsDeleting(true);
      await deleteHabit(pendingDeleteId);
      setPendingDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-[#0A0A0A] dark:text-[var(--theme-text-primary)] uppercase tracking-wide flex items-center gap-1.5">
          <IconFlame className="w-4 h-4 text-[#FF6B2B]" />
          <span>Kebiasaan Harian ({habits.length})</span>
        </h2>
      </div>

      {habits.length === 0 ? (
        <NbCard className="p-6 text-center text-gray-500 dark:text-[var(--theme-text-muted)]">
          <p className="text-sm font-bold text-[#0A0A0A] dark:text-[var(--theme-text-primary)]">Belum ada kebiasaan rutin</p>
          <p className="text-xs text-gray-500 dark:text-[var(--theme-text-muted)] mt-1">
            Tekan "+ Tambah Habit" untuk mulai membangun kebiasaan produktif setiap hari.
          </p>
        </NbCard>
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => {
            const isDoneToday = habit.completedDates.includes(todayStr);

            return (
              <NbCard key={habit.id} className="p-4 space-y-3">
                {/* Habit Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {/* Big Checkbox for Today */}
                    <button
                      type="button"
                      onClick={() => toggleHabitToday(habit.id)}
                      className={cn(
                        'w-9 h-9 rounded-xl border-[2.5px] border-[#0A0A0A] dark:border-[var(--theme-border)] flex items-center justify-center transition-all cursor-pointer',
                        isDoneToday
                          ? 'bg-[#00E676] text-[#0A0A0A] shadow-none scale-95'
                          : 'bg-white dark:bg-[var(--theme-surface-elevated)] shadow-[3px_3px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_var(--theme-shadow)] active:translate-x-[1px] active:translate-y-[1px]'
                      )}
                      title={isDoneToday ? 'Tandai belum selesai' : 'Tandai selesai hari ini!'}
                    >
                      {isDoneToday && (
                        <IconCheck className="w-6 h-6 text-[#0A0A0A] stroke-[3.5]" />
                      )}
                    </button>

                    <div>
                      <h3 className="font-extrabold text-sm text-[#0A0A0A] dark:text-[var(--theme-text-primary)] leading-tight">
                        {habit.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-gray-600 dark:text-[var(--theme-text-muted)] mt-0.5">
                        {isDoneToday ? 'Selesai hari ini' : 'Belum selesai hari ini'}
                      </p>
                    </div>
                  </div>

                  {/* Streak Badges */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#FFE135] dark:bg-[var(--theme-accent-primary)] text-[#0A0A0A] dark:text-[var(--theme-accent-text)] font-black text-xs border-2 border-[#0A0A0A] dark:border-[var(--theme-border-hero)] shadow-[1.5px_1.5px_0px_#0A0A0A] dark:shadow-[1.5px_1.5px_0px_#000000]">
                      <IconFlame className="w-3.5 h-3.5 text-[#FF6B2B] fill-current" />
                      <span>{habit.currentStreak} Hari</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDelete(habit.id)}
                      className="p-1.5 text-gray-400 dark:text-[var(--theme-text-muted)] hover:text-red-500 transition-all cursor-pointer"
                      title="Hapus habit"
                    >
                      <IconTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 7 Days Row */}
                <div className="pt-2 border-t-2 border-[#0A0A0A]/20 dark:border-[var(--theme-border-subtle)]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-[var(--theme-text-muted)] uppercase tracking-wider">
                      7 Hari Terakhir
                    </span>
                    <span className="text-[10px] font-bold text-gray-600 dark:text-[var(--theme-text-muted)] flex items-center gap-1">
                      <IconTrophy className="w-3 h-3 text-amber-500" />
                      Rekor: {habit.bestStreak} hari
                    </span>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center">
                    {last7Days.map((day) => {
                      const isCompleted = habit.completedDates.includes(day.dateStr);

                      return (
                        <div
                          key={day.dateStr}
                          className={cn(
                            'p-1.5 rounded-lg border-2 flex flex-col items-center justify-center transition-all',
                            day.isToday
                              ? 'border-[#0A0A0A] dark:border-[var(--theme-accent-primary)] ring-2 ring-black/10 dark:ring-white/20'
                              : 'border-[#0A0A0A]/30 dark:border-[var(--theme-border-subtle)]',
                            isCompleted
                              ? 'bg-[#00E676] text-[#0A0A0A] font-bold border-[#0A0A0A] dark:border-[#00E676]'
                              : 'bg-gray-100 dark:bg-[var(--theme-surface-elevated)] text-gray-500 dark:text-[var(--theme-text-muted)]'
                          )}
                        >
                          <span className="text-[9px] font-bold uppercase leading-tight">
                            {day.dayLabel}
                          </span>
                          <span className="text-xs font-black mt-0.5 leading-tight flex items-center justify-center">
                            {isCompleted ? (
                              <IconCheck className="w-3.5 h-3.5 stroke-[3.5]" />
                            ) : (
                              day.dateNum
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </NbCard>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      <NbConfirmModal
        isOpen={!!pendingDeleteId}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="HAPUS KEBIASAAN"
        message="Hapus kebiasaan ini beserta seluruh riwayat streak-nya? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

