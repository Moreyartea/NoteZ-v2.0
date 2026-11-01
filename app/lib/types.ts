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

