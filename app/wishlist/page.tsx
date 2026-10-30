'use client';

import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  IconCoin,
  IconPlus,
  IconSparkles,
  IconTrophy,
} from '@tabler/icons-react';
import { db } from '@/app/lib/db';
import type { WishlistItem } from '@/app/lib/types';
import { AppShell } from '@/components/layout/AppShell';
import { NbCard } from '@/components/ui/NbCard';
import { WishlistCard } from '@/components/wishlist/WishlistCard';
import { WishlistModal } from '@/components/wishlist/WishlistModal';
import { DepositModal } from '@/components/wishlist/DepositModal';
import { formatRupiah, cn } from '@/app/lib/utils';

export default function WishlistPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'achieved'>('all');
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState<boolean>(false);
  const [selectedWishlistForDeposit, setSelectedWishlistForDeposit] = useState<WishlistItem | null>(null);

  // Reactive Dexie queries
  const wishlists =
    useLiveQuery(async () => {
      if (typeof window === 'undefined') return [];
      const list = await db.wishlists.toArray();
      return list.sort((a, b) => b.priorityStars - a.priorityStars);
    }, []) || [];

  const wallets =
    useLiveQuery(async () => {
      if (typeof window === 'undefined') return [];
      return await db.wallets.toArray();
    }, []) || [];

  // Summary Metrics
  const totalTarget = wishlists.reduce((acc, cur) => acc + cur.targetPrice, 0);
  const totalSaved = wishlists.reduce((acc, cur) => acc + cur.savedAmount, 0);
  const achievedCount = wishlists.filter((w) => w.isAchieved).length;

  const filtered = wishlists.filter((w) => {
    if (activeFilter === 'active') return !w.isAchieved;
    if (activeFilter === 'achieved') return w.isAchieved;
    return true;
  });

  return (
    <AppShell headerTitle="Wishlist">
      <div className="space-y-4">
        {/* HERO CARD: Celengan Impian */}
        <NbCard bgColor="#FF4DA6" className="p-4 text-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#0A0A0A] bg-[#FFE135] px-2 py-0.5 rounded-md border-2 border-[#0A0A0A] shadow-[1.5px_1.5px_0px_#0A0A0A]">
              Wishlist & Celengan Impian
            </span>
            <span className="text-xs font-bold text-pink-100 flex items-center gap-1">
              <IconTrophy className="w-3.5 h-3.5" />
              <span>{achievedCount} Tercapai</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/20">
              <p className="text-[10px] font-bold text-pink-200 uppercase leading-none">
                Total Terkumpul
              </p>
              <p className="text-base font-black font-mono text-white mt-1">
                {formatRupiah(totalSaved)}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/20">
              <p className="text-[10px] font-bold text-pink-200 uppercase leading-none">
                Target Keseluruhan
              </p>
              <p className="text-base font-black font-mono text-pink-100 mt-1">
                {formatRupiah(totalTarget)}
              </p>
            </div>
          </div>
        </NbCard>

        {/* Filter Switcher */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-white rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]">
          {[
            { id: 'all', label: `Semua (${wishlists.length})` },
            { id: 'active', label: '⏳ Menabung' },
            { id: 'achieved', label: '🎉 Tercapai' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as 'all' | 'active' | 'achieved')}
              className={cn(
                'py-1.5 text-xs font-black rounded-lg transition-all text-center cursor-pointer',
                activeFilter === tab.id
                  ? 'bg-[#FFE135] text-[#0A0A0A] border-2 border-[#0A0A0A] shadow-[1.5px_1.5px_0px_#0A0A0A]'
                  : 'text-gray-600 hover:text-[#0A0A0A]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Wishlist Items List */}
        {filtered.length === 0 ? (
          <NbCard className="p-8 text-center text-gray-500">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] flex items-center justify-center mx-auto mb-2">
              <IconCoin className="w-6 h-6 text-[#FF4DA6]" />
            </div>
            <p className="text-sm font-bold text-[#0A0A0A]">
              Belum ada target barang impian
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Tekan "+ Tambah Impian" untuk mulai mengalokasikan tabungan impianmu.
            </p>
          </NbCard>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <WishlistCard
                key={item.id}
                wishlist={item}
                onOpenDeposit={(w) => setSelectedWishlistForDeposit(w)}
              />
            ))}
          </div>
        )}

        {/* Floating Action Button (FAB) */}
        <div className="fixed bottom-20 right-4 z-30">
          <button
            type="button"
            onClick={() => setIsWishlistModalOpen(true)}
            aria-label="Tambah Impian"
            className="w-14 h-14 rounded-2xl bg-[#FFE135] text-[#0A0A0A] border-[3px] border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#0A0A0A] flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
          >
            <IconPlus className="w-8 h-8 stroke-[3]" />
          </button>
        </div>

        {/* Modals */}
        <WishlistModal
          isOpen={isWishlistModalOpen}
          onClose={() => setIsWishlistModalOpen(false)}
        />
        <DepositModal
          isOpen={!!selectedWishlistForDeposit}
          onClose={() => setSelectedWishlistForDeposit(null)}
          wishlist={selectedWishlistForDeposit}
          wallets={wallets}
        />
      </div>
    </AppShell>
  );
}

