import { db } from '@/app/lib/db';
import type {
  Wallet,
  Transaction,
  BudgetAndBill,
  Debt,
  TransactionType,
  DebtType,
  WalletType,
} from '@/app/lib/types';

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
}

export function getCurrentMonthYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * financeService - ACID-compliant IndexedDB Service Layer for NoteZ v2.0
 * Pure Offline-First with Dexie.js Transactions
 */

// ===================== WALLET OPERATIONS =====================

export async function createWallet(data: {
  name: string;
  type: WalletType;
  balance?: number;
  color?: string;
  icon?: string;
}): Promise<string> {
  const id = generateId();
  const now = new Date().toISOString();
  const wallet: Wallet = {
    id,
    name: data.name.trim(),
    type: data.type,
    balance: Number(data.balance) || 0,
    color: data.color || '#3B6FFF',
    icon: data.icon || 'wallet',
    createdAt: now,
    updatedAt: now,
  };

  await db.wallets.add(wallet);
  return id;
}

export async function updateWalletBalance(
  walletId: string,
  actualBalance: number,
  reason?: string
): Promise<void> {
  await db.transaction('rw', [db.wallets, db.transactions], async () => {
    const wallet = await db.wallets.get(walletId);
    if (!wallet) throw new Error('Dompet tidak ditemukan');

    const diff = actualBalance - wallet.balance;
    if (diff === 0) return;

    const now = new Date().toISOString();

    // Create automated adjustment transaction
    const adjustmentTx: Transaction = {
      id: generateId(),
      walletId,
      type: diff > 0 ? 'income' : 'expense',
      amount: Math.abs(diff),
      category: 'Penyesuaian',
      title: reason?.trim() || (diff > 0 ? 'Penyesuaian Saldo (Lebih)' : 'Penyesuaian Saldo (Kurang)'),
      note: `Saldo lama: Rp ${wallet.balance.toLocaleString('id-ID')} -> Saldo baru: Rp ${actualBalance.toLocaleString('id-ID')}`,
      date: now,
    };

    await db.transactions.add(adjustmentTx);
    await db.wallets.update(walletId, {
      balance: actualBalance,
      updatedAt: now,
    });
  });
}

// ===================== TRANSACTION OPERATIONS =====================

export async function addTransaction(data: {
  walletId: string;
  toWalletId?: string | null;
  type: TransactionType;
  amount: number;
  adminFee?: number | null;
  category: string;
  title: string;
  note?: string | null;
  date?: string;
}): Promise<string> {
  if (data.amount <= 0) {
    throw new Error('Nominal transaksi harus lebih besar dari 0');
  }

  const txId = generateId();
  const now = data.date || new Date().toISOString();
  const adminFee = Number(data.adminFee) || 0;

  await db.transaction('rw', [db.wallets, db.transactions], async () => {
    const sourceWallet = await db.wallets.get(data.walletId);
    if (!sourceWallet) throw new Error('Dompet sumber tidak ditemukan');

    if (data.type === 'expense') {
      await db.wallets.update(data.walletId, {
        balance: sourceWallet.balance - data.amount,
        updatedAt: now,
      });
    } else if (data.type === 'income') {
      await db.wallets.update(data.walletId, {
        balance: sourceWallet.balance + data.amount,
        updatedAt: now,
      });
    } else if (data.type === 'transfer') {
      if (!data.toWalletId) {
        throw new Error('Dompet tujuan transfer wajib dipilih');
      }
      if (data.toWalletId === data.walletId) {
        throw new Error('Dompet tujuan tidak boleh sama dengan dompet asal');
      }

      const destWallet = await db.wallets.get(data.toWalletId);
      if (!destWallet) throw new Error('Dompet tujuan tidak ditemukan');

      const totalDeduction = data.amount + adminFee;
      if (sourceWallet.balance < totalDeduction) {
        throw new Error(
          `Saldo dompet ${sourceWallet.name} tidak cukup (Butuh: Rp ${totalDeduction.toLocaleString('id-ID')}, Ada: Rp ${sourceWallet.balance.toLocaleString('id-ID')})`
        );
      }

      // Deduct from source
      await db.wallets.update(data.walletId, {
        balance: sourceWallet.balance - totalDeduction,
        updatedAt: now,
      });

      // Add to destination
      await db.wallets.update(data.toWalletId, {
        balance: destWallet.balance + data.amount,
        updatedAt: now,
      });
    }

    // Save transaction
    const newTx: Transaction = {
      id: txId,
      walletId: data.walletId,
      toWalletId: data.toWalletId || null,
      type: data.type,
      amount: data.amount,
      adminFee: adminFee > 0 ? adminFee : null,
      category: data.category.trim() || 'Lainnya',
      title: data.title.trim() || 'Transaksi',
      note: data.note?.trim() || null,
      date: now,
    };

    await db.transactions.add(newTx);
  });

  return txId;
}

export async function deleteTransaction(id: string): Promise<void> {
  await db.transaction('rw', [db.wallets, db.transactions], async () => {
    const tx = await db.transactions.get(id);
    if (!tx) return;

    const sourceWallet = await db.wallets.get(tx.walletId);

    if (tx.type === 'expense' && sourceWallet) {
      // Revert expense: re-add to source wallet
      await db.wallets.update(tx.walletId, {
        balance: sourceWallet.balance + tx.amount,
        updatedAt: new Date().toISOString(),
      });
    } else if (tx.type === 'income' && sourceWallet) {
      // Revert income: deduct from source wallet
      await db.wallets.update(tx.walletId, {
        balance: sourceWallet.balance - tx.amount,
        updatedAt: new Date().toISOString(),
      });
    } else if (tx.type === 'transfer') {
      const adminFee = tx.adminFee || 0;
      if (sourceWallet) {
        await db.wallets.update(tx.walletId, {
          balance: sourceWallet.balance + tx.amount + adminFee,
          updatedAt: new Date().toISOString(),
        });
      }
      if (tx.toWalletId) {
        const destWallet = await db.wallets.get(tx.toWalletId);
        if (destWallet) {
          await db.wallets.update(tx.toWalletId, {
            balance: destWallet.balance - tx.amount,
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }

    await db.transactions.delete(id);
  });
}

// ===================== BUDGET & BILL OPERATIONS =====================

export async function setBudget(
  category: string,
  limitAmount: number,
  monthYear?: string
): Promise<string> {
  const targetMonth = monthYear || getCurrentMonthYear();
  const now = new Date().toISOString();

  const existing = await db.budgets_and_bills
    .filter(
      (b) =>
        b.type === 'budget' &&
        b.category.toLowerCase() === category.toLowerCase() &&
        b.monthYear === targetMonth
    )
    .first();

  if (existing) {
    await db.budgets_and_bills.update(existing.id, {
      limitAmount,
      updatedAt: now,
    });
    return existing.id;
  }

  const id = generateId();
  const newBudget: BudgetAndBill = {
    id,
    type: 'budget',
    category: category.trim(),
    limitAmount,
    monthYear: targetMonth,
    createdAt: now,
    updatedAt: now,
  };

  await db.budgets_and_bills.add(newBudget);
  return id;
}

export async function addBill(data: {
  category: string;
  limitAmount: number;
  dueDayOfMonth: number;
  walletId?: string;
}): Promise<string> {
  const id = generateId();
  const now = new Date().toISOString();

  const bill: BudgetAndBill = {
    id,
    type: 'bill',
    category: data.category.trim(),
    limitAmount: data.limitAmount,
    dueDayOfMonth: data.dueDayOfMonth,
    walletId: data.walletId || null,
    lastPaidMonth: null,
    createdAt: now,
    updatedAt: now,
  };

  await db.budgets_and_bills.add(bill);
  return id;
}

export async function payBill(billId: string, walletId: string): Promise<void> {
  await db.transaction(
    'rw',
    [db.wallets, db.transactions, db.budgets_and_bills],
    async () => {
      const bill = await db.budgets_and_bills.get(billId);
      if (!bill) throw new Error('Tagihan tidak ditemukan');

      const wallet = await db.wallets.get(walletId);
      if (!wallet) throw new Error('Dompet pembayaran tidak ditemukan');

      if (wallet.balance < bill.limitAmount) {
        throw new Error(
          `Saldo dompet ${wallet.name} tidak cukup untuk membayar tagihan ini (Butuh: Rp ${bill.limitAmount.toLocaleString('id-ID')})`
        );
      }

      const now = new Date().toISOString();
      const currentMonth = getCurrentMonthYear();

      // Deduct wallet balance
      await db.wallets.update(walletId, {
        balance: wallet.balance - bill.limitAmount,
        updatedAt: now,
      });

      // Record transaction
      const tx: Transaction = {
        id: generateId(),
        walletId,
        type: 'expense',
        amount: bill.limitAmount,
        category: bill.category,
        title: `Bayar Tagihan: ${bill.category}`,
        note: `Tagihan rutin bulan ${currentMonth}`,
        date: now,
      };
      await db.transactions.add(tx);

      // Update bill paid status
      await db.budgets_and_bills.update(billId, {
        lastPaidMonth: currentMonth,
        updatedAt: now,
      });
    }
  );
}

// ===================== DEBT OPERATIONS =====================

export async function addDebt(data: {
  personName: string;
  type: DebtType;
  totalAmount: number;
  dueDate?: string | null;
  notes?: string | null;
}): Promise<string> {
  const id = generateId();
  const now = new Date().toISOString();

  const debt: Debt = {
    id,
    personName: data.personName.trim(),
    type: data.type,
    totalAmount: data.totalAmount,
    paidAmount: 0,
    dueDate: data.dueDate || null,
    isSettled: false,
    notes: data.notes?.trim() || null,
    createdAt: now,
    updatedAt: now,
  };

  await db.debts.add(debt);
  return id;
}

export async function payDebtInstallment(
  debtId: string,
  amount: number,
  walletId: string
): Promise<void> {
  if (amount <= 0) throw new Error('Nominal cicilan harus lebih dari 0');

  await db.transaction('rw', [db.wallets, db.transactions, db.debts], async () => {
    const debt = await db.debts.get(debtId);
    if (!debt) throw new Error('Data utang/piutang tidak ditemukan');

    const wallet = await db.wallets.get(walletId);
    if (!wallet) throw new Error('Dompet tidak ditemukan');

    const remaining = debt.totalAmount - debt.paidAmount;
    if (amount > remaining) {
      throw new Error(`Nominal cicilan (Rp ${amount.toLocaleString('id-ID')}) melebihi sisa pinjaman (Rp ${remaining.toLocaleString('id-ID')})`);
    }

    const now = new Date().toISOString();
    const newPaid = debt.paidAmount + amount;
    const isSettled = newPaid >= debt.totalAmount;

    if (debt.type === 'payable') {
      // We owe someone -> we pay them -> wallet expense
      if (wallet.balance < amount) {
        throw new Error(`Saldo dompet ${wallet.name} tidak cukup`);
      }
      await db.wallets.update(walletId, {
        balance: wallet.balance - amount,
        updatedAt: now,
      });

      const tx: Transaction = {
        id: generateId(),
        walletId,
        type: 'expense',
        amount,
        category: 'Utang',
        title: `Cicil Utang: ${debt.personName}`,
        note: isSettled ? 'Pelunasan penuh' : `Sisa: Rp ${(debt.totalAmount - newPaid).toLocaleString('id-ID')}`,
        date: now,
      };
      await db.transactions.add(tx);
    } else {
      // Someone owes us -> they pay us -> wallet income
      await db.wallets.update(walletId, {
        balance: wallet.balance + amount,
        updatedAt: now,
      });

      const tx: Transaction = {
        id: generateId(),
        walletId,
        type: 'income',
        amount,
        category: 'Piutang',
        title: `Terima Piutang: ${debt.personName}`,
        note: isSettled ? 'Pelunasan penuh' : `Sisa: Rp ${(debt.totalAmount - newPaid).toLocaleString('id-ID')}`,
        date: now,
      };
      await db.transactions.add(tx);
    }

    await db.debts.update(debtId, {
      paidAmount: newPaid,
      isSettled,
      updatedAt: now,
    });
  });
}

