'use client';

import React, { useState, useEffect } from 'react';
import { IconStar, IconDeviceMobile } from '@tabler/icons-react';
import type { WishlistPriority } from '@/app/lib/types';
import { NbModal } from '@/components/ui/NbModal';
import { NbButton } from '@/components/ui/NbButton';
import { NbInput } from '@/components/ui/NbInput';
import { createWishlistItem } from '@/app/lib/services/wishlistService';
import { formatCurrencyInput, parseCurrencyInput, cn } from '@/app/lib/utils';

export interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState<string>('');
  const [targetPriceStr, setTargetPriceStr] = useState<string>('');
  const [priorityStars, setPriorityStars] = useState<WishlistPriority>(3);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [storeUrl, setStoreUrl] = useState<string>('');
  const [showOnHomeWidget, setShowOnHomeWidget] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setTargetPriceStr('');
      setPriorityStars(3);
      setImageUrl('');
      setStoreUrl('');
      setShowOnHomeWidget(false);
      setErrorMsg('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Nama barang impian wajib diisi');
      return;
    }

    const targetPrice = parseCurrencyInput(targetPriceStr);
    if (!targetPrice || targetPrice <= 0) {
      setErrorMsg('Harga target harus lebih dari 0');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      await createWishlistItem({
        name: name.trim(),
        targetPrice,
        priorityStars,
        imageUrl: imageUrl.trim() || null,
        storeUrl: storeUrl.trim() || null,
        showOnHomeWidget,
      });

      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal membuat wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NbModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Barang Impian"
      className="max-w-lg max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <NbInput
          label="Nama Barang Impian"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: iPad Air M2, Sepatu Lari, Kamera"
          required
          autoFocus
        />

        {/* Target Price */}
        <NbInput
          label="Harga Target (Rp)"
          type="text"
          inputMode="numeric"
          value={targetPriceStr}
          onChange={(e) => setTargetPriceStr(formatCurrencyInput(e.target.value))}
          placeholder="Contoh: 12.000.000"
          className="text-base font-black font-mono"
          required
        />

        {/* Priority Stars */}
        <div>
          <label className="text-xs font-black uppercase tracking-wider text-[#0A0A0A] dark:text-[var(--theme-text-primary)] block mb-1.5">
            Tingkat Prioritas Impian
          </label>
          <div className="flex gap-2">
            {([1, 2, 3, 4, 5] as WishlistPriority[]).map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setPriorityStars(star)}
                className={cn(
                  'w-10 h-10 rounded-xl border-2 border-[#0A0A0A] dark:border-[var(--theme-border)] flex items-center justify-center transition-all cursor-pointer',
                  star <= priorityStars
                    ? 'bg-[#FFE135] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000] scale-105'
                    : 'bg-white dark:bg-[var(--theme-surface-elevated)] text-gray-300 dark:text-gray-600 hover:text-amber-300'
                )}
              >
                <IconStar
                  className={cn(
                    'w-5 h-5',
                    star <= priorityStars
                      ? 'fill-amber-500 text-[#0A0A0A]'
                      : 'fill-transparent text-gray-300 dark:text-gray-600'
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Image URL & Store URL */}
        <NbInput
          label="URL Foto Barang (Opsional)"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://images.unsplash.com/..."
        />

        <NbInput
          label="Link Toko / Marketplace (Opsional)"
          type="url"
          value={storeUrl}
          onChange={(e) => setStoreUrl(e.target.value)}
          placeholder="https://tokopedia.com/... atau shopee.co.id/..."
        />

        {/* Home Widget Toggle */}
        <label className="flex items-center justify-between p-3 rounded-xl bg-pink-50 dark:bg-pink-950/30 border-2 border-[#0A0A0A] dark:border-[var(--theme-border)] cursor-pointer">
          <div className="flex items-center gap-2">
            <IconDeviceMobile className="w-4 h-4 text-[#0A0A0A] dark:text-[var(--theme-text-primary)]" />
            <span className="text-xs font-bold text-[#0A0A0A] dark:text-[var(--theme-text-primary)]">
              Pajang di Widget Showcase Layar HP
            </span>
          </div>
          <input
            type="checkbox"
            checked={showOnHomeWidget}
            onChange={(e) => setShowOnHomeWidget(e.target.checked)}
            className="w-4 h-4 accent-[#FF4DA6] cursor-pointer"
          />
        </label>

        {errorMsg && (
          <p className="text-xs font-bold text-[#FF3B30] bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl border-2 border-[#FF3B30]">
            {errorMsg}
          </p>
        )}

        <div className="flex gap-2 justify-end pt-2 border-t-2 border-[#0A0A0A] dark:border-[var(--theme-border-subtle)]">
          <NbButton type="button" variant="neutral" onClick={onClose}>
            Batal
          </NbButton>
          <NbButton type="submit" variant="wishlist" isLoading={isLoading}>
            Simpan Impian
          </NbButton>
        </div>
      </form>
    </NbModal>
  );
};
