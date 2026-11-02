'use client';

import React, { useState } from 'react';
import {
  IconTrash,
  IconRotateClockwise,
  IconFolder,
} from '@tabler/icons-react';
import type { Note } from '@/app/lib/types';
import { NbModal } from '@/components/ui/NbModal';
import { NbButton } from '@/components/ui/NbButton';
import { NbConfirmModal } from '@/components/ui/NbConfirmModal';
import {
  restoreNote,
  permanentlyDeleteNote,
  clearTrash,
} from '@/app/lib/services/noteService';

export interface TrashModalProps {
  isOpen: boolean;
  onClose: () => void;
  trashedNotes: Note[];
}

export const TrashModal: React.FC<TrashModalProps> = ({
  isOpen,
  onClose,
  trashedNotes,
}) => {
  const [isClearAllOpen, setIsClearAllOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleClearAll = async () => {
    await clearTrash();
  };

  const handleRestore = async (id: string) => {
    await restoreNote(id);
  };

  const handlePermanentDelete = async () => {
    if (!pendingDeleteId) return;
    await permanentlyDeleteNote(pendingDeleteId);
    setPendingDeleteId(null);
  };

  return (
    <>
      <NbModal
        isOpen={isOpen}
        onClose={onClose}
        title={`Tong Sampah (${trashedNotes.length})`}
        className="max-w-lg max-h-[85vh] overflow-y-auto"
      >
        <div className="space-y-4">
          {trashedNotes.length > 0 && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsClearAllOpen(true)}
                className="text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-800 bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded-lg border-2 border-red-300 dark:border-red-900 transition-all cursor-pointer shadow-[1px_1px_0px_#FF3B30]"
              >
                Kosongkan Tong Sampah
              </button>
            </div>
          )}

          {trashedNotes.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-[var(--theme-surface-elevated)] border-2 border-[#0A0A0A] dark:border-[var(--theme-border)] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000] flex items-center justify-center mx-auto mb-2">
                <IconTrash className="w-6 h-6 text-gray-400 dark:text-[var(--theme-text-muted)]" />
              </div>
              <p className="text-sm font-bold text-[#0A0A0A] dark:text-[var(--theme-text-primary)]">
                Tong sampah kosong
              </p>
              <p className="text-xs text-gray-500 dark:text-[var(--theme-text-muted)] mt-0.5">
                Catatan yang kamu hapus akan disimpan di sini sebelum dibersihkan.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {trashedNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 bg-white dark:bg-[var(--theme-surface-elevated)] rounded-xl border-2 border-[#0A0A0A] dark:border-[var(--theme-border)] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-sm text-[#0A0A0A] dark:text-[var(--theme-text-primary)] truncate">
                      {note.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-[var(--theme-text-muted)] truncate mt-0.5">
                      {note.content || '(Tanpa teks)'}
                    </p>
                    <span className="text-[10px] font-bold text-gray-500 dark:text-[var(--theme-text-muted)] uppercase mt-1 inline-flex items-center gap-1">
                      <IconFolder className="w-3 h-3" />
                      <span>{note.folder}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleRestore(note.id)}
                      className="p-1.5 bg-[#00E676] text-[#0A0A0A] rounded-lg border-2 border-[#0A0A0A] shadow-[1px_1px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                      title="Pulihkan Catatan"
                    >
                      <IconRotateClockwise className="w-4 h-4 stroke-[2.5]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setPendingDeleteId(note.id)}
                      className="p-1.5 bg-[#FF3B30] text-white rounded-lg border-2 border-[#0A0A0A] shadow-[1px_1px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                      title="Hapus Selamanya"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-2 border-t-2 border-[#0A0A0A]/10 dark:border-[var(--theme-border-subtle)]">
            <NbButton variant="neutral" onClick={onClose}>
              Tutup
            </NbButton>
          </div>
        </div>
      </NbModal>

      {/* Confirm Clear All */}
      <NbConfirmModal
        isOpen={isClearAllOpen}
        onClose={() => setIsClearAllOpen(false)}
        onConfirm={handleClearAll}
        title="Kosongkan Tong Sampah"
        message="Hapus permanen semua catatan di tong sampah? Tindakan ini tidak dapat dibatalkan."
        confirmText="Kosongkan Sekarang"
        variant="danger"
      />

      {/* Confirm Permanent Delete Single Note */}
      <NbConfirmModal
        isOpen={Boolean(pendingDeleteId)}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={handlePermanentDelete}
        title="Hapus Permanen Catatan"
        message="Hapus permanen catatan ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Selamanya"
        variant="danger"
      />
    </>
  );
};
