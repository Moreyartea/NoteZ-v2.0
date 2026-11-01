'use client';

import React from 'react';
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconRotateClockwise,
  IconPlayerSkipForward,
  IconFlame,
  IconCoffee,
  IconStar,
} from '@tabler/icons-react';
import { NbCard } from '@/components/ui/NbCard';
import { NbButton } from '@/components/ui/NbButton';
import { NbBadge } from '@/components/ui/NbBadge';
import { usePomodoro } from '@/app/lib/hooks/usePomodoro';
import { cn } from '@/app/lib/utils';

export const PomodoroSection: React.FC = () => {
  const {
    mode,
    isRunning,
    formattedTime,
    progressPercent,
    sessionsCompleted,
    workMinutes,
    breakMinutes,
    start,
    pause,
    reset,
    skipMode,
    setDurations,
  } = usePomodoro();

  const isWork = mode === 'work';

  return (
    <div className="space-y-4">
      {/* Timer Container Card */}
      <NbCard
        bgColor={isWork ? undefined : '#E8F5E9'}
        className="p-6 flex flex-col items-center justify-center text-center space-y-5"
      >
        {/* Mode Indicator Badge */}
        <div className="flex items-center gap-2">
          <NbBadge
            variant={isWork ? 'warning' : 'finance'}
            icon={
              isWork ? (
                <IconFlame className="w-3.5 h-3.5 fill-current" />
              ) : (
                <IconCoffee className="w-3.5 h-3.5" />
              )
            }
          >
            {isWork ? `Fokus Kerja (${workMinutes}m)` : `Istirahat Santai (${breakMinutes}m)`}
          </NbBadge>

          {sessionsCompleted > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-black bg-[#FFE135] text-[#0A0A0A] px-2 py-0.5 rounded-md border-2 border-[#0A0A0A] shadow-[1px_1px_0px_#0A0A0A]">
              <IconStar className="w-3 h-3 fill-current text-amber-600" />
              <span>{sessionsCompleted} Selesai</span>
            </span>
          )}
        </div>

        {/* Big Digital Timer Display */}
        <div className="p-6 bg-white dark:bg-[var(--theme-surface)] rounded-3xl border-[3.5px] border-[#0A0A0A] dark:border-[var(--theme-border)] shadow-[6px_6px_0px_#0A0A0A] dark:shadow-[6px_6px_0px_#000000] w-full max-w-[280px]">
          <span className="font-mono text-5xl font-black text-[#0A0A0A] dark:text-[var(--theme-text-primary)] tracking-wider select-none">
            {formattedTime}
          </span>

          {/* Progress Bar */}
          <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-[#0A0A0A] dark:border-[var(--theme-border)] overflow-hidden p-0.5 mt-4 shadow-inner">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300',
                isWork ? 'bg-[#FF6B2B]' : 'bg-[#00E676]'
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[10px] font-bold text-gray-500 dark:text-[var(--theme-text-muted)] mt-1">
            {progressPercent}% waktu berjalan
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <NbButton
            size="lg"
            variant={isRunning ? 'neutral' : isWork ? 'warning' : 'finance'}
            onClick={isRunning ? pause : start}
            className="w-32"
            leftIcon={
              isRunning ? (
                <IconPlayerPause className="w-5 h-5 stroke-[2.5]" />
              ) : (
                <IconPlayerPlay className="w-5 h-5 stroke-[2.5] fill-current" />
              )
            }
          >
            {isRunning ? 'Jeda' : 'Mulai'}
          </NbButton>

          <button
            type="button"
            onClick={reset}
            className="w-12 h-12 rounded-xl bg-white dark:bg-[var(--theme-surface)] text-[#0A0A0A] dark:text-[var(--theme-text-primary)] border-[2.5px] border-[#0A0A0A] dark:border-[var(--theme-border)] shadow-[3px_3px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#0A0A0A] flex items-center justify-center transition-all cursor-pointer"
            title="Reset Timer"
          >
            <IconRotateClockwise className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={skipMode}
            className="w-12 h-12 rounded-xl bg-white dark:bg-[var(--theme-surface)] text-[#0A0A0A] dark:text-[var(--theme-text-primary)] border-[2.5px] border-[#0A0A0A] dark:border-[var(--theme-border)] shadow-[3px_3px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#0A0A0A] flex items-center justify-center transition-all cursor-pointer"
            title="Ganti Mode (Skip)"
          >
            <IconPlayerSkipForward className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </NbCard>

      {/* Preset Duration Selector */}
      <NbCard className="p-3.5 space-y-2">
        <span className="text-xs font-black text-[#0A0A0A] block uppercase tracking-wide">
          Pilihan Durasi Sesi:
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDurations(25, 5)}
            className={cn(
              'p-2.5 rounded-xl border-2 border-[#0A0A0A] text-left transition-all cursor-pointer',
              workMinutes === 25
                ? 'bg-[#FFE135] shadow-[2px_2px_0px_#0A0A0A]'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            )}
          >
            <p className="text-xs font-extrabold text-[#0A0A0A]">
              Klasik (25 / 5 Menit)
            </p>
            <p className="text-[10px] text-gray-600 mt-0.5">
              Standar fokus Pomodoro optimal.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setDurations(50, 10)}
            className={cn(
              'p-2.5 rounded-xl border-2 border-[#0A0A0A] text-left transition-all cursor-pointer',
              workMinutes === 50
                ? 'bg-[#FFE135] shadow-[2px_2px_0px_#0A0A0A]'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            )}
          >
            <p className="text-xs font-extrabold text-[#0A0A0A]">
              Deep Work (50 / 10 Menit)
            </p>
            <p className="text-[10px] text-gray-600 mt-0.5">
              Fokus mendalam tugas kompleks.
            </p>
          </button>
        </div>
      </NbCard>
    </div>
  );
};

