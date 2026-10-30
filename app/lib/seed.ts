import { db } from './db';
import type { Wallet, AppSettings } from './types';

/**
 * Seeds initial data into Dexie.js if the database is newly initialized.
 * - 3 Default Wallets: Tunai (cash), Rekening Bank (bank), E-Wallet (ewallet)
 * - Default App Settings: Daily reminder 20:00, currency IDR, Pomodoro 25/5 min
 */
export async function seedInitialData(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const walletCount = await db.wallets.count();
    if (walletCount === 0) {
      const now = new Date().toISOString();
      const defaultWallets: Wallet[] = [
        {
          id: 'wallet-default-cash',
          name: 'Tunai',
          type: 'cash',
          balance: 0,
          color: '#00E676', // Finance neon green
          icon: 'cash',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'wallet-default-bank',
          name: 'Rekening Bank',
          type: 'bank',
          balance: 0,
          color: '#3B6FFF', // Secondary electric blue
          icon: 'building-bank',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'wallet-default-ewallet',
          name: 'E-Wallet',
          type: 'ewallet',
          balance: 0,
          color: '#A855F7', // Media purple
          icon: 'wallet',
          createdAt: now,
          updatedAt: now,
        },
      ];
      await db.wallets.bulkAdd(defaultWallets);
    }

    const settingsCount = await db.settings.count();
    if (settingsCount === 0) {
      const now = new Date().toISOString();
      const defaultSettings: AppSettings = {
        id: 'default',
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
      await db.settings.add(defaultSettings);
    }
  } catch (error) {
    console.error('Failed to seed initial data:', error);
  }
}

