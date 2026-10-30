import Dexie, { type EntityTable } from 'dexie';
import type {
  Wallet,
  Transaction,
  BudgetAndBill,
  Debt,
  Todo,
  Habit,
  Note,
  MediaItem,
  WishlistItem,
  AppNotification,
  AppSettings,
} from './types';

/**
 * NoteZDatabase - Pure Offline-First IndexedDB Layer powered by Dexie.js
 * Implements 11 core tables based on PRD Section 7.2
 */
export class NoteZDatabase extends Dexie {
  wallets!: EntityTable<Wallet, 'id'>;
  transactions!: EntityTable<Transaction, 'id'>;
  budgets_and_bills!: EntityTable<BudgetAndBill, 'id'>;
  debts!: EntityTable<Debt, 'id'>;
  todos!: EntityTable<Todo, 'id'>;
  habits!: EntityTable<Habit, 'id'>;
  notes!: EntityTable<Note, 'id'>;
  media_watchlist!: EntityTable<MediaItem, 'id'>;
  wishlists!: EntityTable<WishlistItem, 'id'>;
  notifications!: EntityTable<AppNotification, 'id'>;
  settings!: EntityTable<AppSettings, 'id'>;

  constructor() {
    super('NoteZDatabase');
    this.version(1).stores({
      wallets: 'id, type, name, createdAt',
      transactions: 'id, walletId, toWalletId, type, category, date',
      budgets_and_bills: 'id, type, category, monthYear, dueDayOfMonth, walletId',
      debts: 'id, type, personName, dueDate, isSettled',
      todos: 'id, priority, category, dueDate, isCompleted, pinToHomeWidget, recurrence',
      habits: 'id, title, currentStreak',
      notes: 'id, folder, isPinned, showOnHomeWidget, isTrashed, createdAt, updatedAt',
      media_watchlist: 'id, type, status, score, tier, airingDay, reminderEnabled',
      wishlists: 'id, priorityStars, showOnHomeWidget, isAchieved, createdAt',
      notifications: 'id, category, isRead, createdAt',
      settings: 'id',
    });
  }
}

export const db = new NoteZDatabase();

