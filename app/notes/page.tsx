'use client';

import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  IconNotes,
  IconPlus,
  IconSearch,
  IconTrash,
  IconPin,
  IconFolder,
} from '@tabler/icons-react';
import { db } from '@/app/lib/db';
import type { Note } from '@/app/lib/types';
import { AppShell } from '@/components/layout/AppShell';
import { NbCard } from '@/components/ui/NbCard';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteModal } from '@/components/notes/NoteModal';
import { TrashModal } from '@/components/notes/TrashModal';
import { cn } from '@/app/lib/utils';

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFolder, setActiveFolder] = useState<string>('all');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState<boolean>(false);
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);
  const [isTrashOpen, setIsTrashOpen] = useState<boolean>(false);

  // Read all notes reactively from Dexie
  const allNotes =
    useLiveQuery(async () => {
      if (typeof window === 'undefined') return [];
      const list = await db.notes.toArray();
      return list.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }, []) || [];

  const activeNotes = allNotes.filter((n) => !n.isTrashed);
  const trashedNotes = allNotes.filter((n) => n.isTrashed);

  // Filter notes by search & folder
  const filteredNotes = activeNotes.filter((n) => {
    if (activeFolder === 'pinned' && !n.isPinned) return false;
    if (
      activeFolder !== 'all' &&
      activeFolder !== 'pinned' &&
      n.folder.toLowerCase() !== activeFolder.toLowerCase()
    ) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchContent = n.content.toLowerCase().includes(q);
      const matchTag = n.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchTag) return false;
    }

    return true;
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const otherNotes = filteredNotes.filter((n) => !n.isPinned);

  const handleEditNote = (note: Note) => {
    setNoteToEdit(note);
    setIsNoteModalOpen(true);
  };

  const handleCreateNew = () => {
    setNoteToEdit(null);
    setIsNoteModalOpen(true);
  };

  return (
    <AppShell headerTitle="Catatan">
      <div className="space-y-4">
        {/* Search & Trash Toolbar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul, isi, atau #tag..."
              className="w-full bg-white text-xs font-bold text-[#0A0A0A] rounded-xl border-[2.5px] border-[#0A0A0A] pl-8 pr-3 py-2 outline-none focus:shadow-[2px_2px_0px_#3B6FFF]"
            />
            <IconSearch className="w-4 h-4 text-gray-500 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => setIsTrashOpen(true)}
            className="flex items-center gap-1 bg-white text-xs font-black text-gray-700 px-3 py-2 rounded-xl border-[2.5px] border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex-shrink-0"
            title="Buka Tong Sampah"
          >
            <IconTrash className="w-4 h-4 text-gray-600" />
            <span>Sampah</span>
            {trashedNotes.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#FF3B30] text-white text-[9px] flex items-center justify-center font-black">
                {trashedNotes.length}
              </span>
            )}
          </button>
        </div>

        {/* Folder Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'pinned', label: '📌 Disematkan' },
            { id: 'ide', label: 'Ide' },
            { id: 'kuliah', label: 'Kuliah' },
            { id: 'kerja', label: 'Kerja' },
            { id: 'jurnal', label: 'Jurnal' },
            { id: 'belanja', label: 'Belanja' },
            { id: 'pribadi', label: 'Pribadi' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFolder(f.id)}
              className={cn(
                'px-2.5 py-1 text-xs font-black rounded-lg border-2 border-[#0A0A0A] transition-all cursor-pointer whitespace-nowrap select-none',
                activeFolder === f.id
                  ? 'bg-[#FFE135] text-[#0A0A0A] shadow-[1.5px_1.5px_0px_#0A0A0A] -translate-y-0.5'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notes Grid Display */}
        {filteredNotes.length === 0 ? (
          <NbCard className="p-8 text-center text-gray-500">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE135] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] flex items-center justify-center mx-auto mb-2">
              <IconNotes className="w-6 h-6 text-[#0A0A0A]" />
            </div>
            <p className="text-sm font-bold text-[#0A0A0A]">
              Tidak ada catatan
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Tekan tombol "+ Catat" untuk membuat catatan ide baru.
            </p>
          </NbCard>
        ) : (
          <div className="space-y-4">
            {/* Pinned Section */}
            {pinnedNotes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-xs font-black text-[#0A0A0A] uppercase tracking-wide">
                  <IconPin className="w-3.5 h-3.5 fill-[#FFE135]" />
                  <span>Disematkan ({pinnedNotes.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pinnedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onEdit={handleEditNote}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other Notes Section */}
            {otherNotes.length > 0 && (
              <div className="space-y-2">
                {pinnedNotes.length > 0 && (
                  <div className="text-xs font-black text-gray-600 uppercase tracking-wide pt-2">
                    Lainnya ({otherNotes.length})
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {otherNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onEdit={handleEditNote}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Floating Action Button (FAB) */}
        <div className="fixed bottom-20 right-4 z-30">
          <button
            type="button"
            onClick={handleCreateNew}
            aria-label="Catat Baru"
            className="w-14 h-14 rounded-2xl bg-[#FFE135] text-[#0A0A0A] border-[3px] border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#0A0A0A] flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
          >
            <IconPlus className="w-8 h-8 stroke-[3]" />
          </button>
        </div>

        {/* Modals */}
        <NoteModal
          isOpen={isNoteModalOpen}
          onClose={() => setIsNoteModalOpen(false)}
          noteToEdit={noteToEdit}
        />
        <TrashModal
          isOpen={isTrashOpen}
          onClose={() => setIsTrashOpen(false)}
          trashedNotes={trashedNotes}
        />
      </div>
    </AppShell>
  );
}
