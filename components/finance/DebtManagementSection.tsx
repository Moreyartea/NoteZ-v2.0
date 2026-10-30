'use client';

import React, { useState } from 'react';
import {
  IconPlus,
  IconCheck,
  IconCash,
  IconCalendar,
} from '@tabler/icons-react';
import type { Debt, DebtType, Wallet } from '@/app/lib/types';
import { NbCard } from '@/components/ui/NbCard';
import { NbButton } from '@/components/ui/NbButton';
import { NbBadge } from '@/components/ui/NbBadge';
import { NbModal } from '@/components/ui/NbModal';
import { NbInput } from '@/components/ui/NbInput';
import { NbSelect } from '@/components/ui/NbSelect';
import { addDebt, payDebtInstallment } from '@/app/lib/services/financeService';
import { formatRupiah, cn } from '@/app/lib/utils';

export interface DebtManagementSectionProps {
  debts: Debt[];
  wallets: Wallet[];
}

export const DebtManagementSection: React.FC<DebtManagementSectionProps> = ({
  debts,
  wallets,
}) => {
  const [activeTab, setActiveTab] = useState<DebtType>('receivable');

  // Modal: Catat Utang/Piutang Baru
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [personName, setPersonName] = useState<string>('');
  const [totalAmountStr, setTotalAmountStr] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [addError, setAddError] = useState<string>('');

  // Modal: Bayar Cicilan
  const [payingDebt, setPayingDebt] = useState<Debt | null>(null);
  const [payAmountStr, setPayAmountStr] = useState<string>('');
  const [payWalletId, setPayWalletId] = useState<string>(wallets[0]?.id || '');
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [payError, setPayError] = useState<string>('');

  const filteredDebts = debts.filter((d) => d.type === activeTab);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(totalAmountStr.replace(/[^0-9]/g, ''));
    if (!personName.trim()) {
      setAddError('Nama orang wajib diisi');
      return;
    }
    if (!amount || amount <= 0) {
      setAddError('Nominal pinjaman harus lebih dari 0');
      return;
    }

    setIsAdding(true);
    setAddError('');
    try {
      await addDebt({
        personName,
        type: activeTab,
        totalAmount: amount,
        dueDate: dueDate || null,
        notes: notes.trim() || null,
      });
      setIsAddOpen(false);
      setPersonName('');
      setTotalAmountStr('');
      setDueDate('');
      setNotes('');
    } catch (err: unknown) {
      setAddError(err instanceof Error ? err.message : 'Gagal menambahkan data');
    } finally {
      setIsAdding(false);
    }
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingDebt) return;
    const amount = Number(payAmountStr.replace(/[^0-9]/g, ''));
    if (!amount || amount <= 0) {
      setPayError('Nominal cicilan harus lebih dari 0');
      return;
    }

    setIsPaying(true);
    setPayError('');
    try {
      await payDebtInstallment(payingDebt.id, amount, payWalletId);
      setPayingDebt(null);
      setPayAmountStr('');
    } catch (err: unknown) {
      setPayError(err instanceof Error ? err.message : 'Gagal memproses pembayaran cicilan');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-[#0A0A0A] uppercase tracking-wide">
          Utang & Piutang
        </h2>
        <button
          type="button"
          onClick={() => {
            setIsAddOpen(true);
            setAddError('');
          }}
          className="inline-flex items-center gap-1 text-xs font-bold bg-[#FFE135] text-[#0A0A0A] px-2.5 py-1 rounded-lg border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
        >
          <IconPlus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Catat Baru</span>
        </button>
      </div>

      {/* Tabs Piutang vs Utang */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-white rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]">
        <button
          type="button"
          onClick={() => setActiveTab('receivable')}
          className={cn(
            'py-2 text-xs font-black rounded-lg transition-all text-center cursor-pointer',
            activeTab === 'receivable'
              ? 'bg-[#00E676] text-[#0A0A0A] border-2 border-[#0A0A0A] shadow-[1.5px_1.5px_0px_#0A0A0A]'
              : 'text-gray-600 hover:text-[#0A0A0A]'
          )}
        >
          📥 Piutang (Teman Pinjam)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('payable')}
          className={cn(
            'py-2 text-xs font-black rounded-lg transition-all text-center cursor-pointer',
            activeTab === 'payable'
              ? 'bg-[#FF6B2B] text-white border-2 border-[#0A0A0A] shadow-[1.5px_1.5px_0px_#0A0A0A]'
              : 'text-gray-600 hover:text-[#0A0A0A]'
          )}
        >
          📤 Utang (Saya Pinjam)
        </button>
      </div>

      {/* List items */}
      {filteredDebts.length === 0 ? (
        <NbCard className="p-5 text-center text-gray-500">
          <p className="text-xs font-bold text-[#0A0A0A]">
            Belum ada catatan {activeTab === 'receivable' ? 'piutang' : 'utang'}
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Tekan "+ Catat Baru" untuk mendokumentasikan pinjaman.
          </p>
        </NbCard>
      ) : (
        <div className="space-y-2.5">
          {filteredDebts.map((item) => {
            const remaining = item.totalAmount - item.paidAmount;
            const percent = Math.min(
              Math.round((item.paidAmount / item.totalAmount) * 100),
              100
            );

            return (
              <NbCard key={item.id} className="p-3.5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-black text-sm text-[#0A0A0A]">
                      {item.personName}
                    </h3>
                    <p className="text-xs font-mono font-bold text-gray-700 mt-0.5">
                      Sisa: {formatRupiah(remaining)}{' '}
                      <span className="text-[10px] text-gray-500 font-normal">
                        (Total: {formatRupiah(item.totalAmount)})
                      </span>
                    </p>
                  </div>
                  {item.isSettled ? (
                    <NbBadge variant="finance" icon={<IconCheck className="w-3 h-3" />}>
                      Lunas
                    </NbBadge>
                  ) : (
                    <NbBadge variant="warning">{percent}% Terbayar</NbBadge>
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 rounded-full bg-gray-200 border-2 border-[#0A0A0A] overflow-hidden p-0.5 shadow-inner">
                  <div
                    className="h-full rounded-full bg-[#00E676] transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {/* Due Date & Pay Button */}
                <div className="flex items-center justify-between pt-1">
                  {item.dueDate ? (
                    <span className="text-[10px] font-semibold text-gray-600 flex items-center gap-1">
                      <IconCalendar className="w-3 h-3 text-gray-400" />
                      Jatuh tempo: {item.dueDate}
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-400">Tanpa batas jatuh tempo</span>
                  )}

                  {!item.isSettled && (
                    <NbButton
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        setPayingDebt(item);
                        setPayAmountStr(String(remaining));
                        setPayWalletId(wallets[0]?.id || '');
                        setPayError('');
                      }}
                      leftIcon={<IconCash className="w-3.5 h-3.5" />}
                    >
                      {activeTab === 'receivable' ? 'Terima Cicilan' : 'Cicil / Lunasi'}
                    </NbButton>
                  )}
                </div>
              </NbCard>
            );
          })}
        </div>
      )}

      {/* MODAL: Tambah Catatan Utang / Piutang */}
      <NbModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title={activeTab === 'receivable' ? 'Catat Piutang (Teman Pinjam)' : 'Catat Utang (Saya Pinjam)'}
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <NbInput
            label="Nama Orang"
            type="text"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            placeholder="Contoh: Budi, Kakak, Teman Kantor"
            required
          />

          <NbInput
            label="Total Nominal Pinjaman (Rp)"
            type="number"
            value={totalAmountStr}
            onChange={(e) => setTotalAmountStr(e.target.value)}
            placeholder="Contoh: 250000"
            required
          />

          <NbInput
            label="Tanggal Jatuh Tempo (Opsional)"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <NbInput
            label="Catatan Tambahan (Opsional)"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Buat beli tiket konser"
          />

          {addError && (
            <p className="text-xs font-bold text-[#FF3B30]">{addError}</p>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <NbButton
              type="button"
              variant="neutral"
              onClick={() => setIsAddOpen(false)}
            >
              Batal
            </NbButton>
            <NbButton
              type="submit"
              variant={activeTab === 'receivable' ? 'finance' : 'warning'}
              isLoading={isAdding}
            >
              Simpan Data
            </NbButton>
          </div>
        </form>
      </NbModal>

      {/* MODAL: Bayar / Terima Cicilan */}
      <NbModal
        isOpen={!!payingDebt}
        onClose={() => setPayingDebt(null)}
        title={payingDebt?.type === 'receivable' ? 'Terima Cicilan Piutang' : 'Bayar Cicilan Utang'}
      >
        {payingDebt && (
          <form onSubmit={handlePaySubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-[#FFFDF7] border-2 border-[#0A0A0A]">
              <p className="text-xs text-gray-600 font-semibold">Nama:</p>
              <p className="text-sm font-extrabold text-[#0A0A0A]">
                {payingDebt.personName}
              </p>
              <p className="text-xs font-mono font-bold text-gray-700 mt-1">
                Sisa Pinjaman: {formatRupiah(payingDebt.totalAmount - payingDebt.paidAmount)}
              </p>
            </div>

            <NbInput
              label="Nominal Pembayaran (Rp)"
              type="number"
              value={payAmountStr}
              onChange={(e) => setPayAmountStr(e.target.value)}
              placeholder="0"
              required
            />

            <NbSelect
              label={
                payingDebt.type === 'receivable'
                  ? 'Masuk ke Saldo Dompet'
                  : 'Potong dari Saldo Dompet'
              }
              value={payWalletId}
              onChange={(e) => setPayWalletId(e.target.value)}
              options={wallets.map((w) => ({
                value: w.id,
                label: `${w.name} (Saldo: ${formatRupiah(w.balance)})`,
              }))}
              required
            />

            {payError && (
              <p className="text-xs font-bold text-[#FF3B30]">{payError}</p>
            )}

            <div className="flex gap-2 justify-end pt-2">
              <NbButton
                type="button"
                variant="neutral"
                onClick={() => setPayingDebt(null)}
              >
                Batal
              </NbButton>
              <NbButton
                type="submit"
                variant={payingDebt.type === 'receivable' ? 'finance' : 'warning'}
                isLoading={isPaying}
              >
                Konfirmasi Pembayaran
              </NbButton>
            </div>
          </form>
        )}
      </NbModal>
    </div>
  );
};
