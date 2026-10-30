'use client';

import React, { useState, useEffect } from 'react';
import type { WishlistItem, Wallet } from '@/app/lib/types';
import { NbModal } from '@/components/ui/NbModal';
import { NbButton } from '@/components/ui/NbButton';
import { NbInput } from '@/components/ui/NbInput';
import { NbSelect } from '@/components/ui/NbSelect';
import {
  depositToWishlist,
  withdrawFromWishlist,
} from '@/app/lib/services/wishlistService';
import { formatRupiah, cn } from '@/app/lib/utils';

export interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: WishlistItem | null;
  wallets: Wallet[];
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  wishlist,
  wallets,
}) => {
  const [actionType, setActionType] = useState<'deposit' | 'withdraw'>('deposit');
  const [amountStr, setAmountStr] = useState<string>('');
  const [walletId, setWalletId] = useState<string>('');
  const [deductWallet, setDeductWallet] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setActionType('deposit');
      setAmountStr('');
      setDeductWallet(true);
      setErrorMsg('');
      if (wallets.length > 0) {
        setWalletId(wallets[0].id);
      }
    }
  }, [isOpen, wallets]);

  if (!wishlist) return null;

  const handleQuickAdd = (val: number) => {
    const current = Number(amountStr.replace(/[^0-9]/g, '')) || 0;
    setAmountStr(String(current + val));
  };

  const handleFillRemaining = () => {
    const remaining = Math.max(0, wishlist.targetPrice - wishlist.savedAmount);
    setAmountStr(String(remaining));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(amountStr.replace(/[^0-9]/g, ''));
    if (!amount || amount <= 0) {
      setErrorMsg('Nominal harus lebih dari 0');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const selectedWallet = deductWallet && walletId ? walletId : null;

      if (actionType === 'deposit') {
        await depositToWishlist(wishlist.id, amount, selectedWallet);
      } else {
        await withdrawFromWishlist(wishlist.id, amount, selectedWallet);
      }

      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal memproses transaksi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NbModal
      isOpen={isOpen}
      onClose={onClose}
      title={actionType === 'deposit' ? 'Setor Tabungan Impian' : 'Tarik Dana Tabungan'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Wishlist summary info */}
        <div className="p-3 rounded-xl bg-pink-50 border-2 border-[#0A0A0A]">
          <p className="text-xs font-bold text-gray-700">Barang Impian:</p>
          <p className="text-sm font-extrabold text-[#0A0A0A]">{wishlist.name}</p>
          <p className="text-xs font-mono font-bold text-gray-700 mt-1">
            Terkumpul: {formatRupiah(wishlist.savedAmount)} / {formatRupiah(wishlist.targetPrice)}
          </p>
        </div>

        {/* Action Toggle (Deposit vs Withdraw) */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#FFFDF7] rounded-xl border-2 border-[#0A0A0A]">
          <button
            type="button"
            onClick={() => setActionType('deposit')}
            className={cn(
              'py-2 text-xs font-black rounded-lg transition-all text-center cursor-pointer',
              actionType === 'deposit'
                ? 'bg-[#FF4DA6] text-white border-2 border-[#0A0A0A] shadow-[1.5px_1.5px_0px_#0A0A0A]'
                : 'text-gray-600 hover:text-[#0A0A0A]'
            )}
          >
            ➕ Setor Tabungan
          </button>
          <button
            type="button"
            onClick={() => setActionType('withdraw')}
            className={cn(
              'py-2 text-xs font-black rounded-lg transition-all text-center cursor-pointer',
              actionType === 'withdraw'
                ? 'bg-[#FF6B2B] text-white border-2 border-[#0A0A0A] shadow-[1.5px_1.5px_0px_#0A0A0A]'
                : 'text-gray-600 hover:text-[#0A0A0A]'
            )}
          >
            ➖ Tarik Dana
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <NbInput
            label={actionType === 'deposit' ? 'Nominal Menabung (Rp)' : 'Nominal Penarikan (Rp)'}
            type="number"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            placeholder="0"
            className="text-base font-black font-mono"
            required
            autoFocus
          />

          {/* Quick Shortcuts */}
          <div className="flex gap-1.5 mt-2">
            {[20000, 50000, 100000, 500000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => handleQuickAdd(v)}
                className="flex-1 py-1 text-[10px] font-black bg-white rounded-md border-2 border-[#0A0A0A] shadow-[1px_1px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
              >
                +{v / 1000}rb
              </button>
            ))}
          </div>

          {actionType === 'deposit' && wishlist.savedAmount < wishlist.targetPrice && (
            <button
              type="button"
              onClick={handleFillRemaining}
              className="w-full mt-1.5 py-1 text-xs font-black bg-yellow-100 rounded-md border border-[#0A0A0A] hover:bg-yellow-200 transition-all cursor-pointer"
            >
              ⚡ Lunaskan Sisa Target ({formatRupiah(wishlist.targetPrice - wishlist.savedAmount)})
            </button>
          )}
        </div>

        {/* Direct Wallet Link Checkbox */}
        <div className="space-y-2 pt-1 border-t border-gray-200">
          <label className="flex items-center gap-2 text-xs font-bold text-[#0A0A0A] cursor-pointer">
            <input
              type="checkbox"
              checked={deductWallet}
              onChange={(e) => setDeductWallet(e.target.checked)}
              className="w-4 h-4 accent-[#FF4DA6] cursor-pointer"
            />
            <span>
              {actionType === 'deposit'
                ? 'Potong langsung dari Saldo Dompet'
                : 'Masukkan kembali ke Saldo Dompet'}
            </span>
          </label>

          {deductWallet && wallets.length > 0 && (
            <NbSelect
              label="Pilih Dompet Terkait"
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              options={wallets.map((w) => ({
                value: w.id,
                label: `${w.name} (Saldo: ${formatRupiah(w.balance)})`,
              }))}
            />
          )}
        </div>

        {errorMsg && (
          <p className="text-xs font-bold text-[#FF3B30] bg-red-50 p-2 rounded-lg border border-[#FF3B30]">
            {errorMsg}
          </p>
        )}

        <div className="flex gap-2 justify-end pt-2 border-t-2 border-[#0A0A0A]">
          <NbButton type="button" variant="neutral" onClick={onClose}>
            Batal
          </NbButton>
          <NbButton
            type="submit"
            variant={actionType === 'deposit' ? 'wishlist' : 'warning'}
            isLoading={isLoading}
          >
            {actionType === 'deposit' ? 'Konfirmasi Nabung' : 'Konfirmasi Tarik'}
          </NbButton>
        </div>
      </form>
    </NbModal>
  );
};

