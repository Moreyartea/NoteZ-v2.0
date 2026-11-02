'use client';

import React, { useState, useEffect } from 'react';
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconArrowsExchange,
} from '@tabler/icons-react';
import type { Wallet, TransactionType } from '@/app/lib/types';
import { NbModal } from '@/components/ui/NbModal';
import { NbButton } from '@/components/ui/NbButton';
import { NbInput } from '@/components/ui/NbInput';
import { NbSelect } from '@/components/ui/NbSelect';
import { addTransaction } from '@/app/lib/services/financeService';
import { cn, formatCurrencyInput, parseCurrencyInput } from '@/app/lib/utils';

export interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallets: Wallet[];
  initialType?: TransactionType;
}

const expenseCategories = [
  'Makan & Minum',
  'Transport',
  'Belanja',
  'Tagihan & Utilitas',
  'Hiburan & Hobi',
  'Kesehatan',
  'Pendidikan',
  'Keluarga',
  'Lainnya',
];

const incomeCategories = [
  'Gaji',
  'Freelance',
  'Bisnis & Penjualan',
  'Investasi',
  'Hadiah & Bonus',
  'Pengembalian Dana',
  'Lainnya',
];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  wallets,
  initialType = 'expense',
}) => {
  const [type, setType] = useState<TransactionType>(initialType);
  const [amountStr, setAmountStr] = useState<string>('');
  const [walletId, setWalletId] = useState<string>('');
  const [toWalletId, setToWalletId] = useState<string>('');
  const [adminFeeStr, setAdminFeeStr] = useState<string>('0');
  const [category, setCategory] = useState<string>('Makan & Minum');
  const [title, setTitle] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [dateTime, setDateTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setAmountStr('');
      setCategory(initialType === 'income' ? 'Gaji' : 'Makan & Minum');
      setTitle('');
      setNote('');
      setAdminFeeStr('0');
      setErrorMessage('');

      // Set default wallet
      if (wallets.length > 0) {
        setWalletId(wallets[0].id);
        if (wallets.length > 1) {
          setToWalletId(wallets[1].id);
        }
      }

      // Default to current local time (YYYY-MM-DDTHH:mm)
      const now = new Date();
      const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setDateTime(localIso);
    }
  }, [isOpen, initialType, wallets]);

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'income') {
      setCategory('Gaji');
    } else if (newType === 'expense') {
      setCategory('Makan & Minum');
    } else {
      setCategory('Transfer');
    }
  };

  const handleAddAmount = (val: number) => {
    const current = parseCurrencyInput(amountStr);
    setAmountStr(formatCurrencyInput(current + val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseCurrencyInput(amountStr);
    if (!amount || amount <= 0) {
      setErrorMessage('Nominal wajib diisi dan harus lebih dari 0');
      return;
    }

    if (!walletId) {
      setErrorMessage('Pilih dompet terlebih dahulu');
      return;
    }

    if (type === 'transfer') {
      if (!toWalletId) {
        setErrorMessage('Pilih dompet tujuan transfer');
        return;
      }
      if (toWalletId === walletId) {
        setErrorMessage('Dompet tujuan tidak boleh sama dengan dompet asal');
        return;
      }
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const adminFee = parseCurrencyInput(adminFeeStr);
      const defaultTitle =
        title.trim() ||
        (type === 'transfer'
          ? `Transfer ke ${wallets.find((w) => w.id === toWalletId)?.name || 'Dompet'}`
          : category);

      await addTransaction({
        walletId,
        toWalletId: type === 'transfer' ? toWalletId : null,
        type,
        amount,
        adminFee: adminFee > 0 ? adminFee : null,
        category: type === 'transfer' ? 'Transfer' : category,
        title: defaultTitle,
        note: note.trim() || null,
        date: dateTime ? new Date(dateTime).toISOString() : new Date().toISOString(),
      });

      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Gagal menyimpan transaksi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NbModal
      isOpen={isOpen}
      onClose={onClose}
      title="Catat Transaksi"
      className="max-w-lg max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Selector (Segmented Tabs) */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#FFFDF7] dark:bg-[var(--theme-surface-elevated)] rounded-xl border-2 border-[#0A0A0A] dark:border-[var(--theme-border)]">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={cn(
              'py-2 px-1 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer',
              type === 'expense'
                ? 'bg-[#FF3B30] text-white border-2 border-[#0A0A0A] dark:border-white/30 shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000]'
                : 'text-gray-600 dark:text-[var(--theme-text-muted)] hover:text-[#0A0A0A] dark:hover:text-[var(--theme-text-primary)]'
            )}
          >
            <IconArrowDownRight className="w-3.5 h-3.5 stroke-[3]" />
            <span>Pengeluaran</span>
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={cn(
              'py-2 px-1 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer',
              type === 'income'
                ? 'bg-[#00E676] text-[#0A0A0A] border-2 border-[#0A0A0A] dark:border-white/30 shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000]'
                : 'text-gray-600 dark:text-[var(--theme-text-muted)] hover:text-[#0A0A0A] dark:hover:text-[var(--theme-text-primary)]'
            )}
          >
            <IconArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
            <span>Pemasukan</span>
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('transfer')}
            className={cn(
              'py-2 px-1 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer',
              type === 'transfer'
                ? 'bg-[#3B6FFF] text-white border-2 border-[#0A0A0A] dark:border-white/30 shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000]'
                : 'text-gray-600 dark:text-[var(--theme-text-muted)] hover:text-[#0A0A0A] dark:hover:text-[var(--theme-text-primary)]'
            )}
          >
            <IconArrowsExchange className="w-3.5 h-3.5 stroke-[3]" />
            <span>Transfer</span>
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <NbInput
            label="Nominal Transaksi (Rp)"
            type="text"
            inputMode="numeric"
            value={amountStr}
            onChange={(e) => setAmountStr(formatCurrencyInput(e.target.value))}
            placeholder="0"
            className="text-lg font-black font-mono"
            required
            autoFocus
          />
          {/* Quick shortcuts */}
          <div className="flex gap-1.5 mt-2">
            {[10000, 20000, 50000, 100000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => handleAddAmount(v)}
                className="flex-1 py-1 text-[11px] font-black bg-white dark:bg-[var(--theme-surface-elevated)] text-[#0A0A0A] dark:text-[var(--theme-text-primary)] rounded-md border-2 border-[#0A0A0A] dark:border-[var(--theme-border)] shadow-[1.5px_1.5px_0px_#0A0A0A] dark:shadow-[1.5px_1.5px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
              >
                +{v >= 1000 ? `${v / 1000}rb` : v}
              </button>
            ))}
          </div>
        </div>

        {/* Source Wallet */}
        <NbSelect
          label={type === 'transfer' ? 'Dari Dompet (Sumber)' : 'Dompet'}
          value={walletId}
          onChange={(e) => setWalletId(e.target.value)}
          options={wallets.map((w) => ({
            value: w.id,
            label: `${w.name} (Saldo: Rp ${w.balance.toLocaleString('id-ID')})`,
          }))}
          required
        />

        {/* Destination Wallet for Transfer */}
        {type === 'transfer' && (
          <>
            <NbSelect
              label="Ke Dompet (Tujuan)"
              value={toWalletId}
              onChange={(e) => setToWalletId(e.target.value)}
              options={wallets
                .filter((w) => w.id !== walletId)
                .map((w) => ({
                  value: w.id,
                  label: `${w.name} (Saldo: Rp ${w.balance.toLocaleString('id-ID')})`,
                }))}
              required
            />
            <NbInput
              label="Biaya Admin (Opsional)"
              type="text"
              inputMode="numeric"
              value={adminFeeStr}
              onChange={(e) => setAdminFeeStr(formatCurrencyInput(e.target.value))}
              placeholder="0"
            />
          </>
        )}

        {/* Category Chips (for Income / Expense) */}
        {type !== 'transfer' && (
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-[#0A0A0A] dark:text-[var(--theme-text-primary)] block mb-1.5">
              Kategori
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1.5 bg-[#FFFDF7] dark:bg-[var(--theme-surface-elevated)] rounded-xl border-2 border-[#0A0A0A] dark:border-[var(--theme-border)]">
              {(type === 'expense' ? expenseCategories : incomeCategories).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={cn(
                      'px-2.5 py-1 text-xs font-bold rounded-lg border-2 border-[#0A0A0A] dark:border-[var(--theme-border-subtle)] transition-all cursor-pointer',
                      category === cat
                        ? type === 'expense'
                          ? 'bg-[#FF3B30] text-white shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000]'
                          : 'bg-[#00E676] text-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000]'
                        : 'bg-white dark:bg-[var(--theme-surface)] text-gray-700 dark:text-[var(--theme-text-primary)] hover:bg-gray-100 dark:hover:bg-white/10'
                    )}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Title / Description */}
        <NbInput
          label="Judul / Keterangan Singkat"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={type === 'transfer' ? 'Transfer dana' : category}
        />

        {/* Date and Time */}
        <NbInput
          label="Waktu Transaksi"
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          required
        />

        {/* Note (Optional) */}
        <NbInput
          label="Catatan Tambahan (Opsional)"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Lokasi makan, nomor rekening, dll."
        />

        {errorMessage && (
          <p className="text-xs font-bold text-[#FF3B30] bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl border-2 border-[#FF3B30]">
            {errorMessage}
          </p>
        )}

        <div className="flex gap-2 justify-end pt-3 border-t-2 border-[#0A0A0A] dark:border-[var(--theme-border-subtle)]">
          <NbButton type="button" variant="neutral" onClick={onClose}>
            Batal
          </NbButton>
          <NbButton
            type="submit"
            variant={type === 'expense' ? 'danger' : type === 'income' ? 'finance' : 'secondary'}
            isLoading={isLoading}
          >
            Simpan Transaksi
          </NbButton>
        </div>
      </form>
    </NbModal>
  );
};
