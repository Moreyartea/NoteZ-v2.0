import { db } from '@/app/lib/db';
import type {
  MediaItem,
  MediaType,
  MediaStatus,
  MediaTier,
  AiringDay,
} from '@/app/lib/types';

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
}

/**
 * Calculates Neo-Brutalism Tier based on Score (1.0 - 10.0)
 * PRD Section 4.2:
 * 9.0 - 10.0: S (Masterpiece)
 * 8.0 - 8.9:  A (Worth It)
 * 7.0 - 7.9:  B (Lumayan)
 * 5.0 - 6.9:  C (Biasa Aja)
 * < 5.0:      D (Skip / Buang Waktu)
 */
export function calculateTier(score: number): MediaTier {
  if (score >= 9.0) return 'S';
  if (score >= 8.0) return 'A';
  if (score >= 7.0) return 'B';
  if (score >= 5.0) return 'C';
  return 'D';
}

/**
 * mediaService - Tracker for Film, Anime, Series, Drakor, and Video
 */

export async function createMediaItem(data: {
  title: string;
  type: MediaType;
  status: MediaStatus;
  currentSeason?: number;
  currentEpisode?: number;
  totalEpisodes?: number | null;
  score?: number | null;
  reviewText?: string | null;
  hasSpoiler?: boolean;
  airingDay?: AiringDay | null;
  reminderEnabled?: boolean;
  posterUrl?: string | null;
  watchUrl?: string | null;
}): Promise<string> {
  const id = generateId();
  const now = new Date().toISOString();

  const score = data.score != null ? Number(data.score) : null;
  const tier = score != null ? calculateTier(score) : null;

  const newMedia: MediaItem = {
    id,
    title: data.title.trim(),
    type: data.type,
    status: data.status,
    currentSeason: data.currentSeason || 1,
    currentEpisode: data.currentEpisode || 0,
    totalEpisodes: data.totalEpisodes || null,
    score,
    tier,
    reviewText: data.reviewText?.trim() || null,
    hasSpoiler: data.hasSpoiler || false,
    airingDay: data.airingDay || null,
    reminderEnabled: data.reminderEnabled || false,
    posterUrl: data.posterUrl || null,
    watchUrl: data.watchUrl || null,
    createdAt: now,
    updatedAt: now,
  };

  await db.media_watchlist.add(newMedia);
  return id;
}

export async function incrementEpisode(id: string): Promise<void> {
  const media = await db.media_watchlist.get(id);
  if (!media) return;

  const nextEp = media.currentEpisode + 1;
  const hasReachedMax = media.totalEpisodes != null && nextEp >= media.totalEpisodes;

  const now = new Date().toISOString();
  await db.media_watchlist.update(id, {
    currentEpisode: nextEp,
    status: hasReachedMax ? 'completed' : media.status,
    updatedAt: now,
  });
}

export async function updateMediaItem(
  id: string,
  data: Partial<Omit<MediaItem, 'id' | 'createdAt'>>
): Promise<void> {
  const now = new Date().toISOString();

  let tier = data.tier;
  if (data.score !== undefined) {
    tier = data.score != null ? calculateTier(data.score) : null;
  }

  await db.media_watchlist.update(id, {
    ...data,
    tier,
    updatedAt: now,
  });
}

export async function deleteMediaItem(id: string): Promise<void> {
  await db.media_watchlist.delete(id);
}

