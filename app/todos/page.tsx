import { AppShell } from '@/components/layout/AppShell';
import { NbCard } from '@/components/ui/NbCard';
import { NbButton } from '@/components/ui/NbButton';
import { NbBadge } from '@/components/ui/NbBadge';
import { IconChecklist, IconPlus, IconFlame, IconClock } from '@tabler/icons-react';

export default function TodosPage() {
  return (
    <AppShell headerTitle="Tugas & Habit">
      <div className="space-y-4">
        {/* Module Header Card */}
        <NbCard bgColor="#3B6FFF" className="p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <NbBadge variant="neutral" className="mb-2">
                Produktivitas
              </NbBadge>
              <h1 className="text-xl font-black text-white">
                Tugas & Habit Tracker
              </h1>
              <p className="text-xs font-medium text-blue-100 mt-1">
                Kelola checklist, fokus Pomodoro, dan pelacak kebiasaan harian.
              </p>
            </div>
            <div className="p-2.5 rounded-2xl bg-[#FFE135] border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
              <IconChecklist className="w-7 h-7 text-[#0A0A0A]" />
            </div>
          </div>
        </NbCard>

        {/* Action Buttons Preview */}
        <div className="grid grid-cols-2 gap-3">
          <NbButton
            variant="primary"
            className="w-full justify-start"
            leftIcon={<IconPlus className="w-4 h-4 stroke-[3]" />}
          >
            Tambah Tugas
          </NbButton>
          <NbButton
            variant="warning"
            className="w-full justify-start"
            leftIcon={<IconFlame className="w-4 h-4 stroke-[2.5]" />}
          >
            Tambah Habit
          </NbButton>
        </div>

        {/* Placeholder Info */}
        <NbCard className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-sm text-[#0A0A0A]">
              Siap untuk Tahap Berikutnya
            </h2>
            <NbBadge variant="secondary">Tahap 3</NbBadge>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Halaman ini akan memuat 2 sub-tab utama: Daftar Tugas (To-Do dengan sub-tasks, prioritas, deadline, dan Pomodoro Timer) serta Habit Tracker dengan streak harian & mini heatmap 30 hari.
          </p>
        </NbCard>
      </div>
    </AppShell>
  );
}
