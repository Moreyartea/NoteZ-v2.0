'use client';

import React, { useState } from 'react';
import {
  IconTarget,
  IconReceipt2,
  IconPlus,
  IconBolt,
  IconCheck,
} from '@tabler/icons-react';
import type { BudgetAndBill, Transaction, Wallet } from '@/app/lib/types';
import { NbCard } from '@/components/ui/NbCard';
import { NbButton } from '@/components/ui/NbButton';
import { NbBadge } from '@/components/ui/NbBadge';
import { NbModal } from '@/components/ui/NbModal';
import { NbInput } from '@/components/ui/NbInput';
import { NbSelect } from '@/components/ui/NbSelect';
import {
  setBudget,
  addBill,
  payBill,
  getCurrentMonthYear,
} from '@/app/lib/services/financeService';
import { formatRupiah, cn } from '@/app/lib/utils';

export interface BudgetTrackerCardProps {
  budgetsAndBills: BudgetAndBill[];
  transactions: Transaction[];
  wallets: Wallet[];
}

export const BudgetTrackerCard: React.FC<BudgetTrackerCardProps> = ({
  budgetsAndBills,
  transactions,
  wallets,
}) => {
  const currentMonth = getCurrentMonthYear();

  // State modals
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState<boolean>(false);
  const [budgetCategory, setBudgetCategory] = useState<string>('Makan & Minum');
  const [budgetLimitStr, setBudgetLimitStr] = useState<string>('');

  const [isBillModalOpen, setIsBillModalOpen] = useState<boolean>(false);
  const [billCategory, setBillCategory] = useState<string>('');
  const [billAmountStr, setBillAmountStr] = useState<string>('');
  const [billDueDay, setBillDueDay] = useState<number>(10);
  const [billWalletId, setBillWalletId] = useState<string>(wallets[0]?.id || '');

  const [payingBill, setPayingBill] = useState<BudgetAndBill | null>(null);
  const [payWalletId, setPayWalletId] = useState<string>(wallets[0]?.id || '');
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string>('');

  // Budgets & Bills lists
  const budgets = budgetsAndBills.filter(
    (b) => b.type === 'budget' && (!b.monthYear || b.monthYear === currentMonth)
  );
  const bills = budgetsAndBills.filter((b) => b.type === 'bill');

  // Calculate current month expenses
  const thisMonthExpenses = transactions.filter(
    (tx) => tx.type === 'expense' && tx.date.startsWith(currentMonth)
  );

  const handleBudgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const limit = Number(budgetLimitStr.replace(/[^0-9]/g, ''));
    if (!limit || limit <= 0) {
      setActionError('Nominal limit budget harus lebih dari 0');
      return;
    }

    try {
      await setBudget(budgetCategory, limit, currentMonth);
      setIsBudgetModalOpen(false);
      setBudgetLimitStr('');
      setActionError('');
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Gagal menyimpan budget');
    }
  };

  const handleBillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(billAmountStr.replace(/[^0-9]/g, ''));
    if (!amount || amount <= 0) {
      setActionError('Nominal tagihan harus lebih dari 0');
      return;
    }

    try {
      await addBill({
        category: billCategory,
        limitAmount: amount,
        dueDayOfMonth: billDueDay,
        walletId: billWalletId,
      });
      setIsBillModalOpen(false);
      setBillCategory('');
      setBillAmountStr('');
      setActionError('');
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Gagal menambahkan tagihan');
    }
  };

  const handleExecutePayBill = async () => {
    if (!payingBill || !payWalletId) return;

    setIsPaying(true);
    setActionError('');
    try {
      await payBill(payingBill.id, payWalletId);
      setPayingBill(null);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Gagal membayar tagihan');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. SECTION: ANGGARAN BULANAN (BUDGETS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <IconTarget className="w-4 h-4 text-[#0A0A0A]" />
            <h2 className="text-sm font-extrabold text-[#0A0A0A] uppercase tracking-wide">
              Anggaran Bulanan ({currentMonth})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsBudgetModalOpen(true);
              setActionError('');
            }}
            className="inline-flex items-center gap-1 text-xs font-bold bg-[#FFE135] text-[#0A0A0A] px-2.5 py-1 rounded-lg border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            <IconPlus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Atur Budget</span>
          </button>
        </div>

        {budgets.length === 0 ? (
          <NbCard className="p-4 text-center text-gray-500">
            <p className="text-xs font-bold text-[#0A0A0A]">Belum ada batas budget kategori</p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Tetapkan batas pengeluaran untuk mencegah boros bulan ini.
            </p>
          </NbCard>
        ) : (
          <div className="space-y-2.5">
            {budgets.map((b) => {
              const spent = thisMonthExpenses
                .filter((tx) => tx.category.toLowerCase() === b.category.toLowerCase())
                .reduce((acc, cur) => acc + cur.amount, 0);

              const percent = Math.min(Math.round((spent / b.limitAmount) * 100), 100);
              const isOver = spent >= b.limitAmount;
              const isWarning = percent >= 80 && !isOver;

              const progressColor = isOver
                ? 'bg-[#FF3B30]'
                : isWarning
                ? 'bg-[#FF6B2B]'
                : 'bg-[#00E676]';

              return (
                <NbCard key={b.id} className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-[#0A0A0A]">
                        {b.category}
                      </span>
                      <p className="text-[11px] font-mono text-gray-600 mt-0.5">
                        {formatRupiah(spent)} / {formatRupiah(b.limitAmount)}
                      </p>
                    </div>
                    <NbBadge
                      variant={isOver ? 'danger' : isWarning ? 'warning' : 'finance'}
                    >
                      {percent}% {isOver ? '(OVER)' : ''}
                    </NbBadge>
                  </div>

                  {/* Neo-Brutalism Progress Bar */}
                  <div className="w-full h-3 rounded-full bg-gray-200 border-2 border-[#0A0A0A] overflow-hidden p-0.5 shadow-inner">
                    <div
                      className={cn('h-full rounded-full transition-all duration-300', progressColor)}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </NbCard>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. SECTION: TAGIHAN RUTIN (RECURRING BILLS) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <IconReceipt2 className="w-4 h-4 text-[#0A0A0A]" />
            <h2 className="text-sm font-extrabold text-[#0A0A0A] uppercase tracking-wide">
              Tagihan Rutin Bulanan
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsBillModalOpen(true);
              setActionError('');
            }}
            className="inline-flex items-center gap-1 text-xs font-bold bg-[#FFE135] text-[#0A0A0A] px-2.5 py-1 rounded-lg border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            <IconPlus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Tambah</span>
          </button>
        </div>

        {bills.length === 0 ? (
          <NbCard className="p-4 text-center text-gray-500">
            <p className="text-xs font-bold text-[#0A0A0A]">Belum ada tagihan rutin</p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Catat tagihan seperti Kos, Listrik, Internet, atau Langganan di sini.
            </p>
          </NbCard>
        ) : (
          <div className="space-y-2">
            {bills.map((bill) => {
              const isPaidThisMonth = bill.lastPaidMonth === currentMonth;

              return (
                <NbCard
                  key={bill.id}
                  className="p-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#0A0A0A] truncate">
                        {bill.category}
                      </span>
                      {isPaidThisMonth && (
                        <NbBadge variant="finance" icon={<IconCheck className="w-3 h-3" />}>
                          Lunas
                        </NbBadge>
                      )}
                    </div>
                    <p className="text-xs font-mono font-bold text-gray-700 mt-0.5">
                      {formatRupiah(bill.limitAmount)}
                    </p>
                    {bill.dueDayOfMonth && (
                      <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
                        Jatuh tempo tiap tanggal {bill.dueDayOfMonth}
                      </p>
                    )}
                  </div>

                  {!isPaidThisMonth ? (
                    <NbButton
                      size="sm"
                      variant="warning"
                      onClick={() => {
                        setPayingBill(bill);
                        setPayWalletId(bill.walletId || wallets[0]?.id || '');
                        setActionError('');
                      }}
                      leftIcon={<IconBolt className="w-3.5 h-3.5 stroke-[3]" />}
                    >
                      Bayar ⚡
                    </NbButton>
                  ) : (
                    <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-md border border-green-400">
                      Terbayar
                    </span>
                  )}
                </NbCard>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: Atur Budget */}
      <NbModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        title="Atur Budget Kategori"
      >
        <form onSubmit={handleBudgetSubmit} className="space-y-4">
          <NbSelect
            label="Kategori Pengeluaran"
            value={budgetCategory}
            onChange={(e) => setBudgetCategory(e.target.value)}
            options={[
              { value: 'Makan & Minum', label: 'Makan & Minum' },
              { value: 'Transport', label: 'Transport' },
              { value: 'Belanja', label: 'Belanja' },
              { value: 'Hiburan & Hobi', label: 'Hiburan & Hobi' },
              { value: 'Tagihan & Utilitas', label: 'Tagihan & Utilitas' },
              { value: 'Kesehatan', label: 'Kesehatan' },
              { value: 'Pendidikan', label: 'Pendidikan' },
              { value: 'Lainnya', label: 'Lainnya' },
            ]}
          />

          <NbInput
            label="Batas Maksimal Pengeluaran (Rp/Bulan)"
            type="number"
            value={budgetLimitStr}
            onChange={(e) => setBudgetLimitStr(e.target.value)}
            placeholder="Contoh: 1500000"
            required
          />

          {actionError && (
            <p className="text-xs font-bold text-[#FF3B30]">{actionError}</p>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <NbButton
              type="button"
              variant="neutral"
              onClick={() => setIsBudgetModalOpen(false)}
            >
              Batal
            </NbButton>
            <NbButton type="submit" variant="primary">
              Simpan Budget
            </NbButton>
          </div>
        </form>
      </NbModal>

      {/* MODAL: Tambah Tagihan Rutin */}
      <NbModal
        isOpen={isBillModalOpen}
        onClose={() => setIsBillModalOpen(false)}
        title="Tambah Tagihan Rutin"
      >
        <form onSubmit={handleBillSubmit} className="space-y-4">
          <NbInput
            label="Nama / Kategori Tagihan"
            type="text"
            value={billCategory}
            onChange={(e) => setBillCategory(e.target.value)}
            placeholder="Contoh: Kos, Listrik PLN, WiFi Indihome, Spotify"
            required
          />

          <NbInput
            label="Nominal Tagihan (Rp)"
            type="number"
            value={billAmountStr}
            onChange={(e) => setBillAmountStr(e.target.value)}
            placeholder="Contoh: 500000"
            required
          />

          <NbInput
            label="Tanggal Jatuh Tempo Tiap Bulan (1 - 31)"
            type="number"
            min={1}
            max={31}
            value={billDueDay}
            onChange={(e) => setBillDueDay(Number(e.target.value))}
            required
          />

          <NbSelect
            label="Dompet Pembayaran Default"
            value={billWalletId}
            onChange={(e) => setBillWalletId(e.target.value)}
            options={wallets.map((w) => ({
              value: w.id,
              label: `${w.name} (Saldo: ${formatRupiah(w.balance)})`,
            }))}
          />

          {actionError && (
            <p className="text-xs font-bold text-[#FF3B30]">{actionError}</p>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <NbButton
              type="button"
              variant="neutral"
              onClick={() => setIsBillModalOpen(false)}
            >
              Batal
            </NbButton>
            <NbButton type="submit" variant="finance">
              Simpan Tagihan
            </NbButton>
          </div>
        </form>
      </NbModal>

      {/* MODAL: Bayar Tagihan Sekarang */}
      <NbModal
        isOpen={!!payingBill}
        onClose={() => setPayingBill(null)}
        title="Bayar Tagihan Sekarang"
      >
        {payingBill && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-yellow-50 border-2 border-[#0A0A0A]">
              <p className="text-xs font-bold text-gray-700">Tagihan:</p>
              <p className="text-base font-extrabold text-[#0A0A0A]">
                {payingBill.category}
              </p>
              <p className="text-sm font-mono font-black text-[#FF3B30] mt-1">
                Nominal: {formatRupiah(payingBill.limitAmount)}
              </p>
            </div>

            <NbSelect
              label="Pilih Dompet Sumber Pembayaran"
              value={payWalletId}
              onChange={(e) => setPayWalletId(e.target.value)}
              options={wallets.map((w) => ({
                value: w.id,
                label: `${w.name} (Saldo: ${formatRupiah(w.balance)})`,
              }))}
            />

            {actionError && (
              <p className="text-xs font-bold text-[#FF3B30]">{actionError}</p>
            )}

            <div className="flex gap-2 justify-end pt-2">
              <NbButton
                type="button"
                variant="neutral"
                onClick={() => setPayingBill(null)}
              >
                Batal
              </NbButton>
              <NbButton
                type="button"
                variant="warning"
                isLoading={isPaying}
                onClick={handleExecutePayBill}
                leftIcon={<IconBolt className="w-4 h-4 stroke-[3]" />}
              >
                Konfirmasi Bayar
              </NbButton>
            </div>
          </div>
        )}
      </NbModal>
    </div>
  );
};

