'use client';

import React, { useState } from 'react';
import {
  IconMovie,
  IconPlus,
  IconStar,
  IconCalendar,
  IconEye,
  IconEyeOff,
  IconTrash,
  IconEdit,
  IconExternalLink,
  IconSparkles,
  IconDeviceTv,
  IconVideo,
} from '@tabler/icons-react';
import type { MediaItem, MediaType, MediaStatus } from '@/app/lib/types';
import { NbCard } from '@/components/ui/NbCard';
import { NbBadge } from '@/components/ui/NbBadge';
import { incrementEpisode, deleteMediaItem } from '@/app/lib/services/mediaService';
import { cn } from '@/app/lib/utils';

export interface MediaCardProps {
  media: MediaItem;
  onEdit: (item: MediaItem) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ media, onEdit }) => {
  const [showSpoiler, setShowSpoiler] = useState<boolean>(false);
  const [isIncrementing, setIsIncrementing] = useState<boolean>(false);

  const handleIncrement = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsIncrementing(true);
    try {
      await incrementEpisode(media.id);
    } finally {
      setIsIncrementing(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Hapus "${media.title}" dari daftar tontonan?`)) {
      await deleteMediaItem(media.id);
    }
  };

  const getTypeBadge = (type: MediaType) => {
    switch (type) {
      case 'anime':
        return {
          label: 'Anime',
          icon: IconSparkles,
          className: 'bg-purple-100 text-purple-900 border-[#A855F7]',
        };
      case 'movie':
        return {
          label: 'Film',
          icon: IconMovie,
          className: 'bg-blue-100 text-blue-900 border-[#3B6FFF]',
        };
      case 'series':
        return {
          label: 'Series',
          icon: IconDeviceTv,
          className: 'bg-pink-100 text-pink-900 border-[#FF4DA6]',
        };
      case 'video':
        return {
          label: 'Video',
          icon: IconVideo,
          className: 'bg-orange-100 text-orange-900 border-[#FF6B2B]',
        };
    }
  };

  const getStatusBadgeVariant = (status: MediaStatus) => {
    switch (status) {
      case 'watching':
        return 'primary' as const;
      case 'completed':
        return 'finance' as const;
      case 'plan_to_watch':
        return 'secondary' as const;
      case 'on_hold':
        return 'warning' as const;
      case 'dropped':
      default:
        return 'danger' as const;
    }
  };

  const getStatusLabel = (status: MediaStatus) => {
    switch (status) {
      case 'watching':
        return 'Sedang Nonton';
      case 'completed':
        return 'Selesai';
      case 'plan_to_watch':
        return 'Rencana';
      case 'on_hold':
        return 'Ditunda';
      case 'dropped':
        return 'Ditinggalkan';
    }
  };

  const typeInfo = getTypeBadge(media.type);
  const TypeIcon = typeInfo.icon;

  return (
    <NbCard className="p-4 space-y-3 relative overflow-hidden">
      {/* Top Badges */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={cn(
              'text-[10px] font-black uppercase px-2 py-0.5 rounded border inline-flex items-center gap-1 shadow-[1px_1px_0px_#0A0A0A]',
              typeInfo.className
            )}
          >
            <TypeIcon className="w-3 h-3 stroke-[2.5]" />
            <span>{typeInfo.label}</span>
          </span>
          <NbBadge variant={getStatusBadgeVariant(media.status)}>
            {getStatusLabel(media.status)}
          </NbBadge>
        </div>

        {/* Tier Badge (if rated) */}
        {media.tier && (
          <NbBadge tier={media.tier} className="text-xs font-black">
            {media.tier}-TIER
          </NbBadge>
        )}
      </div>

      {/* Title */}
      <div>
        <h3 className="font-black text-base text-[#0A0A0A] leading-tight break-words">
          {media.title}
        </h3>
        {media.airingDay && media.status === 'watching' && (
          <p className="text-[11px] font-bold text-purple-700 flex items-center gap-1 mt-1">
            <IconCalendar className="w-3.5 h-3.5" />
            <span>Tayang tiap {media.airingDay}</span>
          </p>
        )}
      </div>

      {/* Episode Progress & +1 Ep Button */}
      <div className="p-3 rounded-xl bg-[#FFFDF7] border-2 border-[#0A0A0A] flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-gray-500 uppercase leading-none block">
            Progress Episode
          </span>
          <p className="text-sm font-black font-mono text-[#0A0A0A] mt-0.5">
            Season {media.currentSeason} • Ep {media.currentEpisode}
            {media.totalEpisodes ? ` / ${media.totalEpisodes}` : ''}
          </p>
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={isIncrementing || (media.totalEpisodes != null && media.currentEpisode >= media.totalEpisodes)}
          className={cn(
            'px-3 py-1.5 bg-[#FFE135] text-[#0A0A0A] text-xs font-black rounded-lg border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1 cursor-pointer select-none',
            media.totalEpisodes != null && media.currentEpisode >= media.totalEpisodes && 'opacity-50 cursor-not-allowed shadow-none'
          )}
        >
          <IconPlus className="w-3.5 h-3.5 stroke-[3]" />
          <span>+1 Ep</span>
        </button>
      </div>

      {/* Score Rating Display */}
      {media.score != null && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-mono font-black text-[#0A0A0A] bg-amber-100 px-2 py-0.5 rounded border border-amber-400">
            <IconStar className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{media.score.toFixed(1)} / 10</span>
          </span>
        </div>
      )}

      {/* Review Text with Spoiler Blur Sensor */}
      {media.reviewText && (
        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-300 relative text-xs">
          {media.hasSpoiler && !showSpoiler ? (
            <div
              onClick={() => setShowSpoiler(true)}
              className="py-2 text-center cursor-pointer select-none"
            >
              <p className="font-extrabold text-[#FF6B2B] flex items-center justify-center gap-1">
                <IconEyeOff className="w-4 h-4" />
                <span>Ulasan Mengandung Spoiler</span>
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Klik untuk menampilkan review
              </p>
            </div>
          ) : (
            <div className="relative">
              {media.hasSpoiler && (
                <div className="flex items-center justify-between mb-1 pb-1 border-b border-gray-200">
                  <span className="text-[10px] font-bold text-[#FF6B2B]">
                    Spoiler Terbuka
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSpoiler(false)}
                    className="text-[10px] font-semibold text-gray-500 hover:text-black flex items-center gap-0.5"
                  >
                    <IconEye className="w-3 h-3" />
                    <span>Sembunyikan</span>
                  </button>
                </div>
              )}
              <p className="text-gray-700 italic leading-relaxed">
                "{media.reviewText}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-200">
        <div className="flex items-center gap-2">
          {media.watchUrl && (
            <a
              href={media.watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-[#3B6FFF] hover:underline inline-flex items-center gap-0.5"
            >
              <span>Link Nonton</span>
              <IconExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(media)}
            className="p-1.5 text-gray-500 hover:text-black transition-all cursor-pointer"
            title="Edit"
          >
            <IconEdit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="p-1.5 text-gray-500 hover:text-red-600 transition-all cursor-pointer"
            title="Hapus"
          >
            <IconTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </NbCard>
  );
};

