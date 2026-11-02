'use client';

import React, { useState, useEffect } from 'react';
import { IconPlus, IconTrash, IconPin } from '@tabler/icons-react';
import type { TodoPriority, TodoRecurrence } from '@/app/lib/types';
import { NbModal } from '@/components/ui/NbModal';
import { NbButton } from '@/components/ui/NbButton';
import { NbInput } from '@/components/ui/NbInput';
import { NbSelect } from '@/components/ui/NbSelect';
import { createTodo, getLocalTodayDateString } from '@/app/lib/services/todoService';
import { cn } from '@/app/lib/utils';

export interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultCategories = ['Kuliah', 'Kerja', 'Pribadi', 'Project', 'Keluarga'];

export const TodoModal: React.FC<TodoModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [category, setCategory] = useState<string>('Pribadi');
  const [dueDate, setDueDate] = useState<string>('');
  const [reminderTime, setReminderTime] = useState<string>('');
  const [recurrence, setRecurrence] = useState<TodoRecurrence>('none');
  const [pinToHomeWidget, setPinToHomeWidget] = useState<boolean>(false);

  // Subtasks list
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('Pribadi');
      setDueDate(getLocalTodayDateString());
      setReminderTime('');
      setRecurrence('none');
      setPinToHomeWidget(false);
      setSubtasks([]);
      setNewSubtaskInput('');
      setErrorMsg('');
    }
  }, [isOpen]);

  const handleAddSubtask = () => {
    if (!newSubtaskInput.trim()) return;
    setSubtasks([...subtasks, newSubtaskInput.trim()]);
    setNewSubtaskInput('');
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Judul tugas wajib diisi');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      await createTodo({
        title,
        description,
        priority,
        category,
        dueDate: dueDate || null,
        reminderTime: reminderTime || null,
        pinToHomeWidget,
        recurrence,
        subtasks,
      });
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal membuat tugas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NbModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Tugas Baru"
      className="max-w-lg max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <NbInput
          label="Judul Tugas"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Selesaikan Laporan Keuangan"
          required
          autoFocus
        />

        {/* Priority Selector */}
        <div>
          <label className="text-xs font-black uppercase tracking-wider text-[#0A0A0A] dark:text-[var(--theme-text-primary)] block mb-1.5">
            Prioritas
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'high', label: 'Tinggi', color: 'bg-[#FF3B30] text-white' },
              { id: 'medium', label: 'Sedang', color: 'bg-[#FFE135] text-[#0A0A0A]' },
              { id: 'low', label: 'Rendah', color: 'bg-[#3B6FFF] text-white' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPriority(p.id as TodoPriority)}
                className={cn(
                  'py-2 text-xs font-black rounded-xl border-2 border-[#0A0A0A] dark:border-[var(--theme-border)] transition-all cursor-pointer',
                  priority === p.id
                    ? `${p.color} shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000] scale-[1.02]`
                    : 'bg-white dark:bg-[var(--theme-surface-elevated)] text-gray-700 dark:text-[var(--theme-text-muted)] opacity-60 hover:opacity-100'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category & Recurrence */}
        <div className="grid grid-cols-2 gap-2">
          <NbSelect
            label="Kategori"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={defaultCategories.map((c) => ({ value: c, label: c }))}
          />

          <NbSelect
            label="Pengulangan"
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value as TodoRecurrence)}
            options={[
              { value: 'none', label: 'Tidak Berulang' },
              { value: 'daily', label: 'Harian' },
              { value: 'weekly', label: 'Mingguan' },
              { value: 'monthly', label: 'Bulanan' },
            ]}
          />
        </div>

        {/* Due Date & Reminder Time */}
        <div className="grid grid-cols-2 gap-2">
          <NbInput
            label="Tanggal Deadline"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />

          <NbInput
            label="Jam Alarm (HH:mm)"
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />
        </div>

        {/* Subtasks (Interactive Checklist) */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-[#0A0A0A] dark:text-[var(--theme-text-primary)] block">
            Sub-Tugas (Langkah Checklist)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubtaskInput}
              onChange={(e) => setNewSubtaskInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
              placeholder="Ketik langkah tugas..."
              className="flex-1 bg-white dark:bg-[var(--theme-surface-elevated)] text-gray-900 dark:text-[var(--theme-text-primary)] placeholder-gray-400 dark:placeholder-[var(--theme-text-muted)] text-xs font-semibold px-3 py-2 rounded-xl border-2 border-[#0A0A0A] dark:border-[var(--theme-border-subtle)] outline-none focus:shadow-[2px_2px_0px_#3B6FFF]"
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              className="px-3 py-2 bg-[#FFE135] dark:bg-[var(--theme-accent-primary)] text-[#0A0A0A] dark:text-[var(--theme-accent-text)] text-xs font-black rounded-xl border-2 border-[#0A0A0A] dark:border-[var(--theme-border-hero)] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1 cursor-pointer"
            >
              <IconPlus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Tambah</span>
            </button>
          </div>

          {subtasks.length > 0 && (
            <div className="p-2 bg-[#FFFDF7] dark:bg-[var(--theme-surface-elevated)] rounded-xl border-2 border-[#0A0A0A] dark:border-[var(--theme-border-subtle)] space-y-1.5 max-h-32 overflow-y-auto">
              {subtasks.map((st, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white dark:bg-[var(--theme-surface)] px-2.5 py-1.5 rounded-lg border-2 border-[#0A0A0A]/20 dark:border-[var(--theme-border-subtle)]"
                >
                  <span className="text-xs font-bold text-gray-800 dark:text-[var(--theme-text-primary)] truncate">
                    • {st}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(idx)}
                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                  >
                    <IconTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <NbInput
          label="Catatan / Deskripsi Tambahan (Opsional)"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detail catatan tugas..."
        />

        {/* Toggle Pin to Home Widget */}
        <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-[var(--theme-surface-elevated)] rounded-xl border-2 border-[#0A0A0A] dark:border-[var(--theme-border-subtle)]">
          <div className="flex items-center gap-2">
            <IconPin className="w-4 h-4 text-[#0A0A0A] dark:text-[var(--theme-text-primary)]" />
            <span className="text-xs font-bold text-[#0A0A0A] dark:text-[var(--theme-text-primary)]">
              Prioritaskan di Widget Layar Utama HP
            </span>
          </div>
          <input
            type="checkbox"
            checked={pinToHomeWidget}
            onChange={(e) => setPinToHomeWidget(e.target.checked)}
            className="w-5 h-5 accent-[#0A0A0A] dark:accent-[var(--theme-accent-primary)] cursor-pointer"
          />
        </div>

        {errorMsg && (
          <p className="text-xs font-bold text-[#FF3B30] bg-red-50 dark:bg-red-950/40 p-2 rounded-lg border border-[#FF3B30]">
            {errorMsg}
          </p>
        )}

        <div className="flex gap-2 justify-end pt-2 border-t-2 border-[#0A0A0A] dark:border-[var(--theme-border-subtle)]">
          <NbButton type="button" variant="neutral" onClick={onClose}>
            Batal
          </NbButton>
          <NbButton type="submit" variant="primary" isLoading={isLoading}>
            Simpan Tugas
          </NbButton>
        </div>
      </form>
    </NbModal>
  );
};

