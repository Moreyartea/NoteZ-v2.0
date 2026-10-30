import { AppShell } from '@/components/layout/AppShell';
import { NbCard } from '@/components/ui/NbCard';
import { NbButton } from '@/components/ui/NbButton';
import { NbBadge } from '@/components/ui/NbBadge';
import { IconNotes, IconPlus, IconPin, IconDeviceMobile } from '@tabler/icons-react';

export default function NotesPage() {
  return (
    <AppShell headerTitle="Catatan">
      <div className="space-y-4">
        {/* Module Header Card */}
        <NbCard bgColor="#FFE135" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <NbBadge variant="neutral" className="mb-2">
                Smart Notes
              </NbBadge>
              <h1 className="text-xl font-black text-[#0A0A0A]">
                Catatan Bebas & Cepat
              </h1>
              <p className="text-xs font-semibold text-gray-800 mt-1">
                Tulis ide, checklist belanja, foto materi, & pin ke Widget layar HP.
              </p>
            </div>
            <div className="p-2.5 rounded-2xl bg-white border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
              <IconNotes className="w-7 h-7 text-[#0A0A0A]" />
            </div>
          </div>
        </NbCard>

        {/* Action Button Preview */}
        <NbButton
          variant="primary"
          className="w-full"
          leftIcon={<IconPlus className="w-4 h-4 stroke-[3]" />}
        >
          Tulis Catatan Baru
        </NbButton>

        {/* Placeholder Info */}
        <NbCard className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-sm text-[#0A0A0A]">
              Siap untuk Tahap Berikutnya
            </h2>
            <NbBadge variant="secondary">Tahap 4</NbBadge>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Halaman ini akan memuat editor catatan teks kaya, checklist interaktif, lampiran foto dari galeri HP, pemilihan warna kartu, pin ke atas, dan integrasi ke Sticky Note Widget Layar HP.
          </p>
        </NbCard>
      </div>
    </AppShell>
  );
}
