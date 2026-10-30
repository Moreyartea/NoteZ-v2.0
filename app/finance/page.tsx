import { AppShell } from '@/components/layout/AppShell';
import { NbCard } from '@/components/ui/NbCard';
import { NbButton } from '@/components/ui/NbButton';
import { NbBadge } from '@/components/ui/NbBadge';
import { IconWallet, IconPlus, IconArrowUpRight, IconArrowDownLeft } from '@tabler/icons-react';

export default function FinancePage() {
  return (
    <AppShell headerTitle="Keuangan">
      <div className="space-y-4">
        {/* Module Header Card */}
        <NbCard bgColor="#00E676" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <NbBadge variant="neutral" className="mb-2">
                Modul Keuangan
              </NbBadge>
              <h1 className="text-xl font-black text-[#0A0A0A]">
                Smart Finance Suite
              </h1>
              <p className="text-xs font-semibold text-gray-800 mt-1">
                Multi-Dompet, Transaksi, Anggaran, & Catatan Utang.
              </p>
            </div>
            <div className="p-2.5 rounded-2xl bg-white border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
              <IconWallet className="w-7 h-7 text-[#0A0A0A]" />
            </div>
          </div>
        </NbCard>

        {/* Action Buttons Preview */}
        <div className="grid grid-cols-2 gap-3">
          <NbButton
            variant="finance"
            className="w-full justify-start"
            leftIcon={<IconArrowDownLeft className="w-4 h-4 stroke-[3]" />}
          >
            Pemasukan
          </NbButton>
          <NbButton
            variant="danger"
            className="w-full justify-start"
            leftIcon={<IconArrowUpRight className="w-4 h-4 stroke-[3]" />}
          >
            Pengeluaran
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
            Halaman ini akan memuat 4 sub-tab: Transaksi harian, Multi-Dompet (Tunai, Bank, E-Wallet) dengan fitur Balance Adjustment, Anggaran & Tagihan Rutin, serta Catatan Utang & Piutang.
          </p>
        </NbCard>
      </div>
    </AppShell>
  );
}
