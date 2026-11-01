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
  IconMoon,
  IconSun,
  IconTrash,
  IconDatabase,
  IconInfoCircle,
  IconPalette,
} from '@tabler/icons-react';
import { db } from '@/app/lib/db';
import type { AppThemeId } from '@/app/lib/types';
import { AppShell } from '@/components/layout/AppShell';
import { NbCard } from '@/components/ui/NbCard';
import { NbButton } from '@/components/ui/NbButton';
import { NbInput } from '@/components/ui/NbInput';
import { NbModal } from '@/components/ui/NbModal';
import { AppLogo } from '@/components/ui/AppLogo';
import {
  exportAllDataToJson,
  importDataFromJson,
  resetEntireDatabase,
} from '@/app/lib/services/backupService';
import {
  THEME_PRESETS,
  setTheme,
  setDarkMode,
  updateDailyReminderTime,
  triggerTestNotification,
} from '@/app/lib/services/settingsService';
import { cn } from '@/app/lib/utils';

export default function SettingsPage() {
  const [dailyTime, setDailyTime] = useState<string>('20:00');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isTestingNotif, setIsTestingNotif] = useState<boolean>(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);
  const [resetConfirmInput, setResetConfirmInput] = useState<string>('');
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

  const isDark = Boolean(settings?.isDarkMode);
  const currentThemeId: AppThemeId =
    (settings?.themeId as AppThemeId) ||
    (settings?.isDarkMode ? 'cyber-lime' : 'classic-brutal');

  useEffect(() => {
    if (settings?.dailyReminderTime) {
      setDailyTime(settings.dailyReminderTime);
    }
  }, [settings]);

  const handleToggleDarkMode = async () => {
    const nextMode = !isDark;
    await setDarkMode(nextMode);
  };

  const handleSelectTheme = async (themeId: AppThemeId) => {
    await setTheme(themeId);
  };

  const handleSaveReminderTime = async () => {
    try {
      await updateDailyReminderTime(dailyTime);
      setFeedbackMsg({
        text: `Jam pengingat harian berhasil diatur ke ${dailyTime}`,
        type: 'success',
      });
    } catch (err: unknown) {
      setFeedbackMsg({
        text: err instanceof Error ? err.message : 'Gagal mengatur alarm pengingat',
        type: 'error',
      });
    }
  };

  const handleTestNotification = async () => {
    setIsTestingNotif(true);
    try {
      await triggerTestNotification();
      setFeedbackMsg({
        text: 'Notifikasi uji coba berhasil dikirim! Periksa panel notifikasi HP & laci lonceng.',
        type: 'success',
      });
    } catch (err: unknown) {
      setFeedbackMsg({
        text: err instanceof Error ? err.message : 'Gagal mengirim notifikasi uji coba',
        type: 'error',
      });
    } finally {
      setIsTestingNotif(false);
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

  const handleResetExecute = async () => {
    if (resetConfirmInput !== 'HAPUS') return;

    try {
      await resetEntireDatabase();
      setIsResetConfirmOpen(false);
      setResetConfirmInput('');
      setFeedbackMsg({
        text: 'Database berhasil di-reset ke setelan awal pabrik!',
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
              <h1 className="text-base font-black text-[#0A0A0A] leading-tight">
                Pengaturan Sistem
              </h1>
              <p className="text-xs font-semibold text-gray-800">
                Kustomisasi tampilan, alarm pengingat, dan manajemen data offline.
              </p>
            </div>
          </div>
        </NbCard>

        {/* Feedback Alert Toast */}
        {feedbackMsg && (
          <div
            className={cn(
              'p-3 rounded-xl border-2 border-[#0A0A0A] text-xs font-extrabold flex items-center gap-2 shadow-[2px_2px_0px_#0A0A0A]',
              feedbackMsg.type === 'success'
                ? 'bg-green-100 text-green-900 border-green-800'
                : 'bg-red-100 text-red-900 border-red-800'
            )}
          >
            {feedbackMsg.type === 'success' ? (
              <IconCheck className="w-4 h-4 stroke-[3] text-green-800 flex-shrink-0" />
            ) : (
              <IconAlertTriangle className="w-4 h-4 stroke-[3] text-red-800 flex-shrink-0" />
            )}
            <span className="flex-1">{feedbackMsg.text}</span>
          </div>
        )}

        {/* GRUP 1: TAMPILAN & TEMA PRESET */}
        <NbCard className="p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <IconPalette className="w-5 h-5 text-[#FFE135] stroke-[2.5]" />
              <h2 className="text-sm font-black text-[#0A0A0A] dark:text-[#F4F4F0] uppercase tracking-wide">
                Tema & Suasana
              </h2>
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#0A0A0A] bg-[#FFE135] text-[#0A0A0A] shadow-[1px_1px_0px_#0A0A0A]">
              {THEME_PRESETS.find((p) => p.id === currentThemeId)?.name || 'Classic Brutal'}
            </span>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-300">
            Pilih dari 5 preset tema resmi NoteZ v2.0 bergaya Neo-Brutalism. Mode terang default mempertahankan palet gading klasik, sedangkan 4 mode gelap menghadirkan aksen neon elektrik dan true black hemat baterai.
          </p>

          {/* Quick Light/Dark Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[var(--theme-surface,#252525)] border-2 border-[#0A0A0A] dark:border-[var(--theme-border,#2E2E2E)]">
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  'w-8 h-8 rounded-lg border-2 border-[#0A0A0A] flex items-center justify-center font-bold text-xs shadow-[1.5px_1.5px_0px_#0A0A0A]',
                  isDark ? 'bg-[#1E1E1E] text-white' : 'bg-white text-[#0A0A0A]'
                )}
              >
                {isDark ? (
                  <IconMoon className="w-4 h-4 text-[#FFE135]" />
                ) : (
                  <IconSun className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <div>
                <p className="text-xs font-black text-[#0A0A0A] dark:text-[var(--theme-text-primary,#F4F4F0)]">
                  Mode Cepat: {isDark ? 'Gelap' : 'Terang'}
                </p>
                <p className="text-[10px] font-semibold text-gray-500 dark:text-[var(--theme-text-muted,#8E929E)]">
                  {isDark
                    ? 'Beralih ke preset Classic Brutal (Terang)'
                    : 'Beralih ke preset Gelap aktif'}
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={handleToggleDarkMode}
              className={cn(
                'w-14 h-8 rounded-full border-2 border-[#0A0A0A] p-1 transition-colors relative cursor-pointer select-none shadow-[2px_2px_0px_#0A0A0A]',
                isDark ? 'bg-[#FFE135] dark:bg-[var(--theme-accent-primary,#FFE135)]' : 'bg-gray-200'
              )}
              aria-label="Toggle tema gelap atau terang"
            >
              <div
                className={cn(
                  'w-5 h-5 rounded-full bg-[#0A0A0A] transition-transform flex items-center justify-center text-white',
                  isDark ? 'translate-x-6' : 'translate-x-0'
                )}
              >
                {isDark ? (
                  <IconMoon className="w-3 h-3 text-[#FFE135]" />
                ) : (
                  <IconSun className="w-3 h-3 text-white" />
                )}
              </div>
            </button>
          </div>

          {/* 5 Preset Theme Selector Cards */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-black uppercase text-gray-700 dark:text-[var(--theme-text-muted,#A7A1B8)] tracking-wider">
              5 Preset Resmi:
            </span>
            <div className="grid grid-cols-1 gap-2">
              {THEME_PRESETS.map((preset) => {
                const isSelected = preset.id === currentThemeId;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectTheme(preset.id)}
                    className={cn(
                      'w-full text-left p-3 rounded-xl border-2 transition-all cursor-pointer select-none flex items-center justify-between gap-3',
                      isSelected
                        ? 'border-[#0A0A0A] dark:border-[var(--theme-accent-primary,#FFE135)] shadow-[3px_3px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_var(--theme-accent-primary,#FFE135)] bg-yellow-50/50 dark:bg-[var(--theme-surface,#1E1E1E)] scale-[1.01]'
                        : 'border-gray-300 dark:border-[var(--theme-border,#2E2E2E)] shadow-none bg-white dark:bg-[var(--theme-surface,#16181D)] hover:border-[#0A0A0A] dark:hover:border-gray-500'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Color Palette Preview Swatch */}
                      <div
                        className="w-10 h-10 rounded-lg border-2 border-[#0A0A0A] flex flex-col overflow-hidden shadow-[1px_1px_0px_#0A0A0A] flex-shrink-0"
                        style={{ backgroundColor: preset.colors.bg }}
                      >
                        <div
                          className="h-5 w-full flex items-center justify-end px-1 gap-0.5"
                          style={{ backgroundColor: preset.colors.surface }}
                        >
                          <span
                            className="w-2 h-2 rounded-full border border-black/40"
                            style={{ backgroundColor: preset.colors.accentPrimary }}
                          />
                          <span
                            className="w-2 h-2 rounded-full border border-black/40"
                            style={{ backgroundColor: preset.colors.accentSecondary }}
                          />
                        </div>
                        <div className="flex-1 flex items-center px-1">
                          <span
                            className="text-[9px] font-black leading-none"
                            style={{ color: preset.colors.textPrimary }}
                          >
                            Aa
                          </span>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-[#0A0A0A] dark:text-[var(--theme-text-primary,#F4F4F0)] truncate">
                            {preset.name}
                          </span>
                          <span
                            className={cn(
                              'text-[9px] font-bold px-1.5 py-0.2 rounded border',
                              preset.isDark
                                ? 'bg-gray-900 text-gray-200 border-gray-700'
                                : 'bg-amber-100 text-amber-900 border-amber-300'
                            )}
                          >
                            {preset.isDark ? 'Dark' : 'Light'}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 dark:text-[var(--theme-text-muted,#8E929E)] truncate max-w-[200px]">
                          {preset.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Active Check Indicator */}
                    <div className="flex-shrink-0">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 rounded-md bg-[#FFE135] dark:bg-[var(--theme-accent-primary,#FFE135)] text-[#0A0A0A] border-2 border-[#0A0A0A] shadow-[1px_1px_0px_#0A0A0A]">
                          <IconCheck className="w-3 h-3 stroke-[3]" />
                          <span>Aktif</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 px-2 py-1">
                          Pilih
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </NbCard>

        {/* GRUP 2: PENGINGAT & NOTIFIKASI */}
        <NbCard className="p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <IconBell className="w-5 h-5 text-[#0A0A0A] dark:text-[#F4F4F0] stroke-[2.5]" />
              <h2 className="text-sm font-black text-[#0A0A0A] dark:text-[#F4F4F0] uppercase tracking-wide">
                Pengingat & Notifikasi
              </h2>
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#0A0A0A] bg-blue-100 text-blue-900 shadow-[1px_1px_0px_#0A0A0A]">
              Native Alarm
            </span>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-300">
            Alarm sistem native Android akan berbunyi setiap hari tanpa membebani baterai (tanpa loop background).
          </p>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <NbInput
                label="Jam Evaluasi Harian (Waktu Lokal HP)"
                type="time"
                value={dailyTime}
                onChange={(e) => setDailyTime(e.target.value)}
                leftIcon={<IconClock className="w-4 h-4 text-gray-500" />}
              />
            </div>
            <NbButton
              variant="primary"
              onClick={handleSaveReminderTime}
              className="mb-[1px]"
            >
              Simpan Jam
            </NbButton>
          </div>

          {/* Test Notification Button */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-[#0A0A0A] dark:text-[#F4F4F0]">
                Cek Izin Notifikasi Perangkat
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                Kirim pesan notifikasi lokal instan untuk memastikan izin HP aktif.
              </p>
            </div>
            <NbButton
              size="sm"
              variant="secondary"
              onClick={handleTestNotification}
              isLoading={isTestingNotif}
              leftIcon={<IconBell className="w-3.5 h-3.5 stroke-[2.5]" />}
            >
              Uji Notifikasi
            </NbButton>
          </div>
        </NbCard>

        {/* GRUP 3: MANAJEMEN DATA (OFFLINE BACKUP & RESTORE) */}
        <NbCard className="p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <IconDatabase className="w-5 h-5 text-[#0A0A0A] dark:text-[#F4F4F0] stroke-[2.5]" />
              <h2 className="text-sm font-black text-[#0A0A0A] dark:text-[#F4F4F0] uppercase tracking-wide">
                Manajemen Data
              </h2>
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#0A0A0A] bg-emerald-100 text-emerald-900 shadow-[1px_1px_0px_#0A0A0A]">
              100% Offline
            </span>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-300">
            Data NoteZ tersimpan sepenuhnya di IndexedDB perangkat HP. Ekspor backup secara berkala agar catatan dan keuanganmu tetap aman.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Export Card */}
            <div className="p-3 bg-blue-50 dark:bg-[#202838] rounded-xl border-2 border-[#0A0A0A] dark:border-[#2E2E2E] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000] flex flex-col justify-between space-y-2">
              <div>
                <h3 className="text-xs font-black text-blue-900 dark:text-blue-200 uppercase">
                  Ekspor Full Backup
                </h3>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5">
                  Unduh seluruh 11 tabel lokal ke satu file format .JSON.
                </p>
              </div>
              <NbButton
                size="sm"
                variant="secondary"
                onClick={handleExport}
                isLoading={isExporting}
                leftIcon={<IconDownload className="w-3.5 h-3.5 stroke-[2.5]" />}
                className="w-full"
              >
                Ekspor Data ke JSON
              </NbButton>
            </div>

            {/* Import Card */}
            <div className="p-3 bg-purple-50 dark:bg-[#2c2038] rounded-xl border-2 border-[#0A0A0A] dark:border-[#2E2E2E] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000] flex flex-col justify-between space-y-2">
              <div>
                <h3 className="text-xs font-black text-purple-900 dark:text-purple-200 uppercase">
                  Pulihkan dari File
                </h3>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5">
                  Muat file backup .JSON untuk memulihkan seluruh data NoteZ.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
              <NbButton
                size="sm"
                variant="primary"
                onClick={() => fileInputRef.current?.click()}
                isLoading={isImporting}
                leftIcon={<IconUpload className="w-3.5 h-3.5 stroke-[2.5]" />}
                className="w-full"
              >
                Pulihkan Data dari JSON
              </NbButton>
            </div>
          </div>

          {/* Danger Zone: Reset Database */}
          <div className="p-3.5 bg-red-50 dark:bg-[#331c1c] rounded-xl border-2 border-[#FF3B30] shadow-[2px_2px_0px_#FF3B30] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#FF3B30]">
                <IconAlertTriangle className="w-4 h-4 stroke-[3]" />
                <h3 className="text-xs font-black uppercase">
                  Zona Bahaya
                </h3>
              </div>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-300">
                Permanen
              </span>
            </div>
            <p className="text-[11px] text-gray-700 dark:text-gray-300">
              Menghapus seluruh catatan, transaksi, tugas, habit, watchlist, dan celengan impian.
            </p>
            <NbButton
              size="sm"
              variant="danger"
              onClick={() => {
                setResetConfirmInput('');
                setIsResetConfirmOpen(true);
              }}
              leftIcon={<IconTrash className="w-3.5 h-3.5 stroke-[2.5]" />}
              className="w-full"
            >
              Reset Seluruh Database
            </NbButton>
          </div>
        </NbCard>

        {/* GRUP 4: INFO APLIKASI */}
        <NbCard className="p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <IconInfoCircle className="w-5 h-5 text-[#0A0A0A] dark:text-[#F4F4F0] stroke-[2.5]" />
              <h2 className="text-sm font-black text-[#0A0A0A] dark:text-[#F4F4F0] uppercase tracking-wide">
                Info Aplikasi
              </h2>
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#0A0A0A] bg-[#FFE135] text-[#0A0A0A] shadow-[1px_1px_0px_#0A0A0A]">
              v2.0.0
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AppLogo size="sm" showText={true} />
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                (Offline-First Edition)
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950 border border-emerald-400 text-emerald-800 dark:text-emerald-200 text-[10px] font-black">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
              <span>Dexie IndexedDB Terhubung</span>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed pt-1 border-t border-gray-100 dark:border-gray-800">
            NoteZ v2.0 dibangun tanpa dependensi cloud eksternal. Seluruh operasi bersifat atomik (ACID) dan tersimpan aman di penyimpanan lokal HP Anda.
          </p>
        </NbCard>

        {/* Modal Konfirmasi Reset (Requires Typing 'HAPUS') */}
        <NbModal
          isOpen={isResetConfirmOpen}
          onClose={() => setIsResetConfirmOpen(false)}
          title="Konfirmasi Reset Database"
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950 border-2 border-[#FF3B30] text-xs font-bold text-red-900 dark:text-red-200 space-y-1">
              <p className="font-black text-red-900 dark:text-red-100 uppercase">
                Peringatan: Tindakan ini permanen!
              </p>
              <p>
                Semua data dompet, transaksi, tugas, habit, catatan, dan tontonan akan dihapus secara total dari perangkat ini.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#0A0A0A] dark:text-[#F4F4F0] block">
                Ketik kata <span className="text-[#FF3B30] underline">HAPUS</span> di bawah ini untuk konfirmasi:
              </label>
              <NbInput
                type="text"
                value={resetConfirmInput}
                onChange={(e) => setResetConfirmInput(e.target.value)}
                placeholder="Ketik HAPUS"
                className="font-mono font-bold"
                autoFocus
              />
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
              <NbButton
                variant="neutral"
                onClick={() => setIsResetConfirmOpen(false)}
              >
                Batal
              </NbButton>
              <NbButton
                variant="danger"
                onClick={handleResetExecute}
                disabled={resetConfirmInput !== 'HAPUS'}
                className={cn(
                  resetConfirmInput !== 'HAPUS' && 'opacity-40 cursor-not-allowed'
                )}
              >
                Reset Pabrik
              </NbButton>
            </div>
          </div>
        </NbModal>
      </div>
    </AppShell>
  );
}
