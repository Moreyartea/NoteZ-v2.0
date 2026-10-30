'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  IconSettings,
  IconDownload,
  IconUpload,
  IconAlertTriangle,
  IconBell,
  IconClock,
  IconCheck,
} from '@tabler/icons-react';
import { db } from '@/app/lib/db';
import { AppShell } from '@/components/layout/AppShell';
import { NbCard } from '@/components/ui/NbCard';
import { NbButton } from '@/components/ui/NbButton';
import { NbInput } from '@/components/ui/NbInput';
import { NbModal } from '@/components/ui/NbModal';
import {
  exportAllDataToJson,
  importDataFromJson,
  resetEntireDatabase,
} from '@/app/lib/services/backupService';
import {
  scheduleDailyReviewNotification,
  requestNotificationPermission,
} from '@/app/lib/services/notificationService';

export default function SettingsPage() {
  const [dailyTime, setDailyTime] = useState<string>('20:00');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Read settings from Dexie
  const settings =
    useLiveQuery(async () => {
      if (typeof window === 'undefined') return null;
      return (await db.settings.get('default')) || null;
    }, []) || null;

  useEffect(() => {
    if (settings?.dailyReminderTime) {
      setDailyTime(settings.dailyReminderTime);
    }
  }, [settings]);

  const handleSaveReminderTime = async () => {
    try {
      const [h, m] = dailyTime.split(':').map((v) => parseInt(v, 10) || 0);
      await requestNotificationPermission();
      await scheduleDailyReviewNotification(h, m);

      await db.settings.update('default', {
        dailyReminderTime: dailyTime,
        updatedAt: new Date().toISOString(),
      });

      setFeedbackMsg({
        text: `Jam pengingat harian berhasil diatur ke ${dailyTime}`,
        type: 'success',
      });
    } catch (err: unknown) {
      setFeedbackMsg({
        text: err instanceof Error ? err.message : 'Gagal mengatur alarm',
        type: 'error',
      });
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setFeedbackMsg(null);
    try {
      const filename = await exportAllDataToJson();
      setFeedbackMsg({
        text: `Backup berhasil diunduh: ${filename}`,
        type: 'success',
      });
    } catch (err: unknown) {
      setFeedbackMsg({
        text: err instanceof Error ? err.message : 'Gagal mengekspor data',
        type: 'error',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !window.confirm(
        'Pulihkan data dari file ini? Seluruh data saat ini akan digantikan oleh isi file backup.'
      )
    ) {
      e.target.value = '';
      return;
    }

    setIsImporting(true);
    setFeedbackMsg(null);
    try {
      const text = await file.text();
      await importDataFromJson(text);
      setFeedbackMsg({
        text: 'Data berhasil dipulihkan dari file backup!',
        type: 'success',
      });
    } catch (err: unknown) {
      setFeedbackMsg({
        text: err instanceof Error ? err.message : 'Gagal memulihkan data',
        type: 'error',
      });
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
  };

  const handleReset = async () => {
    try {
      await resetEntireDatabase();
      setIsResetConfirmOpen(false);
      setFeedbackMsg({
        text: 'Database berhasil di-reset ke pengaturan awal pabrik!',
        type: 'success',
      });
    } catch (err: unknown) {
      setFeedbackMsg({
        text: err instanceof Error ? err.message : 'Gagal me-reset database',
        type: 'error',
      });
    }
  };

  return (
    <AppShell headerTitle="Pengaturan">
      <div className="space-y-4">
        {/* Header Banner */}
        <NbCard bgColor="#FFE135" className="p-4 space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-white rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]">
              <IconSettings className="w-5 h-5 text-[#0A0A0A]" />
            </span>
            <div>
              <h1 className="text-base font-black text-[#0A0A0A]">
                Pengaturan & Backup Offline
              </h1>
              <p className="text-xs font-semibold text-gray-800">
                Kontrol alarm pengingat, privasi, dan file data lokalmu.
              </p>
            </div>
          </div>
        </NbCard>

        {feedbackMsg && (
          <div
            className={`p-3 rounded-xl border-2 border-[#0A0A0A] text-xs font-extrabold flex items-center gap-2 ${
              feedbackMsg.type === 'success'
                ? 'bg-green-100 text-green-900'
                : 'bg-red-100 text-red-900'
            }`}
          >
            {feedbackMsg.type === 'success' ? (
              <IconCheck className="w-4 h-4 stroke-[3]" />
            ) : (
              <IconAlertTriangle className="w-4 h-4 stroke-[3]" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* 1. Pengaturan Notifikasi */}
        <NbCard className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <IconBell className="w-5 h-5 text-[#0A0A0A]" />
            <h2 className="text-sm font-extrabold text-[#0A0A0A] uppercase tracking-wide">
              Alarm Pengingat Malam
            </h2>
          </div>
          <p className="text-xs text-gray-600">
            Alarm sistem native Android akan berbunyi setiap hari untuk mengingatkanmu mencatat pengeluaran dan checklist habit.
          </p>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <NbInput
                label="Jam Pengingat Harian (Waktu Lokal HP)"
                type="time"
                value={dailyTime}
                onChange={(e) => setDailyTime(e.target.value)}
              />
            </div>
            <NbButton
              type="button"
              variant="primary"
              onClick={handleSaveReminderTime}
              className="flex-shrink-0"
            >
              Simpan Jam
            </NbButton>
          </div>
        </NbCard>

        {/* 2. Backup & Restore Offline */}
        <NbCard className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <IconDownload className="w-5 h-5 text-[#0A0A0A]" />
            <h2 className="text-sm font-extrabold text-[#0A0A0A] uppercase tracking-wide">
              Cadangan Data (.JSON)
            </h2>
          </div>
          <p className="text-xs text-gray-600">
            Seluruh data tersimpan 100% di HP. Unduh file cadangan secara berkala agar datamu aman saat ganti perangkat.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <NbButton
              variant="finance"
              onClick={handleExport}
              isLoading={isExporting}
              leftIcon={<IconDownload className="w-4 h-4" />}
            >
              Export JSON
            </NbButton>

            <NbButton
              variant="neutral"
              onClick={() => fileInputRef.current?.click()}
              isLoading={isImporting}
              leftIcon={<IconUpload className="w-4 h-4" />}
            >
              Import JSON
            </NbButton>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </NbCard>

        {/* 3. Zona Bahaya: Reset Database */}
        <NbCard className="p-4 space-y-3 border-[#FF3B30]">
          <div className="flex items-center gap-2 text-[#FF3B30]">
            <IconAlertTriangle className="w-5 h-5" />
            <h2 className="text-sm font-extrabold uppercase tracking-wide">
              Zona Bahaya
            </h2>
          </div>
          <p className="text-xs text-gray-600">
            Menghapus seluruh catatan, transaksi keuangan, kebiasaan, dan tontonan dari IndexedDB dan mengembalikan ke pengaturan default.
          </p>

          <NbButton
            variant="danger"
            onClick={() => setIsResetConfirmOpen(true)}
            className="w-full"
          >
            Reset Seluruh Data
          </NbButton>
        </NbCard>

        {/* Modal Konfirmasi Reset */}
        <NbModal
          isOpen={isResetConfirmOpen}
          onClose={() => setIsResetConfirmOpen(false)}
          title="Konfirmasi Reset Data"
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-red-50 border-2 border-[#FF3B30] text-xs font-bold text-red-800 space-y-1">
              <p>⚠️ PERINGATAN: Tindakan ini permanen!</p>
              <p>
                Semua data dompet, transaksi, tugas, habit, catatan, dan tontonan akan dihapus secara total.
              </p>
            </div>

            <p className="text-xs text-gray-700">
              Apakah kamu yakin ingin melanjutkan reset ke setelan pabrik?
            </p>

            <div className="flex gap-2 justify-end pt-2 border-t border-gray-200">
              <NbButton
                variant="neutral"
                onClick={() => setIsResetConfirmOpen(false)}
              >
                Batal
              </NbButton>
              <NbButton variant="danger" onClick={handleReset}>
                Ya, Hapus Semua Data
              </NbButton>
            </div>
          </div>
        </NbModal>
      </div>
    </AppShell>
  );
}

