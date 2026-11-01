import { db } from '@/app/lib/db';
import type { AppSettings, AppThemeId, ThemePreset } from '@/app/lib/types';
import {
  scheduleDailyReviewNotification,
  requestNotificationPermission,
  triggerTestNotification,
} from './notificationService';

const DEFAULT_SETTINGS_ID = 'default';

/**
 * 5 Official Theme Presets for NoteZ v2.0
 */
export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'classic-brutal',
    name: 'Classic Brutal',
    tagline: 'Neo-Brutalism Light - Mode Terang Default Kontras Tinggi',
    isDark: false,
    colors: {
      bg: '#FFFDF7',
      surface: '#FFFFFF',
      border: '#0A0A0A',
      accentPrimary: '#FFE135',
      accentSecondary: '#3B6FFF',
      textPrimary: '#0A0A0A',
      textMuted: '#555555',
    },
  },
  {
    id: 'cyber-lime',
    name: 'Cyber Lime',
    tagline: 'Electric Cyber Lime - Gelap Berenergi Neon Hijau',
    isDark: true,
    colors: {
      bg: '#0C0D10',
      surface: '#16181D',
      border: '#2A2D36',
      accentPrimary: '#CCFF00',
      accentSecondary: '#2563EB',
      textPrimary: '#F4F5F6',
      textMuted: '#8E929E',
    },
  },
  {
    id: 'cyber-blue',
    name: 'Cyber Blue',
    tagline: 'Electric Cyber Blue - Biru Elektrik Futuristik',
    isDark: true,
    colors: {
      bg: '#0B0E14',
      surface: '#141A24',
      border: '#243044',
      accentPrimary: '#00F0FF',
      accentSecondary: '#2563EB',
      textPrimary: '#F0F6FC',
      textMuted: '#8B98A5',
    },
  },
  {
    id: 'violet-dark',
    name: 'Violet Dark',
    tagline: 'Deep Charcoal & Violet - Ungu Mewah & Elegan',
    isDark: true,
    colors: {
      bg: '#0F0E17',
      surface: '#1B1A26',
      border: '#2E2B40',
      accentPrimary: '#7C3AED',
      accentSecondary: '#EC4899',
      textPrimary: '#FFFFFE',
      textMuted: '#A7A1B8',
    },
  },
  {
    id: 'oled',
    name: 'OLED Black',
    tagline: 'OLED True Black - Hitam Pekat Hemat Baterai Layar OLED',
    isDark: true,
    colors: {
      bg: '#000000',
      surface: '#121212',
      border: '#27272A',
      accentPrimary: '#10B981',
      accentSecondary: '#3B82F6',
      textPrimary: '#FFFFFF',
      textMuted: '#71717A',
    },
  },
];

/**
 * Applies the given theme preset by setting data-theme attribute and toggling the .dark class
 */
export function applyTheme(themeId: AppThemeId): void {
  if (typeof document === 'undefined') return;

  const validTheme = THEME_PRESETS.some((p) => p.id === themeId)
    ? themeId
    : 'classic-brutal';
  const isDark = validTheme !== 'classic-brutal';

  document.documentElement.setAttribute('data-theme', validTheme);
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  try {
    localStorage.setItem('notez_theme', validTheme);
    localStorage.setItem('notez_theme_mode', isDark ? 'dark' : 'light');
    if (isDark) {
      localStorage.setItem('notez_last_dark_theme', validTheme);
    }
  } catch (err) {
    console.warn('Failed to save theme to localStorage:', err);
  }
}

/**
 * Initializes app theme immediately on application mount
 * Reads from localStorage first for zero-FOUC, then verifies with Dexie
 */
export async function initTheme(): Promise<AppThemeId> {
  if (typeof window === 'undefined') return 'classic-brutal';

  try {
    // 1. Fast path: check localStorage
    let storedTheme = localStorage.getItem('notez_theme') as AppThemeId | null;

    // Handle legacy 'dark' or 'light' values
    if (storedTheme === ('dark' as any)) {
      storedTheme = 'cyber-lime';
    } else if (storedTheme === ('light' as any)) {
      storedTheme = 'classic-brutal';
    }

    if (!storedTheme || !THEME_PRESETS.some((p) => p.id === storedTheme)) {
      // 2. Fallback to Dexie
      const settings = await db.settings.get(DEFAULT_SETTINGS_ID);
      if (settings?.themeId && THEME_PRESETS.some((p) => p.id === settings.themeId)) {
        storedTheme = settings.themeId;
      } else if (settings?.isDarkMode) {
        storedTheme = 'cyber-lime';
      } else {
        storedTheme = 'classic-brutal';
      }
    }

    applyTheme(storedTheme);
    return storedTheme;
  } catch (err) {
    console.warn('Failed to initialize theme from storage:', err);
    applyTheme('classic-brutal');
    return 'classic-brutal';
  }
}

/**
 * Backward compatibility: Applies or removes the .dark class on <html> and syncs theme
 */
export function applyThemeClass(isDark: boolean): void {
  if (isDark) {
    let lastDark: AppThemeId = 'cyber-lime';
    try {
      const storedLast = localStorage.getItem('notez_last_dark_theme') as AppThemeId;
      if (storedLast && storedLast !== 'classic-brutal' && THEME_PRESETS.some((p) => p.id === storedLast)) {
        lastDark = storedLast;
      }
    } catch {}
    applyTheme(lastDark);
  } else {
    applyTheme('classic-brutal');
  }
}

/**
 * Sets active theme preset in DOM, persists to localStorage & Dexie
 */
export async function setTheme(themeId: AppThemeId): Promise<AppThemeId> {
  const isDark = themeId !== 'classic-brutal';
  applyTheme(themeId);

  try {
    const settings = await getAppSettings();
    await db.settings.update(settings.id, {
      themeId,
      isDarkMode: isDark,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Failed to persist theme in Dexie:', err);
  }

  return themeId;
}

/**
 * Toggles or sets the Dark Mode state in Dexie, updates DOM class, and persists to localStorage
 */
export async function setDarkMode(isDark: boolean): Promise<boolean> {
  if (!isDark) {
    await setTheme('classic-brutal');
    return false;
  } else {
    let lastDark: AppThemeId = 'cyber-lime';
    try {
      const storedLast = localStorage.getItem('notez_last_dark_theme') as AppThemeId;
      if (storedLast && storedLast !== 'classic-brutal' && THEME_PRESETS.some((p) => p.id === storedLast)) {
        lastDark = storedLast;
      }
    } catch {}
    await setTheme(lastDark);
    return true;
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
      themeId: 'classic-brutal',
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
      themeId: 'classic-brutal',
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

