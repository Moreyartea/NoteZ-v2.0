import { db } from '@/app/lib/db';
import type {
  WishlistItem,
  WishlistHistoryItem,
  WishlistPriority,
  Transaction,
} from '@/app/lib/types';

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
}

/**
 * Calculates estimated remaining days/months until target is reached
 */
export function calculateSavingsEstimate(
  targetPrice: number,
  savedAmount: number,
  dailySavingsRate: number = 20000 // default IDR 20.000 / day
): { remainingAmount: number; daysLeft: number; summary: string } {
  const remainingAmount = Math.max(0, targetPrice - savedAmount);
  if (remainingAmount === 0) {
    return {
      remainingAmount: 0,
      daysLeft: 0,
      summary: 'Target impian sudah tercapai! 🎉',
    };
  }

  const effectiveDaily = dailySavingsRate > 0 ? dailySavingsRate : 20000;
  const daysLeft = Math.ceil(remainingAmount / effectiveDaily);

  const summary = `Kurang Rp ${remainingAmount.toLocaleString('id-ID')} lagi. Menabung Rp ${effectiveDaily.toLocaleString('id-ID')}/hari akan tercapai dalam ${daysLeft} hari (${Math.ceil(daysLeft / 30)} bulan).`;

  return { remainingAmount, daysLeft, summary };
}

/**
 * wishlistService - Sinking Funds & Dream Wishlist Service Layer
 * Atomic IndexedDB transactions with Dexie.js
 */

export async function createWishlistItem(data: {
  name: string;
  targetPrice: number;
  priorityStars?: WishlistPriority;
  imageUrl?: string | null;
  storeUrl?: string | null;
  showOnHomeWidget?: boolean;
}): Promise<string> {
  const id = generateId();
  const now = new Date().toISOString();

  const newWishlist: WishlistItem = {
    id,
    name: data.name.trim(),
    targetPrice: Number(data.targetPrice) || 0,
    savedAmount: 0,
    priorityStars: data.priorityStars || 3,
    imageUrl: data.imageUrl || null,
    storeUrl: data.storeUrl || null,
    showOnHomeWidget: data.showOnHomeWidget || false,
    isAchieved: false,
    history: [],
    createdAt: now,
    updatedAt: now,
  };

  await db.wishlists.add(newWishlist);
  return id;
}

export async function depositToWishlist(
  wishlistId: string,
  amount: number,
  walletId?: string | null
): Promise<void> {
  if (amount <= 0) throw new Error('Nominal setoran tabungan harus lebih dari 0');

  await db.transaction(
    'rw',
    [db.wallets, db.transactions, db.wishlists],
    async () => {
      const wishlist = await db.wishlists.get(wishlistId);
      if (!wishlist) throw new Error('Barang impian tidak ditemukan');

      const now = new Date().toISOString();

      // If wallet selected, atomically deduct balance and record transaction
      if (walletId) {
        const wallet = await db.wallets.get(walletId);
        if (!wallet) throw new Error('Dompet tidak ditemukan');

        if (wallet.balance < amount) {
          throw new Error(
            `Saldo dompet ${wallet.name} tidak cukup (Butuh: Rp ${amount.toLocaleString('id-ID')}, Ada: Rp ${wallet.balance.toLocaleString('id-ID')})`
          );
        }

        // Deduct from wallet
        await db.wallets.update(walletId, {
          balance: wallet.balance - amount,
          updatedAt: now,
        });

        // Record expense transaction
        const tx: Transaction = {
          id: generateId(),
          walletId,
          type: 'expense',
          amount,
          category: 'Tabungan Wishlist',
          title: `Nabung: ${wishlist.name}`,
          note: `Setoran tabungan barang impian (${wishlist.name})`,
          date: now,
        };
        await db.transactions.add(tx);
      }

      const newSaved = wishlist.savedAmount + amount;
      const isAchieved = newSaved >= wishlist.targetPrice;

      const historyItem: WishlistHistoryItem = {
        id: generateId(),
        date: now,
        amount,
        type: 'deposit',
        walletId: walletId || null,
      };

      await db.wishlists.update(wishlistId, {
        savedAmount: newSaved,
        isAchieved,
        history: [...wishlist.history, historyItem],
        updatedAt: now,
      });
    }
  );
}

export async function withdrawFromWishlist(
  wishlistId: string,
  amount: number,
  walletId?: string | null
): Promise<void> {
  if (amount <= 0) throw new Error('Nominal penarikan harus lebih dari 0');

  await db.transaction(
    'rw',
    [db.wallets, db.transactions, db.wishlists],
    async () => {
      const wishlist = await db.wishlists.get(wishlistId);
      if (!wishlist) throw new Error('Barang impian tidak ditemukan');

      if (wishlist.savedAmount < amount) {
        throw new Error('Nominal penarikan melebihi dana tabungan yang terkumpul');
      }

      const now = new Date().toISOString();

      // If wallet selected, refund money back into wallet
      if (walletId) {
        const wallet = await db.wallets.get(walletId);
        if (wallet) {
          await db.wallets.update(walletId, {
            balance: wallet.balance + amount,
            updatedAt: now,
          });

          // Record income transaction
          const tx: Transaction = {
            id: generateId(),
            walletId,
            type: 'income',
            amount,
            category: 'Tabungan Wishlist',
            title: `Tarik Dana: ${wishlist.name}`,
            note: `Penarikan dana tabungan (${wishlist.name})`,
            date: now,
          };
          await db.transactions.add(tx);
        }
      }

      const newSaved = wishlist.savedAmount - amount;
      const isAchieved = newSaved >= wishlist.targetPrice;

      const historyItem: WishlistHistoryItem = {
        id: generateId(),
        date: now,
        amount,
        type: 'withdraw',
        walletId: walletId || null,
      };

      await db.wishlists.update(wishlistId, {
        savedAmount: newSaved,
        isAchieved,
        history: [...wishlist.history, historyItem],
        updatedAt: now,
      });
    }
  );
}

export async function toggleWishlistWidget(id: string): Promise<void> {
  const wishlist = await db.wishlists.get(id);
  if (!wishlist) return;

  await db.wishlists.update(id, {
    showOnHomeWidget: !wishlist.showOnHomeWidget,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteWishlistItem(id: string): Promise<void> {
  await db.wishlists.delete(id);
}

