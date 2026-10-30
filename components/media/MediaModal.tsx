'use client';

import React, { useState, useEffect } from 'react';
import type {
  MediaItem,
  MediaType,
  MediaStatus,
  AiringDay,
} from '@/app/lib/types';
import { NbModal } from '@/components/ui/NbModal';
import { NbButton } from '@/components/ui/NbButton';
import { NbInput } from '@/components/ui/NbInput';
import { NbSelect } from '@/components/ui/NbSelect';
import { NbBadge } from '@/components/ui/NbBadge';
import {
  createMediaItem,
  updateMediaItem,
  calculateTier,
} from '@/app/lib/services/mediaService';

export interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaToEdit?: MediaItem | null;
}

const airingDaysList: { value: AiringDay; label: string }[] = [
  { value: 'monday', label: 'Senin' },
  { value: 'tuesday', label: 'Selasa' },
  { value: 'wednesday', label: 'Rabu' },
  { value: 'thursday', label: 'Kamis' },
  { value: 'friday', label: 'Jumat' },
  { value: 'saturday', label: 'Sabtu' },
  { value: 'sunday', label: 'Minggu' },
];

export const MediaModal: React.FC<MediaModalProps> = ({
  isOpen,
  onClose,
  mediaToEdit,
}) => {
  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<MediaType>('anime');
  const [status, setStatus] = useState<MediaStatus>('watching');
  const [currentSeason, setCurrentSeason] = useState<number>(1);
  const [currentEpisode, setCurrentEpisode] = useState<number>(0);
  const [totalEpisodesStr, setTotalEpisodesStr] = useState<string>('');
  const [scoreStr, setScoreStr] = useState<string>('');
  const [reviewText, setReviewText] = useState<string>('');
  const [hasSpoiler, setHasSpoiler] = useState<boolean>(false);
  const [airingDay, setAiringDay] = useState<string>('');
  const [watchUrl, setWatchUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (mediaToEdit) {
        setTitle(mediaToEdit.title);
        setType(mediaToEdit.type);
        setStatus(mediaToEdit.status);
        setCurrentSeason(mediaToEdit.currentSeason || 1);
        setCurrentEpisode(mediaToEdit.currentEpisode || 0);
        setTotalEpisodesStr(
          mediaToEdit.totalEpisodes ? String(mediaToEdit.totalEpisodes) : ''
        );
        setScoreStr(mediaToEdit.score != null ? String(mediaToEdit.score) : '');
        setReviewText(mediaToEdit.reviewText || '');
        setHasSpoiler(mediaToEdit.hasSpoiler || false);
        setAiringDay(mediaToEdit.airingDay || '');
        setWatchUrl(mediaToEdit.watchUrl || '');
      } else {
        setTitle('');
        setType('anime');
        setStatus('watching');
        setCurrentSeason(1);
        setCurrentEpisode(0);
        setTotalEpisodesStr('');
        setScoreStr('');
        setReviewText('');
        setHasSpoiler(false);
        setAiringDay('');
        setWatchUrl('');
      }
      setErrorMsg('');
    }
  }, [isOpen, mediaToEdit]);

  // Real-time Tier Calculation
  const numericScore = scoreStr ? parseFloat(scoreStr) : null;
  const currentTier =
    numericScore != null && !isNaN(numericScore)
      ? calculateTier(numericScore)
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Judul tontonan wajib diisi');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const parsedTotal = totalEpisodesStr
        ? parseInt(totalEpisodesStr, 10)
        : null;
      const parsedScore = scoreStr ? parseFloat(scoreStr) : null;

      if (mediaToEdit) {
        await updateMediaItem(mediaToEdit.id, {
          title: title.trim(),
          type,
          status,
          currentSeason,
          currentEpisode,
          totalEpisodes: parsedTotal,
          score: parsedScore,
          reviewText: reviewText.trim() || null,
          hasSpoiler,
          airingDay: (airingDay as AiringDay) || null,
          watchUrl: watchUrl.trim() || null,
        });
      } else {
        await createMediaItem({
          title: title.trim(),
          type,
          status,
          currentSeason,
          currentEpisode,
          totalEpisodes: parsedTotal,
          score: parsedScore,
          reviewText: reviewText.trim() || null,
          hasSpoiler,
          airingDay: (airingDay as AiringDay) || null,
          watchUrl: watchUrl.trim() || null,
        });
      }

      onClose();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Gagal menyimpan tontonan'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NbModal
      isOpen={isOpen}
      onClose={onClose}
      title={mediaToEdit ? 'Edit Tontonan' : 'Tambah Tontonan Baru'}
      className="max-w-lg max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <NbInput
          label="Judul Judul Film / Anime / Series"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Frieren: Beyond Journey's End"
          required
          autoFocus
        />

        {/* Type & Status */}
        <div className="grid grid-cols-2 gap-2">
          <NbSelect
            label="Kategori / Tipe"
            value={type}
            onChange={(e) => setType(e.target.value as MediaType)}
            options={[
              { value: 'anime', label: '🎌 Anime' },
              { value: 'movie', label: '🎬 Film / Movie' },
              { value: 'series', label: '📺 Series / Drakor' },
              { value: 'video', label: '📹 Video / Dokumenter' },
            ]}
          />

          <NbSelect
            label="Status Menonton"
            value={status}
            onChange={(e) => setStatus(e.target.value as MediaStatus)}
            options={[
              { value: 'watching', label: '▶️ Sedang Nonton' },
              { value: 'plan_to_watch', label: '📋 Rencana Tonton' },
              { value: 'completed', label: '🏆 Selesai' },
              { value: 'on_hold', label: '⏸️ Ditunda' },
              { value: 'dropped', label: '🗑️ Ditinggalkan' },
            ]}
          />
        </div>

        {/* Season & Episodes */}
        <div className="grid grid-cols-3 gap-2">
          <NbInput
            label="Season"
            type="number"
            min={1}
            value={currentSeason}
            onChange={(e) => setCurrentSeason(Number(e.target.value))}
            required
          />

          <NbInput
            label="Episode Saat Ini"
            type="number"
            min={0}
            value={currentEpisode}
            onChange={(e) => setCurrentEpisode(Number(e.target.value))}
            required
          />

          <NbInput
            label="Total Episode"
            type="number"
            min={1}
            value={totalEpisodesStr}
            onChange={(e) => setTotalEpisodesStr(e.target.value)}
            placeholder="Misal: 28"
          />
        </div>

        {/* Score Rating & Real-time Tier Preview */}
        <div className="p-3 bg-yellow-50 rounded-xl border-2 border-[#0A0A0A] space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#0A0A0A]">
              Rating Skor (Skala 1.0 - 10.0)
            </label>
            {currentTier && (
              <NbBadge tier={currentTier}>
                {currentTier === 'S'
                  ? '👑 S-TIER (MASTERPIECE)'
                  : currentTier === 'A'
                  ? '🔥 A-TIER (WORTH IT)'
                  : currentTier === 'B'
                  ? '🍿 B-TIER (LUMAYAN)'
                  : currentTier === 'C'
                  ? '😐 C-TIER (BIASA)'
                  : '🗑️ D-TIER (SKIP)'}
              </NbBadge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              min="1.0"
              max="10.0"
              value={scoreStr}
              onChange={(e) => setScoreStr(e.target.value)}
              placeholder="Contoh: 9.2"
              className="w-full bg-white text-[#0A0A0A] font-mono font-bold text-sm rounded-lg border-2 border-[#0A0A0A] px-3 py-1.5 outline-none focus:shadow-[2px_2px_0px_#3B6FFF]"
            />
          </div>
          <p className="text-[10px] text-gray-600">
            ≥9.0 (S) • ≥8.0 (A) • ≥7.0 (B) • ≥5.0 (C) • &lt;5.0 (D)
          </p>
        </div>

        {/* Airing Day for Ongoing */}
        {status === 'watching' && (
          <NbSelect
            label="Jadwal Hari Tayang (Khusus On-Going)"
            value={airingDay}
            onChange={(e) => setAiringDay(e.target.value)}
            options={[
              { value: '', label: 'Tanpa Jadwal Rutin' },
              ...airingDaysList,
            ]}
          />
        )}

        {/* Review Text & Spoiler Checkbox */}
        <div className="space-y-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#0A0A0A]">
              Review / Catatan Pribadi (Opsional)
            </label>
            <textarea
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tulis kesan, adegan favorit, atau kritik..."
              className="w-full bg-white text-[#0A0A0A] font-medium text-xs rounded-xl border-[2.5px] border-[#0A0A0A] p-2.5 outline-none focus:shadow-[2px_2px_0px_#3B6FFF] resize-none"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-[#0A0A0A] cursor-pointer">
            <input
              type="checkbox"
              checked={hasSpoiler}
              onChange={(e) => setHasSpoiler(e.target.checked)}
              className="w-4 h-4 accent-[#FF6B2B] cursor-pointer"
            />
            <span>⚠️ Ulasan Ini Mengandung Spoiler (Akan Disensor/Blur)</span>
          </label>
        </div>

        {/* Watch URL */}
        <NbInput
          label="Link Platform Nonton (Opsional)"
          type="url"
          value={watchUrl}
          onChange={(e) => setWatchUrl(e.target.value)}
          placeholder="https://netflix.com/... atau bstation.tv/..."
        />

        {errorMsg && (
          <p className="text-xs font-bold text-[#FF3B30] bg-red-50 p-2 rounded-lg border border-[#FF3B30]">
            {errorMsg}
          </p>
        )}

        <div className="flex gap-2 justify-end pt-2 border-t-2 border-[#0A0A0A]">
          <NbButton type="button" variant="neutral" onClick={onClose}>
            Batal
          </NbButton>
          <NbButton type="submit" variant="media" isLoading={isLoading}>
            {mediaToEdit ? 'Simpan Perubahan' : 'Tambah Tontonan'}
          </NbButton>
        </div>
      </form>
    </NbModal>
  );
};
