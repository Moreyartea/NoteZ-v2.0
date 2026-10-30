'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export type PomodoroMode = 'work' | 'break';

export interface UsePomodoroOptions {
  initialWorkMinutes?: number;
  initialBreakMinutes?: number;
}

export interface UsePomodoroReturn {
  mode: PomodoroMode;
  timeLeft: number;
  isRunning: boolean;
  workMinutes: number;
  breakMinutes: number;
  sessionsCompleted: number;
  progressPercent: number;
  formattedTime: string;
  start: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
  skipMode: () => void;
  setDurations: (work: number, breakTime: number) => void;
}

function playBeepSound() {
  try {
    if (typeof window === 'undefined') return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // 880Hz beep
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);

    // Vibration API
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([250, 100, 250]);
    }
  } catch {
    // AudioContext blocked or not supported
  }
}

/**
 * usePomodoro - Anti-Lag Isolated Timer Hook
 * State is isolated and self-contained to avoid re-rendering unrelated UI trees.
 */
export function usePomodoro({
  initialWorkMinutes = 25,
  initialBreakMinutes = 5,
}: UsePomodoroOptions = {}): UsePomodoroReturn {
  const [workMinutes, setWorkMinutes] = useState<number>(initialWorkMinutes);
  const [breakMinutes, setBreakMinutes] = useState<number>(initialBreakMinutes);
  const [mode, setMode] = useState<PomodoroMode>('work');
  const [timeLeft, setTimeLeft] = useState<number>(initialWorkMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionsCompleted, setSessionsCompleted] = useState<number>(0);

  const totalDuration = (mode === 'work' ? workMinutes : breakMinutes) * 60;
  const progressPercent = Math.min(
    Math.round(((totalDuration - timeLeft) / totalDuration) * 100),
    100
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const switchMode = useCallback(
    (nextMode?: PomodoroMode) => {
      const target = nextMode || (mode === 'work' ? 'break' : 'work');
      setMode(target);
      const newDuration = (target === 'work' ? workMinutes : breakMinutes) * 60;
      setTimeLeft(newDuration);
      setIsRunning(false);
    },
    [mode, workMinutes, breakMinutes]
  );

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            playBeepSound();
            if (mode === 'work') {
              setSessionsCompleted((s) => s + 1);
            }
            switchMode();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, mode, switchMode]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const toggle = useCallback(() => setIsRunning((prev) => !prev), []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft((mode === 'work' ? workMinutes : breakMinutes) * 60);
  }, [mode, workMinutes, breakMinutes]);

  const skipMode = useCallback(() => {
    setIsRunning(false);
    switchMode();
  }, [switchMode]);

  const setDurations = useCallback((work: number, breakTime: number) => {
    setWorkMinutes(work);
    setBreakMinutes(breakTime);
    setTimeLeft(work * 60);
    setMode('work');
    setIsRunning(false);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return {
    mode,
    timeLeft,
    isRunning,
    workMinutes,
    breakMinutes,
    sessionsCompleted,
    progressPercent,
    formattedTime,
    start,
    pause,
    toggle,
    reset,
    skipMode,
    setDurations,
  };
}

