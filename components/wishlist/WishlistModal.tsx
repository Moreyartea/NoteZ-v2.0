'use client';

import React, { useState, useEffect } from 'react';
import { IconStar, IconDeviceMobile } from '@tabler/icons-react';
import type { WishlistPriority } from '@/app/lib/types';
import { NbModal } from '@/components/ui/NbModal';
import { NbButton } from '@/components/ui/NbButton';
import { NbInput } from '@/components/ui/NbInput';
import { createWishlistItem } from '@/app/lib/services/wishlistService';
import { cn } from '@/app/lib/utils';

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

    const targetPrice = Number(targetPriceStr.replace(/[^0-9]/g, ''));
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
          type="number"
          value={targetPriceStr}
          onChange={(e) => setTargetPriceStr(e.target.value)}
          placeholder="Contoh: 12000000"
          className="text-base font-black font-mono"
          required
        />

        {/* Priority Stars */}
        <div>
          <label className="text-sm font-bold text-[#0A0A0A] block mb-1.5">
            Tingkat Prioritas Impian
          </label>
          <div className="flex gap-2">
            {([1, 2, 3, 4, 5] as WishlistPriority[]).map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setPriorityStars(star)}
                className={cn(
                  'w-10 h-10 rounded-xl border-2 border-[#0A0A0A] flex items-center justify-center transition-all cursor-pointer',
                  star <= priorityStars
                    ? 'bg-[#FFE135] shadow-[2px_2px_0px_#0A0A0A] scale-105'
                    : 'bg-white text-gray-300 hover:text-amber-300'
                )}
              >
                <IconStar
                  className={cn(
                    'w-5 h-5',
                    star <= priorityStars
                      ? 'fill-amber-500 text-[#0A0A0A]'
                      : 'fill-transparent text-gray-300'
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
        <label className="flex items-center justify-between p-3 rounded-xl bg-pink-50 border-2 border-[#0A0A0A] cursor-pointer">
          <div className="flex items-center gap-2">
            <IconDeviceMobile className="w-4 h-4 text-[#0A0A0A]" />
            <span className="text-xs font-bold text-[#0A0A0A]">
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
          <p className="text-xs font-bold text-[#FF3B30] bg-red-50 p-2 rounded-lg border border-[#FF3B30]">
            {errorMsg}
          </p>
        )}

        <div className="flex gap-2 justify-end pt-2 border-t-2 border-[#0A0A0A]">
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

