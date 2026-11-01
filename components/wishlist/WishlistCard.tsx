'use client';

import React from 'react';
import {
  IconStar,
  IconSparkles,
  IconDeviceMobile,
  IconTrash,
  IconExternalLink,
  IconCoin,
} from '@tabler/icons-react';
import type { WishlistItem } from '@/app/lib/types';
import { NbCard } from '@/components/ui/NbCard';
import { NbBadge } from '@/components/ui/NbBadge';
import { NbButton } from '@/components/ui/NbButton';
import {
  toggleWishlistWidget,
  deleteWishlistItem,
  calculateSavingsEstimate,
} from '@/app/lib/services/wishlistService';
import { formatRupiah, cn } from '@/app/lib/utils';

export interface WishlistCardProps {
  wishlist: WishlistItem;
  onOpenDeposit: (item: WishlistItem) => void;
}

export const WishlistCard: React.FC<WishlistCardProps> = ({
  wishlist,
  onOpenDeposit,
}) => {
  const percent = Math.min(
    Math.round((wishlist.savedAmount / wishlist.targetPrice) * 100),
    100
  );

  const { remainingAmount, summary } = calculateSavingsEstimate(
    wishlist.targetPrice,
    wishlist.savedAmount
  );

  const handleToggleWidget = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleWishlistWidget(wishlist.id);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Hapus impian "${wishlist.name}"? Dana yang tercatat di sini tidak akan otomatis kembali ke dompet jika belum ditarik.`
      )
    ) {
      await deleteWishlistItem(wishlist.id);
    }
  };

  return (
    <NbCard className="p-4 space-y-3 relative overflow-hidden">
      {/* Top Header: Priority Stars & Widget Pin */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <IconStar
              key={i}
              className={cn(
                'w-4 h-4',
                i < wishlist.priorityStars
                  ? 'fill-amber-400 text-amber-500'
                  : 'text-gray-300'
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {wishlist.isAchieved && (
            <NbBadge variant="finance" icon={<IconSparkles className="w-3.5 h-3.5" />}>
              TERCAPAI
            </NbBadge>
          )}

          <button
            type="button"
            onClick={handleToggleWidget}
            title={
              wishlist.showOnHomeWidget
                ? 'Tampil di Widget Showcase HP'
                : 'Pajang di Layar Depan HP'
            }
            className={cn(
              'p-1.5 rounded-lg border border-[#0A0A0A] dark:border-[var(--theme-border)] transition-all cursor-pointer',
              wishlist.showOnHomeWidget
                ? 'bg-[#FF4DA6] text-white shadow-[1px_1px_0px_#0A0A0A]'
                : 'bg-white dark:bg-[var(--theme-surface)] text-gray-500 dark:text-[var(--theme-text-muted)] hover:text-black dark:hover:text-white'
            )}
          >
            <IconDeviceMobile className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleDelete}
            title="Hapus impian"
            className="p-1.5 rounded-lg bg-white dark:bg-[var(--theme-surface)] border border-[#0A0A0A] dark:border-[var(--theme-border)] text-gray-400 dark:text-[var(--theme-text-muted)] hover:text-red-500 transition-all cursor-pointer"
          >
            <IconTrash className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Info */}
      <div className="flex gap-3">
        {wishlist.imageUrl ? (
          <img
            src={wishlist.imageUrl}
            alt={wishlist.name}
            className="w-16 h-16 rounded-xl border-2 border-[#0A0A0A] dark:border-[var(--theme-border)] object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-pink-100 dark:bg-pink-950/40 border-2 border-[#0A0A0A] dark:border-[var(--theme-border)] flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_#0A0A0A]">
            <IconCoin className="w-8 h-8 text-[#FF4DA6]" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="font-black text-base text-[#0A0A0A] dark:text-[var(--theme-text-primary)] leading-snug truncate">
            {wishlist.name}
          </h3>
          <p className="font-mono text-sm font-extrabold text-[#00A854] mt-0.5">
            {formatRupiah(wishlist.savedAmount)}{' '}
            <span className="text-xs font-normal text-gray-500 dark:text-[var(--theme-text-muted)]">
              / {formatRupiah(wishlist.targetPrice)}
            </span>
          </p>

          {wishlist.storeUrl && (
            <a
              href={wishlist.storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-[#3B6FFF] hover:underline inline-flex items-center gap-0.5 mt-1"
            >
              <span>Lihat Toko</span>
              <IconExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Savings Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-bold text-[#0A0A0A]">
          <span>Terkumpul {percent}%</span>
          {remainingAmount > 0 ? (
            <span className="text-gray-500 font-mono text-[11px]">
              Sisa: {formatRupiah(remainingAmount)}
            </span>
          ) : (
            <span className="text-green-600 font-bold">100% Lunas!</span>
          )}
        </div>

        <div className="w-full h-3 rounded-full bg-gray-200 border-2 border-[#0A0A0A] overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full rounded-full bg-[#FF4DA6] transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>

        <p className="text-[10px] text-gray-600 font-semibold italic pt-0.5">
          {summary}
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-gray-200 flex justify-end">
        <NbButton
          size="sm"
          variant="wishlist"
          onClick={() => onOpenDeposit(wishlist)}
          leftIcon={<IconCoin className="w-4 h-4" />}
        >
          {wishlist.isAchieved ? 'Atur Tabungan' : 'Nabung'}
        </NbButton>
      </div>
    </NbCard>
  );
};

