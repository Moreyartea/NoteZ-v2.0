# THEME_DEBUG_SNAPSHOT.md

## Git Commit Status (git log -n 3 --oneline)
```
b69746d fix(theme): bind card surfaces to theme variables and fix typography line-height collision across themes
1f9143b feat(theme): implement 5 preset multi-theme engine without altering light mode baseline
021af6a feat(theme): implement multi-theme engine with 5 official presets based on data-theme and css variables
```

### app/globals.css
```css
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));

/* Multi-Theme Engine Presets */
:root,
html[data-theme="classic-brutal"] {
  --theme-bg: #FFFDF7;
  --theme-surface: #FFFFFF;
  --theme-border: #0A0A0A;
  --theme-accent-primary: #FFE135;
  --theme-accent-secondary: #3B6FFF;
  --theme-text-primary: #0A0A0A;
  --theme-text-muted: #555555;

  --background: #FFFDF7;
  --foreground: #0A0A0A;
  --nb-bg: #FFFDF7;
  --nb-card-bg: #FFFFFF;
  --nb-primary: #FFE135;
  --nb-secondary: #3B6FFF;
  --nb-finance: #00E676;
  --nb-wishlist: #FF4DA6;
  --nb-media: #A855F7;
  --nb-warning: #FF6B2B;
  --nb-error: #FF3B30;
  --nb-border: #0A0A0A;
  --nb-text: #0A0A0A;
}

html[data-theme="cyber-lime"] {
  --theme-bg: #0C0D10;
  --theme-surface: #16181D;
  --theme-border: #2A2D36;
  --theme-accent-primary: #CCFF00;
  --theme-accent-secondary: #2563EB;
  --theme-text-primary: #F4F5F6;
  --theme-text-muted: #8E929E;
}

html[data-theme="cyber-blue"] {
  --theme-bg: #0B0E14;
  --theme-surface: #141A24;
  --theme-border: #243044;
  --theme-accent-primary: #00F0FF;
  --theme-accent-secondary: #2563EB;
  --theme-text-primary: #F0F6FC;
  --theme-text-muted: #8B98A5;
}

html[data-theme="violet-dark"] {
  --theme-bg: #0F0E17;
  --theme-surface: #1B1A26;
  --theme-border: #2E2B40;
  --theme-accent-primary: #7C3AED;
  --theme-accent-secondary: #EC4899;
  --theme-text-primary: #FFFFFE;
  --theme-text-muted: #A7A1B8;
}

html[data-theme="oled"] {
  --theme-bg: #000000;
  --theme-surface: #121212;
  --theme-border: #27272A;
  --theme-accent-primary: #10B981;
  --theme-accent-secondary: #3B82F6;
  --theme-text-primary: #FFFFFF;
  --theme-text-muted: #71717A;
}

.dark {
  --background: var(--theme-bg, #121212);
  --foreground: var(--theme-text-primary, #F4F4F0);
  --nb-bg: var(--theme-bg, #181818);
  --nb-card-bg: var(--theme-surface, #1E1E1E);
  --nb-border: var(--theme-border, #2E2E2E);
  --nb-text: var(--theme-text-primary, #F4F4F0);
  --nb-primary: var(--theme-accent-primary, #FFE135);
  --nb-secondary: var(--theme-accent-secondary, #3B6FFF);
  --nb-finance: #00E676;
  --nb-wishlist: #FF4DA6;
  --nb-media: #A855F7;
  --nb-warning: #FF6B2B;
  --nb-error: #FF3B30;
}

@theme inline {
  --font-sans: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: var(--font-jetbrains-mono), monospace;
  --color-nb-bg: #FFFDF7;
  --color-nb-primary: #FFE135;
  --color-nb-secondary: #3B6FFF;
  --color-nb-finance: #00E676;
  --color-nb-wishlist: #FF4DA6;
  --color-nb-media: #A855F7;
  --color-nb-warning: #FF6B2B;
  --color-nb-error: #FF3B30;
  --color-nb-border: #0A0A0A;
  --color-nb-text: #0A0A0A;

  --color-theme-bg: var(--theme-bg);
  --color-theme-surface: var(--theme-surface);
  --color-theme-border: var(--theme-border);
  --color-theme-accent-primary: var(--theme-accent-primary);
  --color-theme-accent-secondary: var(--theme-accent-secondary);
  --color-theme-text-primary: var(--theme-text-primary);
  --color-theme-text-muted: var(--theme-text-muted);
}

/* Neo-Brutalism Typography Reset */
* {
  /* Cegah teks bertabrakan vertikal saat wrapping */
  line-height: 1.35;
}

h1, h2, h3, h4, .font-black {
  line-height: 1.2 !important;
  letter-spacing: -0.02em;
}

/* Hindari pemakaian class leading-none jika elemen memiliki kemungkinan wrap */
.leading-none {
  line-height: 1.15 !important;
}

/* Dynamic Card Surface & Element Sync across Themes */
html[data-theme]:not([data-theme="classic-brutal"]) .nb-card,
html[data-theme]:not([data-theme="classic-brutal"]) [data-card="true"],
html.dark .bg-white,
html.dark .bg-\[\#FFFDF7\],
html.dark .bg-\[\#ffffff\] {
  background-color: var(--theme-surface) !important;
  border-color: var(--theme-border) !important;
  color: var(--theme-text-primary) !important;
}

/* Neo-Brutalism Utility Classes */
.nb-border {
  border: 3px solid #0A0A0A;
}

.nb-border-2 {
  border: 2px solid #0A0A0A;
}

.nb-border-b {
  border-bottom: 3px solid #0A0A0A;
}

.nb-border-t {
  border-top: 3px solid #0A0A0A;
}

.nb-shadow {
  box-shadow: 4px 4px 0px #0A0A0A;
}

.nb-shadow-sm {
  box-shadow: 2px 2px 0px #0A0A0A;
}

.nb-shadow-lg {
  box-shadow: 6px 6px 0px #0A0A0A;
}

.nb-card {
  background-color: var(--nb-card-bg);
  border: 3px solid var(--nb-border);
  box-shadow: 4px 4px 0px #0A0A0A;
  color: var(--nb-text);
}

.dark .nb-card {
  box-shadow: 4px 4px 0px #000000;
  border-color: var(--theme-border, #2E2E2E);
}

.nb-button {
  border: 3px solid #0A0A0A;
  box-shadow: 4px 4px 0px #0A0A0A;
  font-weight: 700;
  cursor: pointer;
  user-select: none;
  transition: all 75ms cubic-bezier(0.4, 0, 0.2, 1);
}

.nb-button:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #0A0A0A;
}

.nb-input {
  border: 3px solid var(--nb-border);
  background-color: var(--nb-card-bg);
  color: var(--nb-text);
  padding: 0.5rem 0.75rem;
}

.dark .nb-input {
  border-color: var(--theme-border, #2E2E2E);
}

.nb-input:focus {
  outline: none;
  box-shadow: 3px 3px 0px #3B6FFF;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-space-grotesk), sans-serif;
  -webkit-font-smoothing: antialiased;
}

.dark body {
  background-color: var(--theme-bg, #121212);
  color: var(--theme-text-primary, #F4F4F0);
}
```

### app/layout.tsx
```tsx
import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NoteZ v2.0 - Pure Offline Super-App",
  description: "Aplikasi produktivitas dan pencatatan harian pribadi all-in-one bergaya Neo-Brutalism",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('notez_theme_id') || localStorage.getItem('notez_theme') || 'classic-brutal';
                document.documentElement.setAttribute('data-theme', savedTheme);
                if (savedTheme !== 'classic-brutal') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full font-sans bg-[#FFFDF7] dark:bg-[#121212] text-[#0A0A0A] dark:text-[#F4F4F0]">
        {children}
      </body>
    </html>
  );
}
```

### app/lib/types.ts
```ts
/**
 * NoteZ v2.0 - Core TypeScript Type Definitions
 * Single Source of Truth based on PRD Section 7.2 (IndexedDB Schema)
 */

// 1. Wallets
export type WalletType = 'cash' | 'bank' | 'ewallet';

export interface Wallet {
  id: string; // UUID
  name: string; // e.g. "Tunai", "BCA", "GoPay"
  type: WalletType;
  balance: number; // Saldo dalam Rupiah (IDR)
  color: string; // Hex color code
  icon: string; // Tabler icon name
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// 2. Transactions
export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: string; // UUID
  walletId: string; // Foreign key to wallets.id (source wallet)
  toWalletId?: string | null; // Foreign key to wallets.id (destination for transfer)
  type: TransactionType;
  amount: number; // Nominal transaksi (IDR)
  adminFee?: number | null; // Biaya admin transfer (opsional)
  category: string; // e.g. "Makan", "Transport", "Gaji", "Adjustment"
  title: string; // Judul / keterangan singkat
  note?: string | null; // Catatan tambahan
  date: string; // ISO string waktu lokal HP
}

// 3. Budgets & Recurring Bills
export type BudgetBillType = 'budget' | 'bill';

export interface Budget {
  id: string;
  type: 'budget';
  category: string;
  limitAmount: number;
  monthYear?: string | null; // Format "YYYY-MM"
  createdAt?: string;
  updatedAt?: string;
}

export interface Bill {
  id: string;
  type: 'bill';
  category: string;
  limitAmount: number; // Nominal tagihan bulanan
  dueDayOfMonth?: number | null; // 1 - 31
  walletId?: string | null; // Dompet pembayaran default
  lastPaidMonth?: string | null; // "YYYY-MM"
  createdAt?: string;
  updatedAt?: string;
}

export interface BudgetAndBill {
  id: string; // UUID
  type: BudgetBillType;
  category: string;
  limitAmount: number;
  monthYear?: string | null; // "YYYY-MM" (khusus budget)
  dueDayOfMonth?: number | null; // 1 - 31 (khusus tagihan rutin)
  walletId?: string | null; // Dompet pembayaran default
  lastPaidMonth?: string | null; // "YYYY-MM"
  createdAt?: string;
  updatedAt?: string;
}

// 4. Debts (Utang & Piutang)
export type DebtType = 'payable' | 'receivable';

export interface Debt {
  id: string; // UUID
  personName: string; // Nama orang
  type: DebtType; // 'payable' (Utang saya) | 'receivable' (Piutang teman)
  totalAmount: number; // Total pinjaman awal
  paidAmount: number; // Nominal yang sudah dicicil/dibayar
  dueDate?: string | null; // Tanggal jatuh tempo (YYYY-MM-DD)
  isSettled: boolean; // Status lunas
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// 5. Todos & Subtasks
export type TodoPriority = 'high' | 'medium' | 'low';
export type TodoRecurrence = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Subtask {
  id: string;
  title: string;
  isDone: boolean;
}

export interface Todo {
  id: string; // UUID
  title: string;
  description?: string | null;
  category: string; // "Kuliah", "Kerja", "Pribadi", "Project"
  priority: TodoPriority;
  dueDate?: string | null; // Tanggal deadline (YYYY-MM-DD waktu lokal HP)
  reminderTime?: string | null; // Jam alarm pengingat (HH:mm waktu lokal HP)
  notificationId?: number | null; // ID alarm @capacitor/local-notifications
  isCompleted: boolean;
  pinToHomeWidget: boolean; // Prioritaskan di Widget Layar Utama HP
  recurrence: TodoRecurrence;
  subtasks: Subtask[];
  createdAt?: string;
  updatedAt?: string;
}

// 6. Habits
export interface Habit {
  id: string; // UUID
  title: string;
  icon: string;
  color: string;
  completedDates: string[]; // Array tanggal selesai ISO YYYY-MM-DD
  currentStreak: number;
  bestStreak: number;
  createdAt?: string;
  updatedAt?: string;
}

// 7. Notes & Checklist Items
export interface NoteChecklistItem {
  id: string;
  text: string;
  isChecked: boolean;
}

export interface Note {
  id: string; // UUID
  title: string;
  content: string; // Isi catatan teks / markdown
  imageUrl?: string | null; // Path / Data URL foto lampiran
  folder: string; // "Ide", "Kuliah", "Jurnal", dll
  tags: string[];
  color: string; // Hex / nama warna latar kartu
  isPinned: boolean;
  showOnHomeWidget: boolean; // Dipasang ke Widget Sticky Note Layar HP
  isTrashed: boolean;
  checklists?: NoteChecklistItem[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

// 8. Media Watchlist (Film, Anime, Series, Drakor, Video)
export type MediaType = 'anime' | 'movie' | 'series' | 'video';
export type MediaStatus = 'watching' | 'plan_to_watch' | 'completed' | 'on_hold' | 'dropped';
export type MediaTier = 'S' | 'A' | 'B' | 'C' | 'D';
export type AiringDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface MediaItem {
  id: string; // UUID
  title: string;
  type: MediaType;
  status: MediaStatus;
  currentSeason: number; // default 1
  currentEpisode: number;
  totalEpisodes?: number | null;
  score?: number | null; // 1.0 - 10.0
  tier?: MediaTier | null; // S (Masterpiece), A (Worth It), B (Lumayan), C (Biasa), D (Buang Waktu)
  reviewText?: string | null;
  hasSpoiler: boolean;
  airingDay?: AiringDay | null;
  reminderEnabled: boolean;
  posterUrl?: string | null;
  watchUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// 9. Wishlists (Barang Impian & Sinking Funds)
export type WishlistHistoryType = 'deposit' | 'withdraw';
export type WishlistPriority = 1 | 2 | 3 | 4 | 5;

export interface WishlistHistoryItem {
  id: string;
  date: string; // ISO
  amount: number;
  type: WishlistHistoryType;
  walletId?: string | null; // Dompet terkait jika potong saldo langsung
}

export interface WishlistItem {
  id: string; // UUID
  name: string;
  targetPrice: number; // IDR
  savedAmount: number; // IDR
  priorityStars: WishlistPriority; // 1 - 5
  imageUrl?: string | null;
  storeUrl?: string | null;
  showOnHomeWidget: boolean; // Tampilkan foto & progress di Widget Layar HP
  isAchieved: boolean;
  history: WishlistHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

// 10. App Notifications (In-App Drawer History)
export type NotificationCategory = 'todo' | 'habit' | 'finance' | 'media' | 'system';
export type NotificationActionType = 'complete_todo' | 'pay_bill' | 'increment_episode';

export interface AppNotification {
  id: string; // UUID
  title: string;
  message: string;
  category: NotificationCategory;
  isRead: boolean;
  relatedEntityId?: string | null;
  actionType?: NotificationActionType | null;
  createdAt: string; // ISO
}

// 11. App Settings & Themes
export type AppThemeId = 'classic-brutal' | 'cyber-lime' | 'cyber-blue' | 'violet-dark' | 'oled';

export interface ThemePreset {
  id: AppThemeId;
  name: string;
  tagline: string;
  isDark: boolean;
  colors: {
    bg: string;
    surface: string;
    border: string;
    accentPrimary: string;
    accentSecondary: string;
    textPrimary: string;
    textMuted: string;
  };
}

export interface AppSettings {
  id: string; // "default"
  dailyReminderTime: string; // e.g. "20:00"
  habitReminderTime?: string; // e.g. "20:30"
  financeReminderTime?: string; // e.g. "21:00"
  currency: string; // "IDR"
  pomodoroWorkDuration: number; // default 25
  pomodoroBreakDuration: number; // default 5
  isDarkMode?: boolean;
  themeId?: AppThemeId;
  enableHaptics?: boolean;
  pinLockEnabled?: boolean;
  pinCode?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
```

### app/lib/services/settingsService.ts
```ts
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
    localStorage.setItem('notez_theme_id', validTheme);
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
    // 1. Fast path: check localStorage ('notez_theme_id' with fallback to legacy 'notez_theme')
    let storedTheme = (localStorage.getItem('notez_theme_id') ||
      localStorage.getItem('notez_theme')) as AppThemeId | null;

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
      const storedLast = (localStorage.getItem('notez_theme_id') ||
        localStorage.getItem('notez_last_dark_theme')) as AppThemeId;
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
 * Core helper setAppTheme(themeId: AppThemeId):
 * - Sets data-theme attribute on document.documentElement
 * - Toggles dark class based on whether theme is 'classic-brutal'
 * - Persists preference to localStorage ('notez_theme_id') and updates Dexie settings
 */
export async function setAppTheme(themeId: AppThemeId): Promise<AppThemeId> {
  const validTheme = THEME_PRESETS.some((p) => p.id === themeId)
    ? themeId
    : 'classic-brutal';
  const isDark = validTheme !== 'classic-brutal';

  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', validTheme);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  try {
    localStorage.setItem('notez_theme_id', validTheme);
    localStorage.setItem('notez_theme', validTheme);
    if (isDark) {
      localStorage.setItem('notez_last_dark_theme', validTheme);
    }
  } catch (err) {
    console.warn('Failed to save theme in localStorage:', err);
  }

  try {
    const settings = await getAppSettings();
    await db.settings.update(settings.id, {
      themeId: validTheme,
      isDarkMode: isDark,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Failed to persist theme in Dexie:', err);
  }

  return validTheme;
}

export const setTheme = setAppTheme;

/**
 * Toggles or sets the Dark Mode state in Dexie, updates DOM class, and persists to localStorage
 */
export async function setDarkMode(isDark: boolean): Promise<boolean> {
  if (!isDark) {
    await setAppTheme('classic-brutal');
    return false;
  } else {
    let lastDark: AppThemeId = 'cyber-lime';
    try {
      const storedLast = (localStorage.getItem('notez_theme_id') ||
        localStorage.getItem('notez_last_dark_theme')) as AppThemeId;
      if (storedLast && storedLast !== 'classic-brutal' && THEME_PRESETS.some((p) => p.id === storedLast)) {
        lastDark = storedLast;
      }
    } catch {}
    await setAppTheme(lastDark);
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
```

### components/ui/NbCard.tsx
```tsx
'use client';

import React from 'react';
import { cn } from '@/app/lib/utils';

export interface NbCardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
  bgColor?: string;
}

const paddingStyles = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const NbCard = React.forwardRef<HTMLDivElement, NbCardProps>(
  (
    {
      className,
      padding = 'md',
      hoverEffect = false,
      bgColor,
      style,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        data-card="true"
        style={{
          backgroundColor: bgColor || 'var(--theme-surface)',
          borderColor: 'var(--theme-border)',
          color: 'var(--theme-text-primary)',
          ...style,
        }}
        className={cn(
          'nb-card border-[3px] border-[#0A0A0A] dark:border-[var(--theme-border)] shadow-[4px_4px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_#000000] rounded-2xl bg-[var(--theme-surface)] text-[var(--theme-text-primary)] transition-colors',
          paddingStyles[padding],
          hoverEffect &&
            'transition-transform duration-100 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#0A0A0A] dark:hover:shadow-[6px_6px_0px_#000000]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NbCard.displayName = 'NbCard';
```

### components/layout/AppShell.tsx
```tsx
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { IconSettings } from '@tabler/icons-react';
import { seedInitialData } from '@/app/lib/seed';
import { requestNotificationPermission } from '@/app/lib/services/notificationService';
import { initTheme } from '@/app/lib/services/settingsService';
import { LiveDeviceClock } from './LiveDeviceClock';
import { BottomNav } from './BottomNav';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { AppLogo } from '@/components/ui/AppLogo';

export interface AppShellProps {
  children: React.ReactNode;
  headerTitle?: string;
  showClock?: boolean;
}

/**
 * AppShell - Minimalist Mobile Shell Layout (Dark Mode Enabled)
 * Top Bar:
 * - Left: NoteZ official SVG logo badge + subtle page title
 * - Right: Isolated real-time digital clock + Notification bell + Settings gear button
 * Bottom Bar:
 * - 5-tab Neo-Brutalism Bottom Navigation
 */
export const AppShell: React.FC<AppShellProps> = ({
  children,
  headerTitle,
  showClock = true,
}) => {
  useEffect(() => {
    // Run initial seed, notification permission, and dark mode theme initialization
    seedInitialData();
    requestNotificationPermission();
    initTheme();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F2EB] dark:bg-[var(--theme-bg,#0E0E0E)] text-[#0A0A0A] dark:text-[var(--theme-text-primary,#F4F4F0)] flex flex-col items-center overflow-x-hidden transition-colors">
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#FFFDF7] dark:bg-[var(--theme-bg,#181818)] border-x-[3px] border-[#0A0A0A] dark:border-[var(--theme-border,#2E2E2E)] shadow-[4px_0px_0px_#0A0A0A] dark:shadow-[4px_0px_0px_#000000] relative">
        {/* Minimalist Top App Header */}
        <header className="sticky top-0 z-30 bg-[#FFFDF7] dark:bg-[var(--theme-surface,#1E1E1E)] border-b-[3px] border-[#0A0A0A] dark:border-[var(--theme-border,#2E2E2E)] px-3.5 py-2 flex items-center justify-between shadow-[0px_2px_0px_#0A0A0A] dark:shadow-[0px_2px_0px_#000000]">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <AppLogo size="sm" showText={true} />
            {headerTitle && (
              <span className="text-xs font-black text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                / {headerTitle}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {showClock && <LiveDeviceClock />}
            <NotificationBell />
            <Link
              href="/settings"
              title="Pengaturan"
              aria-label="Buka Pengaturan"
              className="w-8 h-8 rounded-lg bg-white dark:bg-[var(--theme-surface,#252525)] border-2 border-[#0A0A0A] dark:border-[var(--theme-border,#2E2E2E)] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000] flex items-center justify-center hover:bg-yellow-50 dark:hover:bg-[#333333] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex-shrink-0"
            >
              <IconSettings className="w-4 h-4 text-[#0A0A0A] dark:text-[var(--theme-text-primary,#F4F4F0)] stroke-[2.5]" />
            </Link>
          </div>
        </header>

        {/* Page Content with bottom padding to avoid BottomNav overlap */}
        <main className="flex-1 p-3.5 pb-24 overflow-y-auto">
          {children}
        </main>

        {/* Fixed Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};
```

### components/layout/BottomNav.tsx
```tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconLayoutDashboard,
  IconWallet,
  IconChecklist,
  IconNotes,
  IconMovie,
} from '@tabler/icons-react';
import { cn } from '@/app/lib/utils';

export interface NavTabItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navTabs: NavTabItem[] = [
  {
    name: 'Beranda',
    href: '/',
    icon: IconLayoutDashboard,
  },
  {
    name: 'Keuangan',
    href: '/finance',
    icon: IconWallet,
  },
  {
    name: 'Tugas',
    href: '/todos',
    icon: IconChecklist,
  },
  {
    name: 'Catatan',
    href: '/notes',
    icon: IconNotes,
  },
  {
    name: 'Tontonan',
    href: '/media',
    icon: IconMovie,
  },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[var(--theme-surface,#1E1E1E)] border-t-[3px] border-[#0A0A0A] dark:border-[var(--theme-border,#2E2E2E)] shadow-[0px_-2px_0px_#0A0A0A] dark:shadow-[0px_-2px_0px_#000000] transition-colors"
      aria-label="Navigasi Utama Mobile"
    >
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5 pb-2">
        {navTabs.map((tab) => {
          const isActive =
            tab.href === '/'
              ? pathname === '/' || pathname === '/dashboard'
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-75 select-none',
                isActive
                  ? 'bg-[#FFE135] dark:bg-[var(--theme-accent-primary,#FFE135)] text-[#0A0A0A] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] font-extrabold -translate-y-0.5'
                  : 'text-gray-600 dark:text-[var(--theme-text-muted,#8E929E)] hover:text-[#0A0A0A] dark:hover:text-[var(--theme-text-primary,#F4F4F0)] font-semibold active:translate-y-0.5'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 transition-transform',
                  isActive ? 'stroke-[2.5] scale-105' : 'stroke-2'
                )}
              />
              <span className="text-[10px] mt-0.5 tracking-tight leading-tight">
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
```

### app/page.tsx
```tsx
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
  IconSchool,
  IconBriefcase,
  IconUser,
  IconRocket,
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
          className="p-4 rounded-2xl border-[3px] border-[#0A0A0A] dark:border-[var(--theme-border,#2E2E2E)] shadow-[4px_4px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_#000000] space-y-3.5 bg-[#FFFDF7] dark:bg-[var(--theme-surface,#1E1E1E)] transition-colors"
        >
          {/* Top Section: Net Worth & Balance Peek Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 dark:text-[var(--theme-text-muted,#8E929E)] block">
                Kekayaan Bersih
              </span>
              <p className="font-mono text-2xl font-black text-[#0A0A0A] dark:text-[var(--theme-text-primary,#F4F4F0)] tracking-tight mt-0.5 leading-tight">
                {isHideBalance ? 'Rp •••••••••' : formatRupiah(totalNetWorth)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsHideBalance(!isHideBalance)}
              className="p-2 rounded-xl bg-white dark:bg-[var(--theme-surface,#252525)] border-2 border-[#0A0A0A] dark:border-[var(--theme-border,#2E2E2E)] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] text-[#0A0A0A] dark:text-[var(--theme-text-primary,#F4F4F0)] cursor-pointer"
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
          <div className="border-t-2 border-[#0A0A0A] dark:border-[var(--theme-border,#2E2E2E)]" />

          {/* Bottom Section: 4 Quick Actions in 1 Row */}
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setIsTxModalOpen(true)}
              className="py-2 px-1 bg-white dark:bg-[var(--theme-surface,#252525)] hover:bg-emerald-50 dark:hover:opacity-90 rounded-xl border-2 border-[#0A0A0A] dark:border-[var(--theme-border,#2E2E2E)] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] flex flex-col items-center justify-center text-center cursor-pointer select-none transition-transform"
            >
              <div className="w-7 h-7 rounded-lg bg-[#00E676] border border-[#0A0A0A] flex items-center justify-center mb-1">
                <IconWallet className="w-4 h-4 text-[#0A0A0A] stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black text-[#0A0A0A] dark:text-[var(--theme-text-primary,#F4F4F0)] leading-tight">
                + Transaksi
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsTodoModalOpen(true)}
              className="py-2 px-1 bg-white dark:bg-[var(--theme-surface,#252525)] hover:bg-blue-50 dark:hover:opacity-90 rounded-xl border-2 border-[#0A0A0A] dark:border-[var(--theme-border,#2E2E2E)] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] flex flex-col items-center justify-center text-center cursor-pointer select-none transition-transform"
            >
              <div className="w-7 h-7 rounded-lg bg-[#3B6FFF] border border-[#0A0A0A] flex items-center justify-center mb-1">
                <IconChecklist className="w-4 h-4 text-white stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black text-[#0A0A0A] dark:text-[var(--theme-text-primary,#F4F4F0)] leading-tight">
                + Tugas
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsNoteModalOpen(true)}
              className="py-2 px-1 bg-white dark:bg-[var(--theme-surface,#252525)] hover:bg-yellow-50 dark:hover:opacity-90 rounded-xl border-2 border-[#0A0A0A] dark:border-[var(--theme-border,#2E2E2E)] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] flex flex-col items-center justify-center text-center cursor-pointer select-none transition-transform"
            >
              <div className="w-7 h-7 rounded-lg bg-[#FFE135] border border-[#0A0A0A] flex items-center justify-center mb-1">
                <IconNotes className="w-4 h-4 text-[#0A0A0A] stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black text-[#0A0A0A] dark:text-[var(--theme-text-primary,#F4F4F0)] leading-tight">
                + Catatan
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsMediaModalOpen(true)}
              className="py-2 px-1 bg-white dark:bg-[var(--theme-surface,#252525)] hover:bg-purple-50 dark:hover:opacity-90 rounded-xl border-2 border-[#0A0A0A] dark:border-[var(--theme-border,#2E2E2E)] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] flex flex-col items-center justify-center text-center cursor-pointer select-none transition-transform"
            >
              <div className="w-7 h-7 rounded-lg bg-[#A855F7] border border-[#0A0A0A] flex items-center justify-center mb-1">
                <IconDeviceTv className="w-4 h-4 text-white stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black text-[#0A0A0A] dark:text-[var(--theme-text-primary,#F4F4F0)] leading-tight">
                + Tontonan
              </span>
            </button>
          </div>
        </NbCard>

        {/* CARD 2: Agenda Hari Ini (Tugas & Habit Terpadu) */}
        <NbCard
          className="p-4 rounded-2xl border-[3px] border-[#0A0A0A] dark:border-[var(--theme-border,#2E2E2E)] shadow-[4px_4px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_#000000] space-y-3 bg-[#FFFDF7] dark:bg-[var(--theme-surface,#1E1E1E)] transition-colors"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <IconCalendarCheck className="w-4 h-4 text-[#0A0A0A] dark:text-[var(--theme-text-primary,#F4F4F0)] stroke-[2.5]" />
              <h2 className="text-sm font-black text-[#0A0A0A] dark:text-[var(--theme-text-primary,#F4F4F0)] tracking-tight leading-tight">
                Agenda Hari Ini
              </h2>
              {todayTodos.length > 0 && (
                <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-[#0A0A0A] dark:border-[#2E2E2E] text-[#0A0A0A] dark:text-[#F4F4F0]">
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
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  Semua tugas hari ini beres!
                </p>
              </div>
            ) : (
              topTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between gap-2.5 p-2 rounded-xl bg-white dark:bg-[var(--theme-surface,#252525)] border-2 border-[#0A0A0A] dark:border-[var(--theme-border,#2E2E2E)] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000]"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => toggleTodoStatus(todo.id)}
                      className={cn(
                        'w-5 h-5 rounded-md border-2 border-[#0A0A0A] dark:border-[var(--theme-border,#2E2E2E)] flex items-center justify-center flex-shrink-0 transition-all cursor-pointer',
                        todo.isCompleted ? 'bg-[#00E676]' : 'bg-white dark:bg-[var(--theme-surface,#1E1E1E)]'
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
                          : 'text-[#0A0A0A] dark:text-[var(--theme-text-primary,#F4F4F0)]'
                      )}
                    >
                      {todo.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {(() => {
                      const CatIcon =
                        todo.category === 'Kuliah'
                          ? IconSchool
                          : todo.category === 'Kerja'
                          ? IconBriefcase
                          : todo.category === 'Pribadi'
                          ? IconUser
                          : todo.category === 'Project'
                          ? IconRocket
                          : null;
                      if (!CatIcon) return null;
                      return (
                        <span
                          title={`Kategori: ${todo.category}`}
                          className="w-5 h-5 rounded border border-[#0A0A0A] dark:border-[var(--theme-border,#2E2E2E)] bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[#0A0A0A] dark:text-[var(--theme-text-primary,#F4F4F0)] shadow-[1px_1px_0px_#0A0A0A] dark:shadow-[1px_1px_0px_#000000]"
                        >
                          <CatIcon className="w-3 h-3 stroke-[2.5]" />
                        </span>
                      );
                    })()}

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
                </div>
              ))
            )}
          </div>

          {/* Thin Black Divider */}
          <div className="border-t-2 border-[#0A0A0A] dark:border-[#2E2E2E] pt-2.5" />

          {/* Habit Harian: 1 Baris Horizontal Ringkas */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-1 flex-shrink-0 text-[#FF6B2B]">
              <IconFlame className="w-4 h-4 stroke-[2.5]" />
              <span className="text-[11px] font-black uppercase text-[#0A0A0A] dark:text-[#F4F4F0]">
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
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border-2 border-[#0A0A0A] dark:border-[#2E2E2E] text-xs font-black transition-all flex-shrink-0 select-none cursor-pointer',
                      isDone
                        ? 'bg-[#00E676] text-[#0A0A0A] shadow-none'
                        : 'bg-white dark:bg-[var(--theme-surface,#252525)] text-gray-800 dark:text-[var(--theme-text-primary,#F4F4F0)] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px]'
                    )}
                  >
                    <span
                      className={cn(
                        'w-3.5 h-3.5 rounded-full border border-[#0A0A0A] flex items-center justify-center',
                        isDone ? 'bg-white text-[#0A0A0A]' : 'bg-gray-100 dark:bg-gray-700'
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
```

### app/finance/page.tsx
```tsx
'use client';

import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  IconEye,
  IconEyeOff,
  IconPlus,
  IconArrowDownLeft,
  IconArrowUpRight,
  IconReceipt2,
  IconWallet,
} from '@tabler/icons-react';
import { db } from '@/app/lib/db';
import { AppShell } from '@/components/layout/AppShell';
import { NbCard } from '@/components/ui/NbCard';
import { NbBadge } from '@/components/ui/NbBadge';
import { WalletCardList } from '@/components/finance/WalletCardList';
import { TransactionModal } from '@/components/finance/TransactionModal';
import { TransactionHistoryList } from '@/components/finance/TransactionHistoryList';
import { BudgetTrackerCard } from '@/components/finance/BudgetTrackerCard';
import { DebtManagementSection } from '@/components/finance/DebtManagementSection';
import { formatRupiah, cn } from '@/app/lib/utils';
import { getCurrentMonthYear } from '@/app/lib/services/financeService';
import type { TransactionType } from '@/app/lib/types';

type FinanceTab = 'overview' | 'transactions' | 'wallets' | 'budgets' | 'debts';

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<FinanceTab>('overview');
  const [isHideBalance, setIsHideBalance] = useState<boolean>(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState<boolean>(false);
  const [initialTxType, setInitialTxType] = useState<TransactionType>('expense');

  const currentMonth = getCurrentMonthYear();

  // Reactive data queries with Dexie useLiveQuery
  const wallets =
    useLiveQuery(async () => {
      if (typeof window === 'undefined') return [];
      return await db.wallets.toArray();
    }, []) || [];

  const transactions =
    useLiveQuery(async () => {
      if (typeof window === 'undefined') return [];
      const list = await db.transactions.toArray();
      return list.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }, []) || [];

  const budgetsAndBills =
    useLiveQuery(async () => {
      if (typeof window === 'undefined') return [];
      return await db.budgets_and_bills.toArray();
    }, []) || [];

  const debts =
    useLiveQuery(async () => {
      if (typeof window === 'undefined') return [];
      return await db.debts.toArray();
    }, []) || [];

  // Net worth & monthly flow calculations
  const totalNetWorth = wallets.reduce((acc, w) => acc + w.balance, 0);

  const thisMonthIncome = transactions
    .filter((tx) => tx.type === 'income' && tx.date.startsWith(currentMonth))
    .reduce((acc, cur) => acc + cur.amount, 0);

  const thisMonthExpense = transactions
    .filter((tx) => tx.type === 'expense' && tx.date.startsWith(currentMonth))
    .reduce((acc, cur) => acc + cur.amount, 0);

  const openTxModalWithType = (type: TransactionType) => {
    setInitialTxType(type);
    setIsTxModalOpen(true);
  };

  return (
    <AppShell headerTitle="Keuangan">
      <div className="space-y-4">
        {/* HERO CARD: Total Kekayaan Bersih */}
        <NbCard bgColor="#FFE135" className="p-4 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#0A0A0A] bg-white px-2 py-0.5 rounded-md border-2 border-[#0A0A0A] shadow-[1.5px_1.5px_0px_#0A0A0A]">
              Total Kekayaan Bersih
            </span>
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

          <div>
            <p className="font-mono text-2xl font-black text-[#0A0A0A] tracking-tight">
              {isHideBalance ? 'Rp •••••••••' : formatRupiah(totalNetWorth)}
            </p>
            <p className="text-[11px] font-bold text-gray-800 mt-0.5">
              Akumulasi dari {wallets.length} dompet aktif
            </p>
          </div>

          {/* Monthly Cashflow Pills */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t-2 border-[#0A0A0A]/40">
            <div className="flex items-center gap-2 bg-white/90 p-2 rounded-xl border-2 border-[#0A0A0A]">
              <span className="p-1 rounded-md bg-[#00E676] border border-[#0A0A0A]">
                <IconArrowDownLeft className="w-3.5 h-3.5 text-[#0A0A0A] stroke-[3]" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-600 leading-tight">
                  Masuk ({currentMonth})
                </p>
                <p className="text-xs font-mono font-black text-[#00A854] truncate mt-0.5">
                  {isHideBalance ? '••••••' : formatRupiah(thisMonthIncome)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/90 p-2 rounded-xl border-2 border-[#0A0A0A]">
              <span className="p-1 rounded-md bg-[#FF3B30] border border-[#0A0A0A]">
                <IconArrowUpRight className="w-3.5 h-3.5 text-white stroke-[3]" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-600 leading-tight">
                  Keluar ({currentMonth})
                </p>
                <p className="text-xs font-mono font-black text-[#FF3B30] truncate mt-0.5">
                  {isHideBalance ? '••••••' : formatRupiah(thisMonthExpense)}
                </p>
              </div>
            </div>
          </div>
        </NbCard>

        {/* Quick Action Buttons Bar */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => openTxModalWithType('expense')}
            className="py-2.5 px-2 bg-[#FF3B30] text-white font-extrabold text-xs rounded-xl border-[2.5px] border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#0A0A0A] transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <IconArrowUpRight className="w-4 h-4 stroke-[3]" />
            <span>Pengeluaran</span>
          </button>
          <button
            type="button"
            onClick={() => openTxModalWithType('income')}
            className="py-2.5 px-2 bg-[#00E676] text-[#0A0A0A] font-extrabold text-xs rounded-xl border-[2.5px] border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#0A0A0A] transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <IconArrowDownLeft className="w-4 h-4 stroke-[3]" />
            <span>Pemasukan</span>
          </button>
          <button
            type="button"
            onClick={() => openTxModalWithType('transfer')}
            className="py-2.5 px-2 bg-[#3B6FFF] text-white font-extrabold text-xs rounded-xl border-[2.5px] border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#0A0A0A] transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <IconReceipt2 className="w-4 h-4 stroke-[2.5]" />
            <span>Transfer</span>
          </button>
        </div>

        {/* Sub-Tabs Switcher */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'overview', label: 'Ringkasan' },
            { id: 'transactions', label: 'Transaksi' },
            { id: 'wallets', label: 'Dompet' },
            { id: 'budgets', label: 'Anggaran & Rutin' },
            { id: 'debts', label: 'Utang/Piutang' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as FinanceTab)}
              className={cn(
                'px-3 py-1.5 text-xs font-black rounded-xl border-2 border-[#0A0A0A] transition-all cursor-pointer whitespace-nowrap select-none',
                activeTab === tab.id
                  ? 'bg-[#FFE135] text-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] -translate-y-0.5'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SUB-TAB CONTENTS */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <WalletCardList wallets={wallets} />
            <BudgetTrackerCard
              budgetsAndBills={budgetsAndBills}
              transactions={transactions}
              wallets={wallets}
            />
            <TransactionHistoryList
              transactions={transactions.slice(0, 5)}
              wallets={wallets}
            />
          </div>
        )}

        {activeTab === 'transactions' && (
          <TransactionHistoryList
            transactions={transactions}
            wallets={wallets}
          />
        )}

        {activeTab === 'wallets' && (
          <WalletCardList wallets={wallets} />
        )}

        {activeTab === 'budgets' && (
          <BudgetTrackerCard
            budgetsAndBills={budgetsAndBills}
            transactions={transactions}
            wallets={wallets}
          />
        )}

        {activeTab === 'debts' && (
          <DebtManagementSection debts={debts} wallets={wallets} />
        )}

        {/* Floating Action Button (FAB) "+ Catat" */}
        <div className="fixed bottom-20 right-4 z-30">
          <button
            type="button"
            onClick={() => {
              setInitialTxType('expense');
              setIsTxModalOpen(true);
            }}
            aria-label="Catat Transaksi"
            className="w-14 h-14 rounded-2xl bg-[#FFE135] text-[#0A0A0A] border-[3px] border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#0A0A0A] flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
          >
            <IconPlus className="w-8 h-8 stroke-[3]" />
          </button>
        </div>

        {/* MODAL TRANSAKSI */}
        <TransactionModal
          isOpen={isTxModalOpen}
          onClose={() => setIsTxModalOpen(false)}
          wallets={wallets}
          initialType={initialTxType}
        />
      </div>
    </AppShell>
  );
}
```

### components/finance/WalletCardList.tsx
```tsx
'use client';

import React, { useState } from 'react';
import {
  IconWallet,
  IconBuildingBank,
  IconCash,
  IconScale,
  IconPlus,
} from '@tabler/icons-react';
import type { Wallet, WalletType } from '@/app/lib/types';
import { NbCard } from '@/components/ui/NbCard';
import { NbButton } from '@/components/ui/NbButton';
import { NbModal } from '@/components/ui/NbModal';
import { NbInput } from '@/components/ui/NbInput';
import { NbSelect } from '@/components/ui/NbSelect';
import { createWallet, updateWalletBalance } from '@/app/lib/services/financeService';
import { formatRupiah } from '@/app/lib/utils';

export interface WalletCardListProps {
  wallets: Wallet[];
}

export const WalletCardList: React.FC<WalletCardListProps> = ({ wallets }) => {
  // Adjustment Modal State
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [actualBalanceInput, setActualBalanceInput] = useState<string>('');
  const [adjustReason, setAdjustReason] = useState<string>('');
  const [isAdjusting, setIsAdjusting] = useState<boolean>(false);
  const [adjustError, setAdjustError] = useState<string>('');

  // Create Wallet Modal State
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [newWalletName, setNewWalletName] = useState<string>('');
  const [newWalletType, setNewWalletType] = useState<WalletType>('bank');
  const [newWalletBalance, setNewWalletBalance] = useState<string>('0');
  const [newWalletColor, setNewWalletColor] = useState<string>('#3B6FFF');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string>('');

  const openAdjustModal = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setActualBalanceInput(wallet.balance.toString());
    setAdjustReason('');
    setAdjustError('');
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWallet) return;

    const parsed = Number(actualBalanceInput.replace(/[^0-9.-]/g, ''));
    if (isNaN(parsed)) {
      setAdjustError('Nominal saldo tidak valid');
      return;
    }

    setIsAdjusting(true);
    setAdjustError('');
    try {
      await updateWalletBalance(selectedWallet.id, parsed, adjustReason);
      setSelectedWallet(null);
    } catch (err: unknown) {
      setAdjustError(err instanceof Error ? err.message : 'Gagal menyesuaikan saldo');
    } finally {
      setIsAdjusting(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalletName.trim()) {
      setCreateError('Nama dompet wajib diisi');
      return;
    }

    const parsedBalance = Number(newWalletBalance.replace(/[^0-9.-]/g, '')) || 0;
    setIsCreating(true);
    setCreateError('');
    try {
      await createWallet({
        name: newWalletName,
        type: newWalletType,
        balance: parsedBalance,
        color: newWalletColor,
      });
      setIsCreateOpen(false);
      setNewWalletName('');
      setNewWalletBalance('0');
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : 'Gagal membuat dompet baru');
    } finally {
      setIsCreating(false);
    }
  };

  const getWalletIcon = (type: WalletType) => {
    switch (type) {
      case 'cash':
        return <IconCash className="w-5 h-5 text-[#0A0A0A]" />;
      case 'bank':
        return <IconBuildingBank className="w-5 h-5 text-white" />;
      case 'ewallet':
      default:
        return <IconWallet className="w-5 h-5 text-white" />;
    }
  };

  const getWalletTypeLabel = (type: WalletType) => {
    switch (type) {
      case 'cash':
        return 'Tunai';
      case 'bank':
        return 'Bank';
      case 'ewallet':
        return 'E-Wallet';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-[#0A0A0A] dark:text-[var(--theme-text-primary)] uppercase tracking-wide">
          Dompet Saya ({wallets.length})
        </h2>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-1 text-xs font-bold bg-[#FFE135] text-[#0A0A0A] px-2.5 py-1 rounded-lg border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
        >
          <IconPlus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Tambah</span>
        </button>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x">
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            className="min-w-[210px] flex-shrink-0 snap-start"
          >
            <NbCard
              style={{ backgroundColor: wallet.color || '#FFFFFF' }}
              className="p-3.5 flex flex-col justify-between h-[135px] text-white relative overflow-hidden"
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div className="p-1.5 rounded-lg bg-black/20 border border-black/30 backdrop-blur-sm">
                  {getWalletIcon(wallet.type)}
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/25 px-2 py-0.5 rounded-full border border-black/30">
                  {getWalletTypeLabel(wallet.type)}
                </span>
              </div>

              {/* Bottom row */}
              <div>
                <p className="text-xs font-bold text-white/90 truncate">
                  {wallet.name}
                </p>
                <p className="font-mono text-base font-extrabold tracking-tight mt-0.5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                  {formatRupiah(wallet.balance)}
                </p>
              </div>

              {/* Quick Adjustment Button */}
              <button
                type="button"
                onClick={() => openAdjustModal(wallet)}
                className="absolute bottom-2.5 right-2.5 px-2 py-1 bg-white dark:bg-[var(--theme-surface)] text-[#0A0A0A] dark:text-[var(--theme-text-primary)] font-extrabold text-[10px] rounded-md border-2 border-[#0A0A0A] dark:border-[var(--theme-border)] shadow-[1.5px_1.5px_0px_#0A0A0A] dark:shadow-[1.5px_1.5px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1 cursor-pointer"
                title="Sesuaikan Saldo"
              >
                <IconScale className="w-3 h-3 stroke-[2.5]" />
                <span>Sesuaikan</span>
              </button>
            </NbCard>
          </div>
        ))}
      </div>

      {/* MODAL: Sesuaikan Saldo */}
      <NbModal
        isOpen={!!selectedWallet}
        onClose={() => setSelectedWallet(null)}
        title="Sesuaikan Saldo Dompet"
      >
        {selectedWallet && (
          <form onSubmit={handleAdjustSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-[#FFFDF7] dark:bg-[var(--theme-surface)] border-2 border-[#0A0A0A] dark:border-[var(--theme-border)]">
              <p className="text-xs text-gray-600 dark:text-[var(--theme-text-muted)] font-semibold">Dompet Terpilih</p>
              <p className="text-sm font-extrabold text-[#0A0A0A] dark:text-[var(--theme-text-primary)]">
                {selectedWallet.name} ({getWalletTypeLabel(selectedWallet.type)})
              </p>
              <p className="text-xs text-gray-500 font-mono mt-1">
                Saldo tercatat saat ini: {formatRupiah(selectedWallet.balance)}
              </p>
            </div>

            <NbInput
              label="Saldo Uang Asli Saat Ini (Rp)"
              type="number"
              value={actualBalanceInput}
              onChange={(e) => setActualBalanceInput(e.target.value)}
              placeholder="Contoh: 150000"
              hint="Sistem otomatis membuat transaksi penyesuaian selisihnya."
              required
            />

            <NbInput
              label="Alasan Penyesuaian (Opsional)"
              type="text"
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              placeholder="Contoh: Selisih uang receh / lupa catat"
            />

            {adjustError && (
              <p className="text-xs font-bold text-[#FF3B30]">{adjustError}</p>
            )}

            <div className="flex gap-2 justify-end pt-2">
              <NbButton
                type="button"
                variant="neutral"
                onClick={() => setSelectedWallet(null)}
              >
                Batal
              </NbButton>
              <NbButton type="submit" variant="primary" isLoading={isAdjusting}>
                Simpan Penyesuaian
              </NbButton>
            </div>
          </form>
        )}
      </NbModal>

      {/* MODAL: Tambah Dompet Baru */}
      <NbModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Tambah Dompet Baru"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <NbInput
            label="Nama Dompet"
            type="text"
            value={newWalletName}
            onChange={(e) => setNewWalletName(e.target.value)}
            placeholder="Contoh: Dompet Saku, BCA Tabungan, GoPay"
            required
          />

          <NbSelect
            label="Kategori Dompet"
            value={newWalletType}
            onChange={(e) => setNewWalletType(e.target.value as WalletType)}
            options={[
              { value: 'cash', label: 'Tunai (Cash)' },
              { value: 'bank', label: 'Rekening Bank' },
              { value: 'ewallet', label: 'E-Wallet / Dompet Digital' },
            ]}
          />

          <NbInput
            label="Saldo Awal (Rp)"
            type="number"
            value={newWalletBalance}
            onChange={(e) => setNewWalletBalance(e.target.value)}
            placeholder="0"
          />

          <div>
            <label className="text-sm font-bold text-[#0A0A0A] block mb-1.5">
              Warna Kartu
            </label>
            <div className="flex gap-2">
              {['#00E676', '#3B6FFF', '#A855F7', '#FF6B2B', '#FF4DA6', '#1E1E1E'].map(
                (c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewWalletColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-8 h-8 rounded-lg border-2 border-[#0A0A0A] transition-all cursor-pointer ${
                      newWalletColor === c ? 'scale-110 shadow-[2px_2px_0px_#0A0A0A]' : 'opacity-70'
                    }`}
                  />
                )
              )}
            </div>
          </div>

          {createError && (
            <p className="text-xs font-bold text-[#FF3B30]">{createError}</p>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <NbButton
              type="button"
              variant="neutral"
              onClick={() => setIsCreateOpen(false)}
            >
              Batal
            </NbButton>
            <NbButton type="submit" variant="finance" isLoading={isCreating}>
              Buat Dompet
            </NbButton>
          </div>
        </form>
      </NbModal>
    </div>
  );
};
```

### app/todos/page.tsx
```tsx
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
        <NbCard bgColor="#3B6FFF" className="p-4 text-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#0A0A0A] bg-[#FFE135] px-2 py-0.5 rounded-md border-2 border-[#0A0A0A] shadow-[1.5px_1.5px_0px_#0A0A0A]">
              Fokus Hari Ini
            </span>
            <span className="text-xs font-bold text-blue-100 font-mono">
              {todayStr}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/20">
              <p className="text-[10px] font-bold text-blue-200 uppercase leading-tight">
                Tugas Hari Ini
              </p>
              <p className="text-lg font-black font-mono text-white mt-1">
                {completedTodayTasks.length} / {todayTasks.length} Selesai
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/20">
              <p className="text-[10px] font-bold text-blue-200 uppercase leading-tight">
                Habit Tuntas
              </p>
              <p className="text-lg font-black font-mono text-white mt-1">
                {habitCompletedToday.length} / {habits.length} Hari Ini
              </p>
            </div>
          </div>
        </NbCard>

        {/* Sub-Tabs Switcher */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-white dark:bg-[var(--theme-surface)] rounded-xl border-2 border-[#0A0A0A] dark:border-[var(--theme-border)] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000]">
          <button
            type="button"
            onClick={() => setActiveTab('todos')}
            className={cn(
              'py-2 text-xs font-black rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer select-none',
              activeTab === 'todos'
                ? 'bg-[#FFE135] text-[#0A0A0A] border-2 border-[#0A0A0A] shadow-[1.5px_1.5px_0px_#0A0A0A]'
                : 'text-gray-600 hover:text-[#0A0A0A]'
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
                : 'text-gray-600 hover:text-[#0A0A0A]'
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
                : 'text-gray-600 hover:text-[#0A0A0A]'
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
              className="w-14 h-14 rounded-2xl bg-[#FFE135] text-[#0A0A0A] border-[3px] border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#0A0A0A] flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
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
```

### components/todos/TodoListSection.tsx
```tsx
'use client';

import React, { useState } from 'react';
import {
  IconCheck,
  IconPin,
  IconTrash,
  IconCalendar,
  IconRepeat,
  IconChevronDown,
  IconChevronUp,
  IconSchool,
  IconBriefcase,
  IconUser,
  IconRocket,
  IconLayersLinked,
} from '@tabler/icons-react';
import type { Todo, TodoPriority } from '@/app/lib/types';
import { NbCard } from '@/components/ui/NbCard';
import { NbBadge } from '@/components/ui/NbBadge';
import {
  toggleTodoStatus,
  toggleSubtask,
  togglePinWidget,
  deleteTodo,
  getLocalTodayDateString,
} from '@/app/lib/services/todoService';
import { cn } from '@/app/lib/utils';

export interface TodoListSectionProps {
  todos: Todo[];
  onOpenModal: () => void;
}

type FilterTab = 'all' | 'today' | 'upcoming' | 'completed';

export const TodoListSection: React.FC<TodoListSectionProps> = ({
  todos,
  onOpenModal,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedTodoIds, setExpandedTodoIds] = useState<Set<string>>(new Set());

  const todayStr = getLocalTodayDateString();

  const toggleExpand = (id: string) => {
    const next = new Set(expandedTodoIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedTodoIds(next);
  };

  // Filter items
  const filtered = todos.filter((todo) => {
    // Category check
    if (categoryFilter !== 'all' && todo.category !== categoryFilter) {
      return false;
    }

    // Tab check
    if (activeFilter === 'today') {
      return !todo.isCompleted && todo.dueDate === todayStr;
    }
    if (activeFilter === 'upcoming') {
      return !todo.isCompleted && todo.dueDate && todo.dueDate > todayStr;
    }
    if (activeFilter === 'completed') {
      return todo.isCompleted;
    }
    return true;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus tugas ini?')) {
      await deleteTodo(id);
    }
  };

  const getPriorityBadgeVariant = (priority: TodoPriority) => {
    switch (priority) {
      case 'high':
        return 'danger' as const;
      case 'medium':
        return 'warning' as const;
      case 'low':
      default:
        return 'secondary' as const;
    }
  };

  const getCategoryIconBadge = (cat: string) => {
    switch (cat) {
      case 'Kuliah':
        return {
          icon: IconSchool,
          label: 'Kuliah',
          className: 'bg-blue-100 text-[#3B6FFF] border-[#3B6FFF]',
        };
      case 'Kerja':
        return {
          icon: IconBriefcase,
          label: 'Kerja',
          className: 'bg-yellow-100 text-[#0A0A0A] border-[#FFE135]',
        };
      case 'Pribadi':
        return {
          icon: IconUser,
          label: 'Pribadi',
          className: 'bg-emerald-100 text-[#00A854] border-[#00E676]',
        };
      case 'Project':
        return {
          icon: IconRocket,
          label: 'Project',
          className: 'bg-purple-100 text-[#8B5CF6] border-[#A855F7]',
        };
      default:
        return {
          icon: IconCheck,
          label: cat,
          className: 'bg-gray-100 text-gray-700 border-gray-300',
        };
    }
  };

  const todoCategoryFilters = [
    { id: 'all', label: 'Semua', icon: IconLayersLinked, color: '#0A0A0A', bg: 'bg-white' },
    { id: 'Kuliah', label: 'Kuliah', icon: IconSchool, color: '#3B6FFF', bg: 'bg-blue-50' },
    { id: 'Kerja', label: 'Kerja', icon: IconBriefcase, color: '#0A0A0A', bg: 'bg-yellow-100' },
    { id: 'Pribadi', label: 'Pribadi', icon: IconUser, color: '#00A854', bg: 'bg-emerald-50' },
    { id: 'Project', label: 'Project', icon: IconRocket, color: '#8B5CF6', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-3">
      {/* Filter Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-white rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]">
        {[
          { id: 'all', label: 'Semua' },
          { id: 'today', label: 'Hari Ini' },
          { id: 'upcoming', label: 'Mendatang' },
          { id: 'completed', label: 'Selesai' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id as FilterTab)}
            className={cn(
              'py-1.5 text-xs font-black rounded-lg transition-all text-center cursor-pointer',
              activeFilter === tab.id
                ? 'bg-[#FFE135] text-[#0A0A0A] border-2 border-[#0A0A0A] shadow-[1.5px_1.5px_0px_#0A0A0A]'
                : 'text-gray-600 hover:text-[#0A0A0A]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category Pills Filter (Colored Neo-Brutalism Icon Chips) */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
        {todoCategoryFilters.map((cat) => {
          const Icon = cat.icon;
          const isSelected = categoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              title={`Kategori ${cat.label}`}
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-black rounded-lg border-2 border-[#0A0A0A] transition-all cursor-pointer whitespace-nowrap select-none',
                isSelected
                  ? 'bg-[#0A0A0A] text-white shadow-[2px_2px_0px_#0A0A0A]'
                  : `${cat.bg} text-gray-800 shadow-[1.5px_1.5px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px]`
              )}
            >
              <Icon
                className="w-3.5 h-3.5 stroke-[2.5]"
                style={{ color: isSelected ? '#FFFFFF' : cat.color }}
              />
              <span className="text-[11px]">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Todo Items List */}
      {filtered.length === 0 ? (
        <NbCard className="p-6 text-center text-gray-500">
          <p className="text-sm font-bold text-[#0A0A0A]">Belum ada tugas</p>
          <p className="text-xs text-gray-500 mt-1">
            Tekan "+ Tambah Tugas" untuk membuat catatan rencana barumu.
          </p>
        </NbCard>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((todo) => {
            const isOverdue =
              !todo.isCompleted && todo.dueDate && todo.dueDate < todayStr;
            const completedSubtasksCount = todo.subtasks.filter((st) => st.isDone).length;
            const isExpanded = expandedTodoIds.has(todo.id);

            return (
              <NbCard
                key={todo.id}
                className={cn(
                  'p-3.5 space-y-2 transition-all',
                  todo.isCompleted && 'bg-gray-50 opacity-80'
                )}
              >
                {/* Main Card Header */}
                <div className="flex items-start gap-3">
                  {/* Big Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleTodoStatus(todo.id)}
                    aria-label="Tandai Selesai"
                    className={cn(
                      'w-6 h-6 rounded-lg border-2 border-[#0A0A0A] flex items-center justify-center flex-shrink-0 mt-0.5 transition-all cursor-pointer',
                      todo.isCompleted
                        ? 'bg-[#00E676] shadow-none'
                        : 'bg-white shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px]'
                    )}
                  >
                    {todo.isCompleted && (
                      <IconCheck className="w-4 h-4 text-[#0A0A0A] stroke-[3.5]" />
                    )}
                  </button>

                  {/* Todo Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1">
                      <h3
                        className={cn(
                          'font-extrabold text-sm text-[#0A0A0A] leading-snug break-words',
                          todo.isCompleted && 'line-through text-gray-500'
                        )}
                      >
                        {todo.title}
                      </h3>

                      {/* Pin to Home Widget toggle */}
                      <button
                        type="button"
                        onClick={() => togglePinWidget(todo.id)}
                        title={
                          todo.pinToHomeWidget
                            ? 'Aktif di Widget HP'
                            : 'Pin ke Widget Layar HP'
                        }
                        className={cn(
                          'p-1 rounded-md border border-[#0A0A0A] transition-all cursor-pointer flex-shrink-0',
                          todo.pinToHomeWidget
                            ? 'bg-[#FFE135] shadow-[1px_1px_0px_#0A0A0A]'
                            : 'bg-gray-100 text-gray-400 hover:text-black'
                        )}
                      >
                        <IconPin className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {todo.description && (
                      <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                        {todo.description}
                      </p>
                    )}

                    {/* Badges row */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <NbBadge variant={getPriorityBadgeVariant(todo.priority)}>
                        {todo.priority.toUpperCase()}
                      </NbBadge>

                      {(() => {
                        const catInfo = getCategoryIconBadge(todo.category);
                        const CatIcon = catInfo.icon;
                        return (
                          <span
                            title={`Kategori: ${catInfo.label}`}
                            className={cn(
                              'text-[10px] font-black uppercase px-1.5 py-0.5 rounded border inline-flex items-center gap-1 shadow-[1px_1px_0px_#0A0A0A]',
                              catInfo.className
                            )}
                          >
                            <CatIcon className="w-3 h-3 stroke-[2.5]" />
                            <span>{catInfo.label}</span>
                          </span>
                        );
                      })()}

                      {todo.recurrence && todo.recurrence !== 'none' && (
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded border border-purple-300 flex items-center gap-0.5">
                          <IconRepeat className="w-3 h-3" />
                          {todo.recurrence}
                        </span>
                      )}

                      {todo.dueDate && (
                        <span
                          className={cn(
                            'text-[10px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-0.5',
                            isOverdue
                              ? 'bg-red-100 text-red-700 border-red-300'
                              : 'bg-yellow-50 text-gray-700 border-yellow-300'
                          )}
                        >
                          <IconCalendar className="w-3 h-3" />
                          {isOverdue ? 'Terlambat: ' : ''}
                          {todo.dueDate}
                          {todo.reminderTime ? ` ${todo.reminderTime}` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subtasks Accordion (if any) */}
                {todo.subtasks.length > 0 && (
                  <div className="pt-2 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => toggleExpand(todo.id)}
                      className="w-full flex items-center justify-between text-xs font-bold text-gray-700 hover:text-[#0A0A0A] py-0.5 cursor-pointer"
                    >
                      <span>
                        Sub-tugas: {completedSubtasksCount} / {todo.subtasks.length} Selesai
                      </span>
                      {isExpanded ? (
                        <IconChevronUp className="w-4 h-4" />
                      ) : (
                        <IconChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 space-y-1.5 pl-2 border-l-2 border-[#0A0A0A]/30">
                        {todo.subtasks.map((st) => (
                          <div
                            key={st.id}
                            onClick={() => toggleSubtask(todo.id, st.id)}
                            className="flex items-center gap-2 cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              checked={st.isDone}
                              onChange={() => {}}
                              className="w-4 h-4 accent-[#00E676] cursor-pointer"
                            />
                            <span
                              className={cn(
                                'text-xs font-medium text-gray-800',
                                st.isDone && 'line-through text-gray-400'
                              )}
                            >
                              {st.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Card Action */}
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => handleDelete(todo.id)}
                    title="Hapus tugas"
                    className="p-1 rounded text-gray-400 hover:text-red-500 transition-all cursor-pointer"
                  >
                    <IconTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </NbCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
```

