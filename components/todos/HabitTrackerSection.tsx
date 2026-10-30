'use client';

import React from 'react';
import {
  IconCheck,
  IconFlame,
  IconTrophy,
  IconTrash,
} from '@tabler/icons-react';
import type { Habit } from '@/app/lib/types';
import { NbCard } from '@/components/ui/NbCard';
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

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus kebiasaan ini beserta seluruh riwayat streak-nya?')) {
      await deleteHabit(id);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-[#0A0A0A] uppercase tracking-wide flex items-center gap-1.5">
          <IconFlame className="w-4 h-4 text-[#FF6B2B]" />
          <span>Kebiasaan Harian ({habits.length})</span>
        </h2>
      </div>

      {habits.length === 0 ? (
        <NbCard className="p-6 text-center text-gray-500">
          <p className="text-sm font-bold text-[#0A0A0A]">Belum ada kebiasaan rutin</p>
          <p className="text-xs text-gray-500 mt-1">
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
                        'w-9 h-9 rounded-xl border-[2.5px] border-[#0A0A0A] flex items-center justify-center transition-all cursor-pointer',
                        isDoneToday
                          ? 'bg-[#00E676] shadow-none scale-95'
                          : 'bg-white shadow-[3px_3px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px]'
                      )}
                      title={isDoneToday ? 'Tandai belum selesai' : 'Tandai selesai hari ini!'}
                    >
                      {isDoneToday && (
                        <IconCheck className="w-6 h-6 text-[#0A0A0A] stroke-[3.5]" />
                      )}
                    </button>

                    <div>
                      <h3 className="font-extrabold text-sm text-[#0A0A0A] leading-tight">
                        {habit.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-gray-600 mt-0.5">
                        {isDoneToday ? '✅ Selesai hari ini!' : 'Belum selesai hari ini'}
                      </p>
                    </div>
                  </div>

                  {/* Streak Badges */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#FFE135] text-[#0A0A0A] font-black text-xs border-2 border-[#0A0A0A] shadow-[1.5px_1.5px_0px_#0A0A0A]">
                      <IconFlame className="w-3.5 h-3.5 text-[#FF6B2B] fill-current" />
                      <span>{habit.currentStreak} Hari</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDelete(habit.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-all cursor-pointer"
                      title="Hapus habit"
                    >
                      <IconTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 7 Days Row */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      7 Hari Terakhir
                    </span>
                    <span className="text-[10px] font-bold text-gray-600 flex items-center gap-1">
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
                            'p-1.5 rounded-lg border flex flex-col items-center justify-center transition-all',
                            day.isToday && 'border-2 border-[#0A0A0A]',
                            isCompleted
                              ? 'bg-[#00E676] text-[#0A0A0A] font-bold border-[#0A0A0A]'
                              : 'bg-gray-100 text-gray-500 border-gray-200'
                          )}
                        >
                          <span className="text-[9px] font-bold uppercase leading-none">
                            {day.dayLabel}
                          </span>
                          <span className="text-xs font-black mt-0.5 leading-none">
                            {isCompleted ? '✓' : day.dateNum}
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
    </div>
  );
};

