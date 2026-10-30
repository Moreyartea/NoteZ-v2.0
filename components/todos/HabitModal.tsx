'use client';

import React, { useState, useEffect } from 'react';
import { NbModal } from '@/components/ui/NbModal';
import { NbButton } from '@/components/ui/NbButton';
import { NbInput } from '@/components/ui/NbInput';
import { createHabit } from '@/app/lib/services/habitService';

export interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const presetIcons = [
  { id: 'flame', label: '🔥 Api / Semangat' },
  { id: 'water', label: '💧 Air / Hidrasi' },
  { id: 'book', label: '📚 Buku / Belajar' },
  { id: 'run', label: '🏃 Lari / Olahraga' },
  { id: 'dumbbell', label: '🏋️ Gym / Fitness' },
  { id: 'meditation', label: '🧘 Meditasi / Relaksasi' },
  { id: 'moon', label: '🌙 Tidur Tepat Waktu' },
  { id: 'code', label: '💻 Coding / Project' },
];

const presetColors = [
  '#FF6B2B', // Orange flame
  '#3B6FFF', // Blue water
  '#00E676', // Green health
  '#FFE135', // Yellow energy
  '#A855F7', // Purple focus
  '#FF4DA6', // Pink habit
];

export const HabitModal: React.FC<HabitModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState<string>('');
  const [icon, setIcon] = useState<string>('flame');
  const [color, setColor] = useState<string>('#FF6B2B');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setIcon('flame');
      setColor('#FF6B2B');
      setErrorMsg('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Nama kebiasaan wajib diisi');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      await createHabit(title, icon, color);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal membuat kebiasaan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NbModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Kebiasaan Baru"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <NbInput
          label="Nama Kebiasaan (Habit)"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Minum Air 2L, Olahraga 30 Menit"
          required
          autoFocus
        />

        {/* Icon Picker */}
        <div>
          <label className="text-sm font-bold text-[#0A0A0A] block mb-1.5">
            Pilih Ikon
          </label>
          <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-1 bg-[#FFFDF7] rounded-xl border-2 border-[#0A0A0A]">
            {presetIcons.map((i) => (
              <button
                key={i.id}
                type="button"
                onClick={() => setIcon(i.id)}
                className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border-2 border-[#0A0A0A] text-left transition-all cursor-pointer ${
                  icon === i.id
                    ? 'bg-[#FFE135] shadow-[2px_2px_0px_#0A0A0A]'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {i.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color Picker */}
        <div>
          <label className="text-sm font-bold text-[#0A0A0A] block mb-1.5">
            Warna Kartu
          </label>
          <div className="flex gap-2">
            {presetColors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-9 h-9 rounded-xl border-2 border-[#0A0A0A] transition-all cursor-pointer ${
                  color === c ? 'scale-110 shadow-[2px_2px_0px_#0A0A0A]' : 'opacity-70'
                }`}
              />
            ))}
          </div>
        </div>

        {errorMsg && (
          <p className="text-xs font-bold text-[#FF3B30]">{errorMsg}</p>
        )}

        <div className="flex gap-2 justify-end pt-2 border-t-2 border-[#0A0A0A]">
          <NbButton type="button" variant="neutral" onClick={onClose}>
            Batal
          </NbButton>
          <NbButton type="submit" variant="warning" isLoading={isLoading}>
            Simpan Habit
          </NbButton>
        </div>
      </form>
    </NbModal>
  );
};

