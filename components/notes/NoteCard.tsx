'use client';

import React from 'react';
import {
  IconPin,
  IconDeviceMobile,
  IconTrash,
  IconCheck,
  IconFolder,
} from '@tabler/icons-react';
import type { Note } from '@/app/lib/types';
import { NbCard } from '@/components/ui/NbCard';
import {
  toggleNotePin,
  toggleNoteWidget,
  toggleChecklistItem,
  softDeleteNote,
} from '@/app/lib/services/noteService';
import { cn } from '@/app/lib/utils';

export interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit }) => {
  const checklists = note.checklists || [];
  const completedChecklists = checklists.filter((c) => c.isChecked).length;

  const handlePin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleNotePin(note.id);
  };

  const handleWidget = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleNoteWidget(note.id);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Pindahkan catatan "${note.title}" ke tempat sampah?`)) {
      await softDeleteNote(note.id);
    }
  };

  const handleCheckItem = async (e: React.MouseEvent, checklistId: string) => {
    e.stopPropagation();
    await toggleChecklistItem(note.id, checklistId);
  };

  return (
    <NbCard
      bgColor={note.color && note.color !== '#FFFDF7' && note.color !== '#FFFFFF' ? note.color : undefined}
      onClick={() => onEdit(note)}
      className="p-4 flex flex-col justify-between space-y-3 cursor-pointer hover:shadow-[6px_6px_0px_#0A0A0A] hover:-translate-y-0.5 transition-all select-none"
    >
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-1">
        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-[#0A0A0A] dark:text-[var(--theme-text-primary)] bg-white/90 dark:bg-[var(--theme-surface)] px-2 py-0.5 rounded-md border border-[#0A0A0A] dark:border-[var(--theme-border)] truncate max-w-[120px]">
          <IconFolder className="w-3 h-3 text-[#0A0A0A] dark:text-[var(--theme-text-primary)]" />
          <span>{note.folder || 'Ide'}</span>
        </span>

        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Pin Button */}
          <button
            type="button"
            onClick={handlePin}
            title={note.isPinned ? 'Lepas Sematan' : 'Sematkan ke Atas'}
            className={cn(
              'p-1.5 rounded-md border border-[#0A0A0A] dark:border-[var(--theme-border)] transition-all cursor-pointer',
              note.isPinned
                ? 'bg-[#FFE135] text-[#0A0A0A] shadow-[1px_1px_0px_#0A0A0A]'
                : 'bg-white/80 dark:bg-[var(--theme-surface)] text-gray-500 dark:text-[var(--theme-text-muted)] hover:text-black dark:hover:text-white'
            )}
          >
            <IconPin className="w-3.5 h-3.5" />
          </button>

          {/* Home Widget Button */}
          <button
            type="button"
            onClick={handleWidget}
            title={note.showOnHomeWidget ? 'Tampil di Widget HP' : 'Pasang di Widget Layar HP'}
            className={cn(
              'p-1.5 rounded-md border border-[#0A0A0A] dark:border-[var(--theme-border)] transition-all cursor-pointer',
              note.showOnHomeWidget
                ? 'bg-[#3B6FFF] text-white shadow-[1px_1px_0px_#0A0A0A]'
                : 'bg-white/80 dark:bg-[var(--theme-surface)] text-gray-500 dark:text-[var(--theme-text-muted)] hover:text-black dark:hover:text-white'
            )}
          >
            <IconDeviceMobile className="w-3.5 h-3.5" />
          </button>

          {/* Soft Delete (Trash) */}
          <button
            type="button"
            onClick={handleDelete}
            title="Pindah ke Sampah"
            className="p-1.5 rounded-md bg-white/80 dark:bg-[var(--theme-surface)] border border-[#0A0A0A] dark:border-[var(--theme-border)] text-gray-500 dark:text-[var(--theme-text-muted)] hover:text-[#FF3B30] hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
          >
            <IconTrash className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Title & Content */}
      <div className="space-y-1">
        <h3 className="font-black text-base text-[#0A0A0A] dark:text-[var(--theme-text-primary)] leading-tight break-words">
          {note.title}
        </h3>
        {note.content && (
          <p className="text-xs text-gray-700 dark:text-[var(--theme-text-muted)] whitespace-pre-line line-clamp-3 leading-relaxed">
            {note.content}
          </p>
        )}
      </div>

      {/* Checklists Preview (Interactive) */}
      {checklists.length > 0 && (
        <div className="p-2.5 rounded-xl bg-white/85 dark:bg-[var(--theme-surface)]/80 border border-[#0A0A0A] dark:border-[var(--theme-border)] space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-extrabold text-gray-600 dark:text-[var(--theme-text-muted)] uppercase">
            <span>Checklist</span>
            <span>
              {completedChecklists}/{checklists.length} Selesai
            </span>
          </div>

          <div className="space-y-1">
            {checklists.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={(e) => handleCheckItem(e, item.id)}
                className="flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <span
                  className={cn(
                    'w-3.5 h-3.5 rounded border border-[#0A0A0A] flex items-center justify-center flex-shrink-0',
                    item.isChecked ? 'bg-[#00E676]' : 'bg-white'
                  )}
                >
                  {item.isChecked && <IconCheck className="w-2.5 h-2.5 stroke-[4]" />}
                </span>
                <span
                  className={cn(
                    'truncate font-medium',
                    item.isChecked && 'line-through text-gray-400'
                  )}
                >
                  {item.text}
                </span>
              </div>
            ))}
            {checklists.length > 3 && (
              <p className="text-[10px] font-bold text-gray-500 italic">
                +{checklists.length - 3} item lainnya...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tags & Date Footer */}
      <div className="flex items-center justify-between gap-1 pt-1 border-t border-black/10">
        <div className="flex items-center gap-1 flex-wrap min-w-0">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-bold text-gray-700 bg-white/80 px-1.5 py-0.5 rounded border border-gray-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        <span className="text-[9px] font-mono text-gray-500 flex-shrink-0">
          {new Date(note.updatedAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
          })}
        </span>
      </div>
    </NbCard>
  );
};

