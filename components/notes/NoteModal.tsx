'use client';

import React, { useState, useEffect } from 'react';
import {
  IconPlus,
  IconTrash,
  IconPin,
  IconDeviceMobile,
  IconSquare,
} from '@tabler/icons-react';
import type { Note, NoteChecklistItem } from '@/app/lib/types';
import { NbModal } from '@/components/ui/NbModal';
import { NbButton } from '@/components/ui/NbButton';
import { NbInput } from '@/components/ui/NbInput';
import { NbSelect } from '@/components/ui/NbSelect';
import { createNote, updateNote } from '@/app/lib/services/noteService';
import { cn } from '@/app/lib/utils';

export interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteToEdit?: Note | null;
}

const colorPalette = [
  { id: '#FFFDF7', name: 'Putih Hangat' },
  { id: '#FFE135', name: 'Kuning Brutal' },
  { id: '#E3F2FD', name: 'Biru Muda' },
  { id: '#E8F5E9', name: 'Hijau Muda' },
  { id: '#FCE4EC', name: 'Pink Pastel' },
  { id: '#F3E5F5', name: 'Ungu Pop' },
];

const folderOptions = ['Ide', 'Kuliah', 'Kerja', 'Jurnal', 'Belanja', 'Pribadi'];

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  noteToEdit,
}) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [folder, setFolder] = useState<string>('Ide');
  const [color, setColor] = useState<string>('#FFFDF7');
  const [tagsStr, setTagsStr] = useState<string>('');
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [showOnHomeWidget, setShowOnHomeWidget] = useState<boolean>(false);

  // Dynamic checklists
  const [checklists, setChecklists] = useState<NoteChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (noteToEdit) {
        setTitle(noteToEdit.title);
        setContent(noteToEdit.content || '');
        setFolder(noteToEdit.folder || 'Ide');
        setColor(noteToEdit.color || '#FFFDF7');
        setTagsStr((noteToEdit.tags || []).join(', '));
        setIsPinned(noteToEdit.isPinned || false);
        setShowOnHomeWidget(noteToEdit.showOnHomeWidget || false);
        setChecklists(noteToEdit.checklists || []);
      } else {
        setTitle('');
        setContent('');
        setFolder('Ide');
        setColor('#FFFDF7');
        setTagsStr('');
        setIsPinned(false);
        setShowOnHomeWidget(false);
        setChecklists([]);
      }
      setNewChecklistText('');
      setErrorMsg('');
    }
  }, [isOpen, noteToEdit]);

  const handleAddChecklist = () => {
    if (!newChecklistText.trim()) return;
    const newItem: NoteChecklistItem = {
      id: 'cl-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      text: newChecklistText.trim(),
      isChecked: false,
    };
    setChecklists([...checklists, newItem]);
    setNewChecklistText('');
  };

  const handleRemoveChecklist = (id: string) => {
    setChecklists(checklists.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim() && checklists.length === 0) {
      setErrorMsg('Catatan tidak boleh kosong');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const parsedTags = tagsStr
        .split(/[,\s]+/)
        .map((t) => t.replace(/^#/, '').trim())
        .filter(Boolean);

      if (noteToEdit) {
        await updateNote(noteToEdit.id, {
          title: title.trim() || 'Tanpa Judul',
          content,
          folder,
          color,
          tags: parsedTags,
          isPinned,
          showOnHomeWidget,
          checklists,
        });
      } else {
        await createNote({
          title: title.trim() || 'Tanpa Judul',
          content,
          folder,
          color,
          tags: parsedTags,
          isPinned,
          showOnHomeWidget,
          checklists,
        });
      }

      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal menyimpan catatan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NbModal
      isOpen={isOpen}
      onClose={onClose}
      title={noteToEdit ? 'Edit Catatan' : 'Catatan Baru'}
      className="max-w-lg max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <NbInput
          label="Judul Catatan"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul ide, materi, agenda..."
          autoFocus
        />

        {/* Content */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-[#0A0A0A] dark:text-[var(--theme-text-primary)]">
            Isi Catatan
          </label>
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tulis bebas ide atau catatanmu di sini..."
            className="w-full bg-white dark:bg-[var(--theme-surface-elevated)] text-[#0A0A0A] dark:text-[var(--theme-text-primary)] placeholder:text-gray-400 dark:placeholder:text-[var(--theme-text-muted)] font-medium text-sm rounded-xl border-[2.5px] border-[#0A0A0A] dark:border-[var(--theme-border)] p-3 outline-none focus:shadow-[3px_3px_0px_#3B6FFF] resize-none"
          />
        </div>

        {/* Dynamic Checklist Section */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-[#0A0A0A] dark:text-[var(--theme-text-primary)] block">
            Daftar Checklist (Opsional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newChecklistText}
              onChange={(e) => setNewChecklistText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddChecklist();
                }
              }}
              placeholder="Tambahkan butir checklist..."
              className="flex-1 bg-white dark:bg-[var(--theme-surface-elevated)] text-[#0A0A0A] dark:text-[var(--theme-text-primary)] placeholder:text-gray-400 dark:placeholder:text-[var(--theme-text-muted)] text-xs font-semibold px-3 py-2 rounded-xl border-2 border-[#0A0A0A] dark:border-[var(--theme-border)] outline-none focus:shadow-[2px_2px_0px_#3B6FFF]"
            />
            <button
              type="button"
              onClick={handleAddChecklist}
              className="px-3 py-2 bg-[#FFE135] text-[#0A0A0A] text-xs font-black rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1 cursor-pointer"
            >
              <IconPlus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Tambah</span>
            </button>
          </div>

          {checklists.length > 0 && (
            <div className="p-2 bg-[#FFFDF7] dark:bg-[var(--theme-surface-elevated)] rounded-xl border-2 border-[#0A0A0A] dark:border-[var(--theme-border)] space-y-1.5 max-h-32 overflow-y-auto">
              {checklists.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white dark:bg-[var(--theme-surface)] px-2.5 py-1.5 rounded-lg border-2 border-[#0A0A0A]/20 dark:border-[var(--theme-border-subtle)]"
                >
                  <span className="text-xs font-bold text-gray-800 dark:text-[var(--theme-text-primary)] truncate inline-flex items-center gap-1">
                    <IconSquare className="w-3.5 h-3.5 text-gray-400 dark:text-[var(--theme-text-muted)] stroke-2" />
                    <span>{item.text}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklist(item.id)}
                    className="text-gray-400 dark:text-[var(--theme-text-muted)] hover:text-red-500 cursor-pointer"
                  >
                    <IconTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Folder & Color */}
        <div className="grid grid-cols-2 gap-2">
          <NbSelect
            label="Folder"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            options={folderOptions.map((f) => ({ value: f, label: f }))}
          />

          <div>
            <label className="text-xs font-black uppercase tracking-wider text-[#0A0A0A] dark:text-[var(--theme-text-primary)] block mb-1.5">
              Warna Kartu
            </label>
            <div className="flex gap-1.5">
              {colorPalette.map((cp) => (
                <button
                  key={cp.id}
                  type="button"
                  onClick={() => setColor(cp.id)}
                  style={{ backgroundColor: cp.id }}
                  title={cp.name}
                  className={cn(
                    'w-7 h-7 rounded-lg border-2 border-[#0A0A0A] transition-all cursor-pointer',
                    color === cp.id
                      ? 'scale-115 shadow-[2px_2px_0px_#0A0A0A]'
                      : 'opacity-70'
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Tags */}
        <NbInput
          label="Label Tags (Pisahkan dengan koma)"
          type="text"
          value={tagsStr}
          onChange={(e) => setTagsStr(e.target.value)}
          placeholder="Contoh: kuliah, tugas, penting"
        />

        {/* Toggles */}
        <div className="space-y-2 pt-2 border-t-2 border-[#0A0A0A]/10 dark:border-[var(--theme-border-subtle)]">
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-yellow-50 dark:bg-yellow-950/30 border-2 border-[#0A0A0A] dark:border-[var(--theme-border)] cursor-pointer">
            <div className="flex items-center gap-2">
              <IconPin className="w-4 h-4 text-[#0A0A0A] dark:text-[var(--theme-text-primary)]" />
              <span className="text-xs font-bold text-[#0A0A0A] dark:text-[var(--theme-text-primary)]">
                Sematkan di Paling Atas (Pinned)
              </span>
            </div>
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-4 h-4 accent-[#0A0A0A] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border-2 border-[#0A0A0A] dark:border-[var(--theme-border)] cursor-pointer">
            <div className="flex items-center gap-2">
              <IconDeviceMobile className="w-4 h-4 text-[#0A0A0A] dark:text-[var(--theme-text-primary)]" />
              <span className="text-xs font-bold text-[#0A0A0A] dark:text-[var(--theme-text-primary)]">
                Tampilkan di Widget Sticky Note Layar HP
              </span>
            </div>
            <input
              type="checkbox"
              checked={showOnHomeWidget}
              onChange={(e) => setShowOnHomeWidget(e.target.checked)}
              className="w-4 h-4 accent-[#3B6FFF] cursor-pointer"
            />
          </label>
        </div>

        {errorMsg && (
          <p className="text-xs font-bold text-[#FF3B30] bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl border-2 border-[#FF3B30]">
            {errorMsg}
          </p>
        )}

        <div className="flex gap-2 justify-end pt-2 border-t-2 border-[#0A0A0A]/10 dark:border-[var(--theme-border-subtle)]">
          <NbButton type="button" variant="neutral" onClick={onClose}>
            Batal
          </NbButton>
          <NbButton type="submit" variant="primary" isLoading={isLoading}>
            {noteToEdit ? 'Simpan Perubahan' : 'Buat Catatan'}
          </NbButton>
        </div>
      </form>
    </NbModal>
  );
};
