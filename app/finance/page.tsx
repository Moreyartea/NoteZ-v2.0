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
