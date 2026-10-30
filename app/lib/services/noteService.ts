import { db } from '@/app/lib/db';
import type { Note, NoteChecklistItem } from '@/app/lib/types';

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
}

/**
 * noteService - CRUD Operations & Trash Management for Smart Notes
 * 100% Offline-first with Dexie.js
 */

export async function createNote(data: {
  title: string;
  content: string;
  folder?: string;
  tags?: string[];
  color?: string;
  isPinned?: boolean;
  showOnHomeWidget?: boolean;
  checklists?: Array<{ text: string; isChecked?: boolean }>;
}): Promise<string> {
  const id = generateId();
  const now = new Date().toISOString();

  const formattedChecklists: NoteChecklistItem[] = (data.checklists || []).map(
    (item) => ({
      id: generateId(),
      text: item.text.trim(),
      isChecked: item.isChecked || false,
    })
  );

  const newNote: Note = {
    id,
    title: data.title.trim() || 'Catatan Baru',
    content: data.content || '',
    folder: data.folder?.trim() || 'Ide',
    tags: (data.tags || []).map((t) => t.trim().toLowerCase()).filter(Boolean),
    color: data.color || '#FFFDF7',
    isPinned: data.isPinned || false,
    showOnHomeWidget: data.showOnHomeWidget || false,
    isTrashed: false,
    checklists: formattedChecklists,
    createdAt: now,
    updatedAt: now,
  };

  await db.notes.add(newNote);
  return id;
}

export async function updateNote(
  id: string,
  data: Partial<Omit<Note, 'id' | 'createdAt'>>
): Promise<void> {
  const now = new Date().toISOString();
  await db.notes.update(id, {
    ...data,
    updatedAt: now,
  });
}

export async function toggleNotePin(id: string): Promise<void> {
  const note = await db.notes.get(id);
  if (!note) return;

  await db.notes.update(id, {
    isPinned: !note.isPinned,
    updatedAt: new Date().toISOString(),
  });
}

export async function toggleNoteWidget(id: string): Promise<void> {
  const note = await db.notes.get(id);
  if (!note) return;

  await db.notes.update(id, {
    showOnHomeWidget: !note.showOnHomeWidget,
    updatedAt: new Date().toISOString(),
  });
}

export async function toggleChecklistItem(
  noteId: string,
  checklistId: string
): Promise<void> {
  const note = await db.notes.get(noteId);
  if (!note || !note.checklists) return;

  const updated = note.checklists.map((item) => {
    if (item.id === checklistId) {
      return { ...item, isChecked: !item.isChecked };
    }
    return item;
  });

  await db.notes.update(noteId, {
    checklists: updated,
    updatedAt: new Date().toISOString(),
  });
}

export async function softDeleteNote(id: string): Promise<void> {
  await db.notes.update(id, {
    isTrashed: true,
    isPinned: false,
    showOnHomeWidget: false,
    updatedAt: new Date().toISOString(),
  });
}

export async function restoreNote(id: string): Promise<void> {
  await db.notes.update(id, {
    isTrashed: false,
    updatedAt: new Date().toISOString(),
  });
}

export async function permanentlyDeleteNote(id: string): Promise<void> {
  await db.notes.delete(id);
}

export async function clearTrash(): Promise<void> {
  const trashedNotes = await db.notes.filter((n) => n.isTrashed).toArray();
  const ids = trashedNotes.map((n) => n.id);
  await db.notes.bulkDelete(ids);
}
