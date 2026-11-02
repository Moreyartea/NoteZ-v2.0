'use client';

import React, { useState } from 'react';
import {
  IconTrash,
  IconArrowUpRight,
  IconArrowDownLeft,
  IconArrowsExchange,
  IconFilter,
} from '@tabler/icons-react';
import type { Transaction, Wallet } from '@/app/lib/types';
import { NbCard } from '@/components/ui/NbCard';
import { NbConfirmModal } from '@/components/ui/NbConfirmModal';
import { deleteTransaction } from '@/app/lib/services/financeService';
import { formatRupiah, cn } from '@/app/lib/utils';

export interface TransactionHistoryListProps {
  transactions: Transaction[];
  wallets: Wallet[];
}

export const TransactionHistoryList: React.FC<TransactionHistoryListProps> = ({
  transactions,
  wallets,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterWallet, setFilterWallet] = useState<string>('all');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const walletMap = new Map(wallets.map((w) => [w.id, w.name]));

  // Filter transactions
  const filtered = transactions.filter((tx) => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (filterWallet !== 'all' && tx.walletId !== filterWallet && tx.toWalletId !== filterWallet)
      return false;
    return true;
  });

  const confirmDeleteAction = async () => {
    if (!pendingDeleteId) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(pendingDeleteId);
      setPendingDeleteId(null);
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const getTxTypeBadge = (tx: Transaction) => {
    if (tx.type === 'expense') {
      return (
        <span className="p-2 rounded-xl bg-[#FF3B30] text-white border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000]">
          <IconArrowUpRight className="w-4 h-4 stroke-[3]" />
        </span>
      );
    }
    if (tx.type === 'income') {
      return (
        <span className="p-2 rounded-xl bg-[#00E676] text-[#0A0A0A] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000]">
          <IconArrowDownLeft className="w-4 h-4 stroke-[3]" />
        </span>
      );
    }
    return (
      <span className="p-2 rounded-xl bg-[#3B6FFF] text-white border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000]">
        <IconArrowsExchange className="w-4 h-4 stroke-[3]" />
      </span>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-[#0A0A0A] dark:text-[var(--theme-text-primary)] uppercase tracking-wide">
          Riwayat Transaksi ({filtered.length})
        </h2>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-col gap-2 p-3 bg-white dark:bg-[var(--theme-surface)] rounded-xl border-2 border-[#0A0A0A] dark:border-[var(--theme-border)] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000]">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 px-1 -mx-1">
          <IconFilter className="w-4 h-4 text-gray-500 dark:text-[var(--theme-text-muted)] flex-shrink-0" />
          {['all', 'expense', 'income', 'transfer'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterType(t)}
              className={cn(
                'px-2.5 py-1 text-xs font-bold rounded-lg border-2 border-[#0A0A0A] dark:border-[var(--theme-border)] transition-all cursor-pointer whitespace-nowrap',
                filterType === t
                  ? 'bg-[#FFE135] text-[#0A0A0A] shadow-[1.5px_1.5px_0px_#0A0A0A] dark:shadow-[1.5px_1.5px_0px_#000000]'
                  : 'bg-[#F5F2EB] dark:bg-[var(--theme-surface-elevated)] text-gray-700 dark:text-[var(--theme-text-muted)] hover:bg-white dark:hover:bg-white/10'
              )}
            >
              {t === 'all'
                ? 'Semua'
                : t === 'expense'
                ? 'Pengeluaran'
                : t === 'income'
                ? 'Pemasukan'
                : 'Transfer'}
            </button>
          ))}
        </div>

        {wallets.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-2 border-t-2 border-[#0A0A0A]/10 dark:border-[var(--theme-border-subtle)]">
            <span className="text-[10px] font-black uppercase text-gray-500 dark:text-[var(--theme-text-muted)] flex-shrink-0">
              Dompet:
            </span>
            <button
              type="button"
              onClick={() => setFilterWallet('all')}
              className={cn(
                'px-2.5 py-1 text-[11px] font-bold rounded-lg border-2 transition-all cursor-pointer whitespace-nowrap',
                filterWallet === 'all'
                  ? 'bg-[#0A0A0A] text-white border-[#0A0A0A] dark:bg-white dark:text-[#0A0A0A] dark:border-white'
                  : 'bg-gray-100 dark:bg-[var(--theme-surface-elevated)] text-gray-700 dark:text-[var(--theme-text-primary)] border-[#0A0A0A]/20 dark:border-[var(--theme-border-subtle)]'
              )}
            >
              Semua Dompet
            </button>
            {wallets.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setFilterWallet(w.id)}
                className={cn(
                  'px-2.5 py-1 text-[11px] font-bold rounded-lg border-2 transition-all cursor-pointer whitespace-nowrap',
                  filterWallet === w.id
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A] dark:bg-white dark:text-[#0A0A0A] dark:border-white'
                    : 'bg-gray-100 dark:bg-[var(--theme-surface-elevated)] text-gray-700 dark:text-[var(--theme-text-primary)] border-[#0A0A0A]/20 dark:border-[var(--theme-border-subtle)]'
                )}
              >
                {w.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Items */}
      {filtered.length === 0 ? (
        <NbCard className="p-6 text-center border-2 border-[#0A0A0A] dark:border-[var(--theme-border)]">
          <p className="text-sm font-bold text-[#0A0A0A] dark:text-[var(--theme-text-primary)]">Belum ada riwayat transaksi</p>
          <p className="text-xs text-gray-500 dark:text-[var(--theme-text-muted)] mt-1">
            Tekan tombol "+ Catat Transaksi" untuk menambahkan catatan baru.
          </p>
        </NbCard>
      ) : (
        <div className="space-y-2">
          {filtered.map((tx) => {
            const sourceName = walletMap.get(tx.walletId) || 'Dompet';
            const destName = tx.toWalletId ? walletMap.get(tx.toWalletId) : null;
            const isExpense = tx.type === 'expense';
            const isIncome = tx.type === 'income';

            return (
              <NbCard
                key={tx.id}
                className="p-3 flex items-center justify-between gap-3 border-2 border-[#0A0A0A] dark:border-[var(--theme-border)]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {getTxTypeBadge(tx)}
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-[#0A0A0A] dark:text-[var(--theme-text-primary)] truncate">
                      {tx.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="text-[10px] font-bold text-gray-700 dark:text-[var(--theme-text-muted)] bg-gray-100 dark:bg-[var(--theme-surface-elevated)] px-1.5 py-0.5 rounded border border-[#0A0A0A]/20 dark:border-[var(--theme-border-subtle)]">
                        {tx.category}
                      </span>
                      <span className="text-[10px] text-gray-600 dark:text-[var(--theme-text-muted)] font-semibold truncate">
                        {tx.type === 'transfer' && destName
                          ? `${sourceName} → ${destName}`
                          : sourceName}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
                        {new Date(tx.date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <p
                      className={cn(
                        'font-mono text-sm font-black tracking-tight',
                        isExpense
                          ? 'text-[#FF3B30] dark:text-red-400'
                          : isIncome
                          ? 'text-[#00C853] dark:text-emerald-400'
                          : 'text-[#3B6FFF] dark:text-blue-400'
                      )}
                    >
                      {isExpense ? '-' : isIncome ? '+' : ''}
                      {formatRupiah(tx.amount)}
                    </p>
                    {tx.adminFee && tx.adminFee > 0 && (
                      <p className="text-[10px] font-mono text-gray-500 dark:text-[var(--theme-text-muted)]">
                        Biaya: +{formatRupiah(tx.adminFee)}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setPendingDeleteId(tx.id)}
                    title="Hapus transaksi"
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-[var(--theme-surface-elevated)] text-gray-500 dark:text-[var(--theme-text-muted)] hover:text-red-600 dark:hover:text-red-400 border-2 border-[#0A0A0A] dark:border-[var(--theme-border)] shadow-[1.5px_1.5px_0px_#0A0A0A] dark:shadow-[1.5px_1.5px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              </NbCard>
            );
          })}
        </div>
      )}

      {/* Custom Themed Confirmation Modal */}
      <NbConfirmModal
        isOpen={Boolean(pendingDeleteId)}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={confirmDeleteAction}
        title="Hapus Transaksi"
        message="Hapus transaksi ini? Saldo dompet terkait akan otomatis dikembalikan (revert)."
        confirmText="Ya, Hapus"
        variant="danger"
      />
    </div>
  );
};
