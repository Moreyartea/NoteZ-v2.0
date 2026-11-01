'use client';

import React, { useState } from 'react';
import {
  IconWallet,
  IconBuildingBank,
  IconCash,
  IconScale,
  IconPlus,
} from '@tabler/icons-react';
import type { Wallet, WalletType } from '@/app/lib/types';
import { NbButton } from '@/components/ui/NbButton';
import { NbModal } from '@/components/ui/NbModal';
import { NbInput } from '@/components/ui/NbInput';
import { NbSelect } from '@/components/ui/NbSelect';
import { createWallet, updateWalletBalance } from '@/app/lib/services/financeService';
import { formatRupiah } from '@/app/lib/utils';

export interface WalletCardListProps {
  wallets: Wallet[];
}

export const WalletCardList: React.FC<WalletCardListProps> = ({ wallets }) => {
  // Adjustment Modal State
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [actualBalanceInput, setActualBalanceInput] = useState<string>('');
  const [adjustReason, setAdjustReason] = useState<string>('');
  const [isAdjusting, setIsAdjusting] = useState<boolean>(false);
  const [adjustError, setAdjustError] = useState<string>('');

  // Create Wallet Modal State
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [newWalletName, setNewWalletName] = useState<string>('');
  const [newWalletType, setNewWalletType] = useState<WalletType>('bank');
  const [newWalletBalance, setNewWalletBalance] = useState<string>('0');
  const [newWalletColor, setNewWalletColor] = useState<string>('#3B6FFF');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string>('');

  const openAdjustModal = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setActualBalanceInput(wallet.balance.toString());
    setAdjustReason('');
    setAdjustError('');
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWallet) return;

    const parsed = Number(actualBalanceInput.replace(/[^0-9.-]/g, ''));
    if (isNaN(parsed)) {
      setAdjustError('Nominal saldo tidak valid');
      return;
    }

    setIsAdjusting(true);
    setAdjustError('');
    try {
      await updateWalletBalance(selectedWallet.id, parsed, adjustReason);
      setSelectedWallet(null);
    } catch (err: unknown) {
      setAdjustError(err instanceof Error ? err.message : 'Gagal menyesuaikan saldo');
    } finally {
      setIsAdjusting(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalletName.trim()) {
      setCreateError('Nama dompet wajib diisi');
      return;
    }

    const parsedBalance = Number(newWalletBalance.replace(/[^0-9.-]/g, '')) || 0;
    setIsCreating(true);
    setCreateError('');
    try {
      await createWallet({
        name: newWalletName,
        type: newWalletType,
        balance: parsedBalance,
        color: newWalletColor,
      });
      setIsCreateOpen(false);
      setNewWalletName('');
      setNewWalletBalance('0');
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : 'Gagal membuat dompet baru');
    } finally {
      setIsCreating(false);
    }
  };

  const getWalletIcon = (type: WalletType) => {
    switch (type) {
      case 'cash':
        return <IconCash className="w-5 h-5 text-[#0A0A0A]" />;
      case 'bank':
        return <IconBuildingBank className="w-5 h-5 text-white" />;
      case 'ewallet':
      default:
        return <IconWallet className="w-5 h-5 text-white" />;
    }
  };

  const getWalletTypeLabel = (type: WalletType) => {
    switch (type) {
      case 'cash':
        return 'Tunai';
      case 'bank':
        return 'Bank';
      case 'ewallet':
        return 'E-Wallet';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-[#0A0A0A] dark:text-[var(--theme-text-primary)] uppercase tracking-wide">
          Dompet Saya ({wallets.length})
        </h2>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-1 text-xs font-bold bg-[#FFE135] text-[#0A0A0A] px-2.5 py-1 rounded-lg border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
        >
          <IconPlus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Tambah</span>
        </button>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x">
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            className="min-w-[235px] flex-shrink-0 snap-start"
          >
            <div
              style={{ backgroundColor: wallet.color || '#3B6FFF' }}
              className="min-w-[235px] p-3.5 flex flex-col justify-between gap-2.5 rounded-2xl border-[3px] border-[#0A0A0A] dark:border-[var(--theme-border)] shadow-[4px_4px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_var(--theme-shadow)] text-white relative"
            >
              {/* Baris 1 (Atas): Ikon dompet di kiri + Badge tipe dompet di kanan */}
              <div className="flex items-start justify-between">
                <div className="p-1.5 rounded-lg bg-black/20 border border-black/30 backdrop-blur-sm">
                  {getWalletIcon(wallet.type)}
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/25 px-2 py-0.5 rounded-full border border-black/30">
                  {getWalletTypeLabel(wallet.type)}
                </span>
              </div>

              {/* Baris 2 (Tengah): Nama dompet + Nominal Saldo Rupiah penuh satu baris */}
              <div className="my-0.5">
                <p className="text-xs font-extrabold truncate text-white/90">
                  {wallet.name}
                </p>
                <p className="font-mono text-lg font-black tracking-tight truncate mt-0.5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                  {formatRupiah(wallet.balance)}
                </p>
              </div>

              {/* Baris 3 (Footer Khusus di Bawah): Pembatas, Status Aktif, dan Tombol Sesuaikan */}
              <div className="pt-2 border-t border-black/20 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold opacity-85">
                  ● Aktif
                </span>
                <button
                  type="button"
                  onClick={() => openAdjustModal(wallet)}
                  className="px-2.5 py-1 rounded-lg border-2 border-[#0A0A0A] bg-white dark:bg-[var(--theme-surface)] text-[#0A0A0A] dark:text-[var(--theme-text-primary)] text-[10px] font-extrabold shadow-[1.5px_1.5px_0px_#0A0A0A] shrink-0 active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1 cursor-pointer transition-transform"
                  title="Sesuaikan Saldo"
                >
                  <IconScale className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Sesuaikan</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Sesuaikan Saldo */}
      <NbModal
        isOpen={!!selectedWallet}
        onClose={() => setSelectedWallet(null)}
        title="Sesuaikan Saldo Dompet"
      >
        {selectedWallet && (
          <form onSubmit={handleAdjustSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-[#FFFDF7] dark:bg-[var(--theme-surface)] border-2 border-[#0A0A0A] dark:border-[var(--theme-border)]">
              <p className="text-xs text-gray-600 dark:text-[var(--theme-text-muted)] font-semibold">Dompet Terpilih</p>
              <p className="text-sm font-extrabold text-[#0A0A0A] dark:text-[var(--theme-text-primary)]">
                {selectedWallet.name} ({getWalletTypeLabel(selectedWallet.type)})
              </p>
              <p className="text-xs text-gray-500 font-mono mt-1">
                Saldo tercatat saat ini: {formatRupiah(selectedWallet.balance)}
              </p>
            </div>

            <NbInput
              label="Saldo Uang Asli Saat Ini (Rp)"
              type="number"
              value={actualBalanceInput}
              onChange={(e) => setActualBalanceInput(e.target.value)}
              placeholder="Contoh: 150000"
              hint="Sistem otomatis membuat transaksi penyesuaian selisihnya."
              required
            />

            <NbInput
              label="Alasan Penyesuaian (Opsional)"
              type="text"
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              placeholder="Contoh: Selisih uang receh / lupa catat"
            />

            {adjustError && (
              <p className="text-xs font-bold text-[#FF3B30]">{adjustError}</p>
            )}

            <div className="flex gap-2 justify-end pt-2">
              <NbButton
                type="button"
                variant="neutral"
                onClick={() => setSelectedWallet(null)}
              >
                Batal
              </NbButton>
              <NbButton type="submit" variant="primary" isLoading={isAdjusting}>
                Simpan Penyesuaian
              </NbButton>
            </div>
          </form>
        )}
      </NbModal>

      {/* MODAL: Tambah Dompet Baru */}
      <NbModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Tambah Dompet Baru"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <NbInput
            label="Nama Dompet"
            type="text"
            value={newWalletName}
            onChange={(e) => setNewWalletName(e.target.value)}
            placeholder="Contoh: Dompet Saku, BCA Tabungan, GoPay"
            required
          />

          <NbSelect
            label="Kategori Dompet"
            value={newWalletType}
            onChange={(e) => setNewWalletType(e.target.value as WalletType)}
            options={[
              { value: 'cash', label: 'Tunai (Cash)' },
              { value: 'bank', label: 'Rekening Bank' },
              { value: 'ewallet', label: 'E-Wallet / Dompet Digital' },
            ]}
          />

          <NbInput
            label="Saldo Awal (Rp)"
            type="number"
            value={newWalletBalance}
            onChange={(e) => setNewWalletBalance(e.target.value)}
            placeholder="0"
          />

          <div>
            <label className="text-sm font-bold text-[#0A0A0A] block mb-1.5">
              Warna Kartu
            </label>
            <div className="flex gap-2">
              {['#00E676', '#3B6FFF', '#A855F7', '#FF6B2B', '#FF4DA6', '#1E1E1E'].map(
                (c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewWalletColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-8 h-8 rounded-lg border-2 border-[#0A0A0A] transition-all cursor-pointer ${
                      newWalletColor === c ? 'scale-110 shadow-[2px_2px_0px_#0A0A0A]' : 'opacity-70'
                    }`}
                  />
                )
              )}
            </div>
          </div>

          {createError && (
            <p className="text-xs font-bold text-[#FF3B30]">{createError}</p>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <NbButton
              type="button"
              variant="neutral"
              onClick={() => setIsCreateOpen(false)}
            >
              Batal
            </NbButton>
            <NbButton type="submit" variant="finance" isLoading={isCreating}>
              Buat Dompet
            </NbButton>
          </div>
        </form>
      </NbModal>
    </div>
  );
};
