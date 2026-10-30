import { db } from '@/app/lib/db';
import type { Habit } from '@/app/lib/types';

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
}

export function getLocalTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateToString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Calculates current consecutive streak days.
 * An active streak can start from today or yesterday (grace period before today's completion).
 */
export function calculateStreak(completedDates: string[]): number {
  if (!completedDates || completedDates.length === 0) return 0;

  const dateSet = new Set(completedDates);
  const now = new Date();
  const todayStr = getLocalTodayDateString();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateToString(yesterday);

  let checkDate = new Date(now);
  if (!dateSet.has(todayStr)) {
    if (dateSet.has(yesterdayStr)) {
      checkDate = yesterday;
    } else {
      return 0; // Streak broken
    }
  }

  let streak = 0;
  while (dateSet.has(formatDateToString(checkDate))) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}

/**
 * habitService - Habit Tracker & Streak Calculation Service Layer
 */

export async function createHabit(
  title: string,
  icon?: string,
  color?: string
): Promise<string> {
  const id = generateId();
  const now = new Date().toISOString();

  const newHabit: Habit = {
    id,
    title: title.trim(),
    icon: icon || 'flame',
    color: color || '#FF6B2B',
    completedDates: [],
    currentStreak: 0,
    bestStreak: 0,
    createdAt: now,
    updatedAt: now,
  };

  await db.habits.add(newHabit);
  return id;
}

export async function toggleHabitToday(id: string): Promise<void> {
  const habit = await db.habits.get(id);
  if (!habit) return;

  const todayStr = getLocalTodayDateString();
  const exists = habit.completedDates.includes(todayStr);

  let updatedDates: string[];
  if (exists) {
    // Uncheck today
    updatedDates = habit.completedDates.filter((d) => d !== todayStr);
  } else {
    // Check today
    updatedDates = [...habit.completedDates, todayStr];
  }

  const newStreak = calculateStreak(updatedDates);
  const bestStreak = Math.max(habit.bestStreak, newStreak);

  await db.habits.update(id, {
    completedDates: updatedDates,
    currentStreak: newStreak,
    bestStreak,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteHabit(id: string): Promise<void> {
  await db.habits.delete(id);
}
