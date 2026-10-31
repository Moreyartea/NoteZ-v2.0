import { db } from '@/app/lib/db';
import type { AppSettings } from '@/app/lib/types';
import {
  scheduleDailyReviewNotification,
  requestNotificationPermission,
  triggerTestNotification,
} from './notificationService';

const DEFAULT_SETTINGS_ID = 'default';

/**
 * Initializes app theme immediately on application mount
 * Reads from localStorage first for zero-FOUC, then verifies with Dexie
 */
export async function initTheme(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    // 1. Fast path from localStorage
    const cachedTheme = localStorage.getItem('notez_theme');
    let isDark = cachedTheme === 'dark';

    // 2. Fallback to Dexie if no cached theme
    if (!cachedTheme) {
      const settings = await db.settings.get(DEFAULT_SETTINGS_ID);
      if (settings?.isDarkMode !== undefined) {
        isDark = Boolean(settings.isDarkMode);
      }
    }

    applyThemeClass(isDark);
    return isDark;
  } catch (err) {
    console.warn('Failed to initialize theme from storage:', err);
    return false;
  }
}

/**
 * Applies or removes the .dark class on <html> and syncs localStorage
 */
export function applyThemeClass(isDark: boolean): void {
  if (typeof document === 'undefined') return;

  if (isDark) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('notez_theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('notez_theme', 'light');
  }
}

/**
 * Gets the current app settings from Dexie
 */
export async function getAppSettings(): Promise<AppSettings> {
  if (typeof window === 'undefined') {
    return {
      id: DEFAULT_SETTINGS_ID,
      dailyReminderTime: '20:00',
      currency: 'IDR',
      pomodoroWorkDuration: 25,
      pomodoroBreakDuration: 5,
      isDarkMode: false,
    };
  }

  let settings = await db.settings.get(DEFAULT_SETTINGS_ID);
  if (!settings) {
    const now = new Date().toISOString();
    settings = {
      id: DEFAULT_SETTINGS_ID,
      dailyReminderTime: '20:00',
      habitReminderTime: '20:30',
      financeReminderTime: '21:00',
      currency: 'IDR',
      pomodoroWorkDuration: 25,
      pomodoroBreakDuration: 5,
      isDarkMode: false,
      enableHaptics: true,
      pinLockEnabled: false,
      pinCode: null,
      createdAt: now,
      updatedAt: now,
    };
    await db.settings.add(settings);
  }

  return settings;
}

/**
 * Toggles or sets the Dark Mode state in Dexie, updates DOM class, and persists to localStorage
 */
export async function setDarkMode(isDark: boolean): Promise<boolean> {
  applyThemeClass(isDark);

  try {
    const settings = await getAppSettings();
    await db.settings.update(settings.id, {
      isDarkMode: isDark,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Failed to persist dark mode in Dexie:', err);
  }

  return isDark;
}

/**
 * Updates daily reminder time and reschedules the native alarm
 */
export async function updateDailyReminderTime(timeStr: string): Promise<void> {
  const [h, m] = timeStr.split(':').map((v) => parseInt(v, 10) || 0);

  await requestNotificationPermission();
  await scheduleDailyReviewNotification(h, m);

  const settings = await getAppSettings();
  await db.settings.update(settings.id, {
    dailyReminderTime: timeStr,
    updatedAt: new Date().toISOString(),
  });
}

export { triggerTestNotification };

