import { AppShell } from '@/components/layout/AppShell';
import { NbCard } from '@/components/ui/NbCard';
import { NbButton } from '@/components/ui/NbButton';
import { NbBadge } from '@/components/ui/NbBadge';
import { IconWallet, IconChecklist } from '@tabler/icons-react';

export default function DashboardPage() {
  return (
    <AppShell headerTitle="Dashboard">
      <div className="space-y-4">
        {/* Welcome Banner */}
        <NbCard bgColor="#FFE135" className="p-4">
          <div>
            <NbBadge variant="neutral" className="mb-2">
              Pure Offline Edition
            </NbBadge>
            <h1 className="text-xl font-black text-[#0A0A0A]">
              Halo, Pengguna! 👋
            </h1>
            <p className="text-xs font-semibold text-gray-800 mt-1">
              NoteZ v2.0 siap menemani produktivitas harianmu tanpa internet.
            </p>
          </div>
        </NbCard>

        {/* Quick Action Preview */}
        <div className="grid grid-cols-2 gap-3">
          <NbCard className="p-3 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 bg-[#00E676] rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]">
                <IconWallet className="w-4 h-4 text-[#0A0A0A]" />
              </span>
              <span className="font-extrabold text-xs">Keuangan</span>
            </div>
            <p className="text-[11px] text-gray-600 mb-3">Multi-dompet & transaksi</p>
            <NbButton size="sm" variant="finance" className="w-full">
              Lihat Saldo
            </NbButton>
          </NbCard>

          <NbCard className="p-3 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 bg-[#3B6FFF] rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]">
                <IconChecklist className="w-4 h-4 text-white" />
              </span>
              <span className="font-extrabold text-xs">Tugas & Habit</span>
            </div>
            <p className="text-[11px] text-gray-600 mb-3">Checklist & pelacak streak</p>
            <NbButton size="sm" variant="secondary" className="w-full">
              Cek Tugas
            </NbButton>
          </NbCard>
        </div>

        {/* Status Card */}
        <NbCard className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm">Status Fondasi Tahap 2</span>
            <NbBadge variant="finance">Aktif ⚡</NbBadge>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Sistem desain Neo-Brutalism, Live Device Clock anti-lag, AppShell, laci notifikasi Dexie, dan Bottom Navigation 5 tab telah terpasang dengan sukses.
          </p>
        </NbCard>
      </div>
    </AppShell>
  );
}
