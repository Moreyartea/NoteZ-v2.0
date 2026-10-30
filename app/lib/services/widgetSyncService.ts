import { Preferences } from '@capacitor/preferences';
import { db } from '@/app/lib/db';
import { getLocalTodayDateString } from './todoService';

export interface WidgetTodoItem {
  id: string;
  title: string;
  isCompleted: boolean;
  priority: string;
}

export interface WidgetTodosPayload {
  updatedAt: string;
  todayDate: string;
  completedCount: number;
  totalCount: number;
  items: WidgetTodoItem[];
}

export interface WidgetFinancePayload {
  updatedAt: string;
  totalBalance: number;
  walletCount: number;
}

export interface WidgetNotePayload {
  id: string;
  title: string;
  contentSnippet: string;
  folder: string;
}

export interface WidgetWishlistPayload {
  id: string;
  name: string;
  targetPrice: number;
  savedAmount: number;
  progressPercent: number;
}

/**
 * Synchronizes current local app snapshot to Android SharedPreferences via Capacitor Preferences
 * Reads by native Kotlin AppWidgetProvider
 */
export async function syncDataToHomeWidget(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const todayStr = getLocalTodayDateString();

    // 1. Todos for widget
    const allTodos = await db.todos.toArray();
    const todayTodos = allTodos.filter(
      (t) => t.dueDate === todayStr || t.pinToHomeWidget
    );

    const completedCount = todayTodos.filter((t) => t.isCompleted).length;
    const priorityWeight: Record<string, number> = { high: 3, medium: 2, low: 1 };

    const topTodos: WidgetTodoItem[] = todayTodos
      .sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
        return (priorityWeight[b.priority] || 1) - (priorityWeight[a.priority] || 1);
      })
      .slice(0, 5)
      .map((t) => ({
        id: t.id,
        title: t.title,
        isCompleted: t.isCompleted,
        priority: t.priority,
      }));

    const todosPayload: WidgetTodosPayload = {
      updatedAt: new Date().toISOString(),
      todayDate: todayStr,
      completedCount,
      totalCount: todayTodos.length,
      items: topTodos,
    };

    // 2. Finance data
    const wallets = await db.wallets.toArray();
    const totalBalance = wallets.reduce((acc, w) => acc + w.balance, 0);
    const financePayload: WidgetFinancePayload = {
      updatedAt: new Date().toISOString(),
      totalBalance,
      walletCount: wallets.length,
    };

    // 3. Pinned Note for widget
    const pinnedNote = await db.notes
      .filter((n) => !n.isTrashed && n.showOnHomeWidget)
      .first();

    const notePayload: WidgetNotePayload | null = pinnedNote
      ? {
          id: pinnedNote.id,
          title: pinnedNote.title,
          contentSnippet: pinnedNote.content.slice(0, 120),
          folder: pinnedNote.folder,
        }
      : null;

    // 4. Priority Wishlist for widget
    const activeWishlist = await db.wishlists
      .filter((w) => !w.isAchieved && w.showOnHomeWidget)
      .first();

    const wishlistPayload: WidgetWishlistPayload | null = activeWishlist
      ? {
          id: activeWishlist.id,
          name: activeWishlist.name,
          targetPrice: activeWishlist.targetPrice,
          savedAmount: activeWishlist.savedAmount,
          progressPercent: Math.min(
            Math.round((activeWishlist.savedAmount / activeWishlist.targetPrice) * 100),
            100
          ),
        }
      : null;

    // Save to Capacitor Preferences
    await Promise.all([
      Preferences.set({
        key: 'widget_todos_data',
        value: JSON.stringify(todosPayload),
      }),
      Preferences.set({
        key: 'widget_finance_data',
        value: JSON.stringify(financePayload),
      }),
      Preferences.set({
        key: 'widget_note_data',
        value: JSON.stringify(notePayload),
      }),
      Preferences.set({
        key: 'widget_wishlist_data',
        value: JSON.stringify(wishlistPayload),
      }),
    ]);
  } catch (err) {
    console.warn('Widget sync skipped or failed:', err);
  }
}

