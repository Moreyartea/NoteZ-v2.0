import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { NbCard } from '@/components/ui/NbCard';
import { NbButton } from '@/components/ui/NbButton';
import { NbBadge } from '@/components/ui/NbBadge';
import {
  IconWallet,
  IconChecklist,
  IconNotes,
  IconMovie,
  IconCoin,
  IconSettings,
  IconArrowRight,
} from '@tabler/icons-react';

export default function DashboardPage() {
  return (
    <AppShell headerTitle="Dashboard">
      <div className="space-y-4">
        {/* Welcome Banner */}
        <NbCard bgColor="#FFE135" className="p-4 space-y-1">
          <div className="flex items-center justify-between">
            <NbBadge variant="neutral" className="text-[10px]">
              100% Pure Offline
            </NbBadge>
            <span className="text-xs font-mono font-bold text-[#0A0A0A]">
              NoteZ v2.0
            </span>
          </div>
          <h1 className="text-xl font-black text-[#0A0A0A] pt-1">
            Halo, Pengguna! 👋
          </h1>
          <p className="text-xs font-semibold text-gray-800">
            Aplikasi produktivitas pribadi all-in-one cepat, aman, dan tanpa internet.
          </p>
        </NbCard>

        {/* 5 Core Feature Modules Navigation */}
        <div className="space-y-2">
          <h2 className="text-xs font-extrabold text-[#0A0A0A] uppercase tracking-wider">
            Modul Utama NoteZ
          </h2>

          <div className="grid grid-cols-2 gap-2.5">
            {/* 1. Keuangan */}
            <Link href="/finance" className="block">
              <NbCard hoverEffect className="p-3.5 h-full flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-2 bg-[#00E676] rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]">
                    <IconWallet className="w-5 h-5 text-[#0A0A0A]" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-xs text-[#0A0A0A]">Keuangan</h3>
                    <p className="text-[10px] text-gray-500">Multi-dompet</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 pt-1 border-t border-gray-100">
                  <span>Buka Modul</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </div>
              </NbCard>
            </Link>

            {/* 2. Tugas & Habit */}
            <Link href="/todos" className="block">
              <NbCard hoverEffect className="p-3.5 h-full flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-2 bg-[#3B6FFF] rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]">
                    <IconChecklist className="w-5 h-5 text-white" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-xs text-[#0A0A0A]">Tugas & Habit</h3>
                    <p className="text-[10px] text-gray-500">Checklist & streak</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 pt-1 border-t border-gray-100">
                  <span>Buka Modul</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </div>
              </NbCard>
            </Link>

            {/* 3. Catatan Pintar */}
            <Link href="/notes" className="block">
              <NbCard hoverEffect className="p-3.5 h-full flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-2 bg-[#FFE135] rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]">
                    <IconNotes className="w-5 h-5 text-[#0A0A0A]" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-xs text-[#0A0A0A]">Smart Notes</h3>
                    <p className="text-[10px] text-gray-500">Ide & checklist</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 pt-1 border-t border-gray-100">
                  <span>Buka Modul</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </div>
              </NbCard>
            </Link>

            {/* 4. Media Tracker */}
            <Link href="/media" className="block">
              <NbCard hoverEffect className="p-3.5 h-full flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-2 bg-[#A855F7] rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]">
                    <IconMovie className="w-5 h-5 text-white" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-xs text-[#0A0A0A]">Tontonan</h3>
                    <p className="text-[10px] text-gray-500">Anime & tier</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 pt-1 border-t border-gray-100">
                  <span>Buka Modul</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </div>
              </NbCard>
            </Link>
          </div>
        </div>

        {/* 5. Wishlist Banner */}
        <Link href="/wishlist" className="block">
          <NbCard bgColor="#FF4DA6" hoverEffect className="p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-white rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]">
                  <IconCoin className="w-6 h-6 text-[#FF4DA6]" />
                </span>
                <div>
                  <h3 className="font-black text-sm text-white">
                    Celengan & Wishlist Impian
                  </h3>
                  <p className="text-[11px] font-medium text-pink-100">
                    Alokasikan tabungan bertahap (sinking funds) untuk barang impianmu.
                  </p>
                </div>
              </div>
              <span className="p-1.5 rounded-lg bg-white/20 border border-white/40">
                <IconArrowRight className="w-4 h-4 text-white" />
              </span>
            </div>
          </NbCard>
        </Link>

        {/* System Settings Banner */}
        <Link href="/settings" className="block">
          <NbCard hoverEffect className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-gray-100 rounded-xl border border-gray-300">
                <IconSettings className="w-5 h-5 text-gray-700" />
              </span>
              <div>
                <h4 className="font-extrabold text-xs text-[#0A0A0A]">
                  Pengaturan & Cadangan Offline (.JSON)
                </h4>
                <p className="text-[10px] text-gray-500">
                  Atur jam notifikasi harian, export & restore data lokal.
                </p>
              </div>
            </div>
            <IconArrowRight className="w-4 h-4 text-gray-400" />
          </NbCard>
        </Link>
      </div>
    </AppShell>
  );
}
