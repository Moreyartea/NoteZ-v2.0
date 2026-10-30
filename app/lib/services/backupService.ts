import { db } from '@/app/lib/db';
import { seedInitialData } from '@/app/lib/seed';

export interface NoteZBackupPayload {
  app: string;
  version: string;
  exportedAt: string;
  data: {
    wallets: unknown[];
    transactions: unknown[];
    budgets_and_bills: unknown[];
    debts: unknown[];
    todos: unknown[];
    habits: unknown[];
    notes: unknown[];
    media_watchlist: unknown[];
    wishlists: unknown[];
    notifications: unknown[];
    settings: unknown[];
  };
}

/**
 * Extracts all 11 Dexie IndexedDB tables and triggers a browser file download.
 * File format: NoteZ_Backup_YYYYMMDD_HHmm.json
 */
export async function exportAllDataToJson(): Promise<string> {
  const [
    wallets,
    transactions,
    budgets_and_bills,
    debts,
    todos,
    habits,
    notes,
    media_watchlist,
    wishlists,
    notifications,
    settings,
  ] = await Promise.all([
    db.wallets.toArray(),
    db.transactions.toArray(),
    db.budgets_and_bills.toArray(),
    db.debts.toArray(),
    db.todos.toArray(),
    db.habits.toArray(),
    db.notes.toArray(),
    db.media_watchlist.toArray(),
    db.wishlists.toArray(),
    db.notifications.toArray(),
    db.settings.toArray(),
  ]);

  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');

  const fileName = `NoteZ_Backup_${y}${m}${d}_${h}${min}.json`;

  const backupData: NoteZBackupPayload = {
    app: 'NoteZ',
    version: '2.0',
    exportedAt: now.toISOString(),
    data: {
      wallets,
      transactions,
      budgets_and_bills,
      debts,
      todos,
      habits,
      notes,
      media_watchlist,
      wishlists,
      notifications,
      settings,
    },
  };

  const jsonStr = JSON.stringify(backupData, null, 2);

  if (typeof window !== 'undefined') {
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return fileName;
}

/**
 * Validates, clears existing local data, and restores all 11 tables transactionally
 */
export async function importDataFromJson(jsonContent: string): Promise<void> {
  let parsed: NoteZBackupPayload;
  try {
    parsed = JSON.parse(jsonContent);
  } catch {
    throw new Error('File tidak valid: bukan format JSON yang benar.');
  }

  if (parsed.app !== 'NoteZ' || !parsed.data) {
    throw new Error('File ini bukan file backup NoteZ v2.0 yang valid.');
  }

  await db.transaction(
    'rw',
    [
      db.wallets,
      db.transactions,
      db.budgets_and_bills,
      db.debts,
      db.todos,
      db.habits,
      db.notes,
      db.media_watchlist,
      db.wishlists,
      db.notifications,
      db.settings,
    ],
    async () => {
      // Clear all existing data
      await Promise.all([
        db.wallets.clear(),
        db.transactions.clear(),
        db.budgets_and_bills.clear(),
        db.debts.clear(),
        db.todos.clear(),
        db.habits.clear(),
        db.notes.clear(),
        db.media_watchlist.clear(),
        db.wishlists.clear(),
        db.notifications.clear(),
        db.settings.clear(),
      ]);

      // Bulk add from backup
      const d = parsed.data;
      if (d.wallets?.length) await db.wallets.bulkAdd(d.wallets as never);
      if (d.transactions?.length)
        await db.transactions.bulkAdd(d.transactions as never);
      if (d.budgets_and_bills?.length)
        await db.budgets_and_bills.bulkAdd(d.budgets_and_bills as never);
      if (d.debts?.length) await db.debts.bulkAdd(d.debts as never);
      if (d.todos?.length) await db.todos.bulkAdd(d.todos as never);
      if (d.habits?.length) await db.habits.bulkAdd(d.habits as never);
      if (d.notes?.length) await db.notes.bulkAdd(d.notes as never);
      if (d.media_watchlist?.length)
        await db.media_watchlist.bulkAdd(d.media_watchlist as never);
      if (d.wishlists?.length)
        await db.wishlists.bulkAdd(d.wishlists as never);
      if (d.notifications?.length)
        await db.notifications.bulkAdd(d.notifications as never);
      if (d.settings?.length) await db.settings.bulkAdd(d.settings as never);
    }
  );
}

/**
 * Resets the entire local database to factory defaults and runs initial seed
 */
export async function resetEntireDatabase(): Promise<void> {
  await db.transaction(
    'rw',
    [
      db.wallets,
      db.transactions,
      db.budgets_and_bills,
      db.debts,
      db.todos,
      db.habits,
      db.notes,
      db.media_watchlist,
      db.wishlists,
      db.notifications,
      db.settings,
    ],
    async () => {
      await Promise.all([
        db.wallets.clear(),
        db.transactions.clear(),
        db.budgets_and_bills.clear(),
        db.debts.clear(),
        db.todos.clear(),
        db.habits.clear(),
        db.notes.clear(),
        db.media_watchlist.clear(),
        db.wishlists.clear(),
        db.notifications.clear(),
        db.settings.clear(),
      ]);
    }
  );

  await seedInitialData();
}

