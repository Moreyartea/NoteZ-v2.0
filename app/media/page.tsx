import { AppShell } from '@/components/layout/AppShell';
import { NbCard } from '@/components/ui/NbCard';
import { NbButton } from '@/components/ui/NbButton';
import { NbBadge } from '@/components/ui/NbBadge';
import { IconMovie, IconPlus, IconSparkles } from '@tabler/icons-react';

export default function MediaPage() {
  return (
    <AppShell headerTitle="Tontonan">
      <div className="space-y-4">
        {/* Module Header Card */}
        <NbCard bgColor="#A855F7" className="p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <NbBadge variant="neutral" className="mb-2">
                Tracker Hiburan & Impian
              </NbBadge>
              <h1 className="text-xl font-black text-white">
                Media & Wishlist Tracker
              </h1>
              <p className="text-xs font-medium text-purple-100 mt-1">
                Lacak Film/Anime/Series dengan Tier S/A/B/C/D & Celengan Impian.
              </p>
            </div>
            <div className="p-2.5 rounded-2xl bg-[#FFE135] border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
              <IconMovie className="w-7 h-7 text-[#0A0A0A]" />
            </div>
          </div>
        </NbCard>

        {/* Tier Badges Showcase */}
        <NbCard className="p-3">
          <span className="text-xs font-bold text-gray-700 block mb-2">
            Sistem Rating Tier Brutalism:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <NbBadge tier="S">S-TIER (Masterpiece)</NbBadge>
            <NbBadge tier="A">A-TIER (Worth It)</NbBadge>
            <NbBadge tier="B">B-TIER (Lumayan)</NbBadge>
            <NbBadge tier="C">C-TIER (Biasa)</NbBadge>
            <NbBadge tier="D">D-TIER (Skip)</NbBadge>
          </div>
        </NbCard>

        {/* Action Button Preview */}
        <div className="grid grid-cols-2 gap-3">
          <NbButton
            variant="media"
            className="w-full justify-start"
            leftIcon={<IconPlus className="w-4 h-4 stroke-[3]" />}
          >
            + Tontonan
          </NbButton>
          <NbButton
            variant="wishlist"
            className="w-full justify-start"
            leftIcon={<IconSparkles className="w-4 h-4 stroke-[2.5]" />}
          >
            + Wishlist
          </NbButton>
        </div>

        {/* Placeholder Info */}
        <NbCard className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-sm text-[#0A0A0A]">
              Siap untuk Tahap Berikutnya
            </h2>
            <NbBadge variant="secondary">Tahap 4</NbBadge>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Halaman ini akan memuat 2 sub-tab: Media & Watchlist (Anime/Film/Series dengan tombol cepat +1 Ep, sensor spoiler, dan rating tier) serta Wishlist & Celengan Impian dengan estimasi hari tercapai.
          </p>
        </NbCard>
      </div>
    </AppShell>
  );
}
