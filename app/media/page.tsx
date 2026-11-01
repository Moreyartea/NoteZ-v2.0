'use client';

import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  IconMovie,
  IconPlus,
  IconStar,
  IconSearch,
  IconSparkles,
  IconDeviceTv,
  IconVideo,
} from '@tabler/icons-react';
import { db } from '@/app/lib/db';
import type { MediaItem } from '@/app/lib/types';
import { AppShell } from '@/components/layout/AppShell';
import { NbCard } from '@/components/ui/NbCard';
import { MediaCard } from '@/components/media/MediaCard';
import { MediaModal } from '@/components/media/MediaModal';
import { cn } from '@/app/lib/utils';

export default function MediaPage() {
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [activeType, setActiveType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [mediaToEdit, setMediaToEdit] = useState<MediaItem | null>(null);

  // Read media items reactively from Dexie
  const mediaList =
    useLiveQuery(async () => {
      if (typeof window === 'undefined') return [];
      const list = await db.media_watchlist.toArray();
      return list.sort(
        (a, b) =>
          new Date(b.updatedAt || '').getTime() -
          new Date(a.updatedAt || '').getTime()
      );
    }, []) || [];

  // Statistics calculation
  const totalItems = mediaList.length;
  const watchingCount = mediaList.filter((m) => m.status === 'watching').length;
  const completedCount = mediaList.filter(
    (m) => m.status === 'completed'
  ).length;

  const ratedItems = mediaList.filter((m) => m.score != null && m.score > 0);
  const avgScore =
    ratedItems.length > 0
      ? (
          ratedItems.reduce((acc, cur) => acc + (cur.score || 0), 0) /
          ratedItems.length
        ).toFixed(1)
      : null;

  // Filter items
  const filteredMedia = mediaList.filter((item) => {
    // Status check
    if (activeStatus === 'watching' && item.status !== 'watching') return false;
    if (activeStatus === 'plan_to_watch' && item.status !== 'plan_to_watch')
      return false;
    if (activeStatus === 'completed' && item.status !== 'completed')
      return false;
    if (
      activeStatus === 'other' &&
      item.status !== 'on_hold' &&
      item.status !== 'dropped'
    )
      return false;

    // Type check
    if (activeType !== 'all' && item.type !== activeType) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchReview = item.reviewText?.toLowerCase().includes(q);
      if (!matchTitle && !matchReview) return false;
    }

    return true;
  });

  const handleEdit = (item: MediaItem) => {
    setMediaToEdit(item);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setMediaToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <AppShell headerTitle="Tontonan">
      <div className="space-y-4">
        {/* HERO CARD: Statistik Tontonan */}
        <NbCard
          isHero={true}
          bgColor="#A855F7"
          className="p-4 text-white dark:bg-[var(--theme-surface)] dark:text-[var(--theme-text-primary)] dark:border-[var(--theme-border-hero)] space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#0A0A0A] bg-[#FFE135] px-2 py-0.5 rounded-md border-2 border-[#0A0A0A] shadow-[1.5px_1.5px_0px_#0A0A0A]">
              Media & Watchlist Tracker
            </span>
            {avgScore && (
              <span className="inline-flex items-center gap-1 text-xs font-mono font-black bg-white dark:bg-[var(--theme-surface-elevated)] text-[#0A0A0A] dark:text-[var(--theme-text-primary)] px-2 py-0.5 rounded-md border-2 border-[#0A0A0A] dark:border-[var(--theme-border-subtle)]">
                <IconStar className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>Rata-rata: {avgScore}</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-white dark:bg-[var(--theme-surface-elevated)] border-2 border-[#0A0A0A] dark:border-[var(--theme-border-subtle)] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000] p-2.5 rounded-xl text-center">
              <p className="text-[10px] font-black uppercase text-gray-700 dark:text-[var(--theme-text-muted)] tracking-wider">
                Total Judul
              </p>
              <p className="font-mono text-xl font-black text-[#0A0A0A] dark:text-[var(--theme-text-primary)] mt-1">
                {totalItems}
              </p>
            </div>

            <div className="bg-white dark:bg-[var(--theme-surface-elevated)] border-2 border-[#0A0A0A] dark:border-[var(--theme-border-subtle)] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000] p-2.5 rounded-xl text-center">
              <p className="text-[10px] font-black uppercase text-gray-700 dark:text-[var(--theme-text-muted)] tracking-wider">
                Sedang Nonton
              </p>
              <p className="font-mono text-xl font-black text-[#0A0A0A] dark:text-[var(--theme-text-primary)] mt-1">
                {watchingCount}
              </p>
            </div>

            <div className="bg-white dark:bg-[var(--theme-surface-elevated)] border-2 border-[#0A0A0A] dark:border-[var(--theme-border-subtle)] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000] p-2.5 rounded-xl text-center">
              <p className="text-[10px] font-black uppercase text-gray-700 dark:text-[var(--theme-text-muted)] tracking-wider">
                Tamat / Selesai
              </p>
              <p className="font-mono text-xl font-black text-[#0A0A0A] dark:text-[var(--theme-text-primary)] mt-1">
                {completedCount}
              </p>
            </div>
          </div>
        </NbCard>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul tontonan..."
            className="w-full bg-white dark:bg-[var(--theme-surface)] text-xs font-bold text-[#0A0A0A] dark:text-[var(--theme-text-primary)] rounded-xl border-[2.5px] border-[#0A0A0A] dark:border-[var(--theme-border)] pl-8 pr-3 py-2 outline-none focus:shadow-[2px_2px_0px_#3B6FFF]"
          />
          <IconSearch className="w-4 h-4 text-gray-500 dark:text-[var(--theme-text-muted)] absolute left-2.5 top-2.5 pointer-events-none" />
        </div>

        {/* Status Filter Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-white dark:bg-[var(--theme-surface)] rounded-xl border-2 border-[#0A0A0A] dark:border-[var(--theme-border)] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_var(--theme-shadow)]">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'watching', label: 'Nonton' },
            { id: 'plan_to_watch', label: 'Rencana' },
            { id: 'completed', label: 'Tamat' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveStatus(tab.id)}
              className={cn(
                'py-1.5 text-xs font-black rounded-lg transition-all text-center cursor-pointer',
                activeStatus === tab.id
                  ? 'bg-[#FFE135] dark:bg-[var(--theme-accent-primary)] text-[#0A0A0A] dark:text-[var(--theme-accent-text)] border-2 border-[#0A0A0A] dark:border-[var(--theme-border-hero)] shadow-[1.5px_1.5px_0px_#0A0A0A]'
                  : 'text-gray-600 dark:text-[var(--theme-text-muted)] hover:text-[#0A0A0A] dark:hover:text-[var(--theme-text-primary)]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Media Type Chips Filter (Colored Neo-Brutalism Icon Chips) */}
        <div className="flex gap-1.5 overflow-x-auto py-1 px-1 -mx-1 scrollbar-none">
          {[
            { id: 'all', label: 'Semua', icon: IconMovie, color: '#0A0A0A', bg: 'bg-white' },
            { id: 'anime', label: 'Anime', icon: IconSparkles, color: '#A855F7', bg: 'bg-purple-50' },
            { id: 'movie', label: 'Film', icon: IconMovie, color: '#3B6FFF', bg: 'bg-blue-50' },
            { id: 'series', label: 'Series', icon: IconDeviceTv, color: '#FF4DA6', bg: 'bg-pink-50' },
            { id: 'video', label: 'Video', icon: IconVideo, color: '#FF6B2B', bg: 'bg-orange-50' },
          ].map((t) => {
            const Icon = t.icon;
            const isSelected = activeType === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveType(t.id)}
                title={`Kategori ${t.label}`}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-black rounded-lg border-2 transition-all cursor-pointer whitespace-nowrap select-none',
                  isSelected
                    ? 'bg-[#0A0A0A] dark:bg-[var(--theme-accent-primary)] text-white dark:text-[var(--theme-accent-text)] border-[#0A0A0A] dark:border-[var(--theme-border-hero)] shadow-[2px_2px_0px_#0A0A0A]'
                    : 'bg-white dark:bg-[var(--theme-surface)] text-gray-800 dark:text-[var(--theme-text-primary)] border-[#0A0A0A] dark:border-[var(--theme-border-subtle)] shadow-[1.5px_1.5px_0px_#0A0A0A] dark:shadow-[1.5px_1.5px_0px_var(--theme-shadow)] active:translate-x-[1px] active:translate-y-[1px]'
                )}
              >
                <Icon
                  className="w-3.5 h-3.5 stroke-[2.5]"
                  style={{ color: isSelected ? 'inherit' : t.color }}
                />
                <span className="text-[11px]">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Media Items List */}
        {filteredMedia.length === 0 ? (
          <NbCard className="p-8 text-center text-gray-500 dark:text-[var(--theme-text-muted)]">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE135] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] flex items-center justify-center mx-auto mb-2">
              <IconMovie className="w-6 h-6 text-[#0A0A0A]" />
            </div>
            <p className="text-sm font-bold text-[#0A0A0A] dark:text-[var(--theme-text-primary)]">
              Belum ada tontonan
            </p>
            <p className="text-xs text-gray-500 dark:text-[var(--theme-text-muted)] mt-0.5">
              Tekan tombol "+ Tontonan" untuk mencatat Anime, Film, atau Series favoritmu.
            </p>
          </NbCard>
        ) : (
          <div className="space-y-3">
            {filteredMedia.map((media) => (
              <MediaCard
                key={media.id}
                media={media}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}

        {/* Floating Action Button (FAB) */}
        <div className="fixed bottom-20 right-4 z-30">
          <button
            type="button"
            onClick={handleCreateNew}
            aria-label="Tambah Tontonan"
            className="w-14 h-14 rounded-2xl bg-[#FFE135] dark:bg-[var(--theme-accent-primary)] text-[#0A0A0A] dark:text-[var(--theme-accent-text)] border-[3px] border-[#0A0A0A] dark:border-[var(--theme-border-hero)] shadow-[4px_4px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_var(--theme-shadow)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#0A0A0A] flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
          >
            <IconPlus className="w-8 h-8 stroke-[3]" />
          </button>
        </div>

        {/* Modal */}
        <MediaModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mediaToEdit={mediaToEdit}
        />
      </div>
    </AppShell>
  );
}
