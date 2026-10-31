import { LocalNotifications } from '@capacitor/local-notifications';
import { db } from '@/app/lib/db';
import type {
  Todo,
  MediaItem,
  NotificationCategory,
  NotificationActionType,
} from '@/app/lib/types';

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
}

function stringToNumericId(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 2147483647;
}

/**
 * Saves a notification copy into Dexie IndexedDB for the in-app drawer
 */
export async function recordInAppNotification(data: {
  title: string;
  message: string;
  category: NotificationCategory;
  relatedEntityId?: string | null;
  actionType?: NotificationActionType | null;
}): Promise<string> {
  const id = generateId();
  const now = new Date().toISOString();

  await db.notifications.add({
    id,
    title: data.title.trim(),
    message: data.message.trim(),
    category: data.category,
    isRead: false,
    relatedEntityId: data.relatedEntityId || null,
    actionType: data.actionType || null,
    createdAt: now,
  });

  return id;
}

/**
 * Requests Native OS Notification Permission (Android 13+ / Web)
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const status = await LocalNotifications.requestPermissions();
    return status.display === 'granted';
  } catch (err) {
    console.warn('Native local notifications permission request failed:', err);
    return false;
  }
}

/**
 * Schedules daily review reminder at specified hour/minute (e.g. 20:00 WIB)
 * Pure OS-level event alarm — NO setInterval used (Anti-lag guardrail).
 */
export async function scheduleDailyReviewNotification(
  hour: number = 20,
  minute: number = 0
): Promise<void> {
  if (typeof window === 'undefined') return;

  const notifId = 999901; // Reserved ID for daily review
  const title = 'Waktunya Catat Keuangan & Habit!';
  const body = 'Buka NoteZ sekarang untuk mencatat pengeluaran hari ini dan menuntaskan checklist habit harianmu.';

  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: notifId,
          title,
          body,
          schedule: {
            on: {
              hour,
              minute,
            },
            allowWhileIdle: true,
          },
          sound: 'beep.wav',
        },
      ],
    });

    await recordInAppNotification({
      title,
      message: body,
      category: 'system',
    });
  } catch (err) {
    console.warn('Could not schedule native daily review notification:', err);
  }
}

/**
 * Schedules native reminder for a To-Do item based on dueDate and reminderTime
 */
export async function scheduleTodoReminder(todo: Todo): Promise<number | null> {
  if (typeof window === 'undefined') return null;
  if (!todo.dueDate) return null;

  const notifId = stringToNumericId(todo.id);
  const timeStr = todo.reminderTime || '09:00';
  const [hour, minute] = timeStr.split(':').map((v) => parseInt(v, 10) || 0);

  const [y, m, d] = todo.dueDate.split('-').map((v) => parseInt(v, 10));
  const triggerDate = new Date(y, m - 1, d, hour, minute, 0);

  // If time is already passed, don't schedule
  if (triggerDate.getTime() <= Date.now()) {
    return null;
  }

  const title = `Pengingat Tugas: ${todo.title}`;
  const body = `Tugas kategori ${todo.category} harus diselesaikan sebelum deadline!`;

  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: notifId,
          title,
          body,
          schedule: {
            at: triggerDate,
            allowWhileIdle: true,
          },
        },
      ],
    });

    await recordInAppNotification({
      title,
      message: body,
      category: 'todo',
      relatedEntityId: todo.id,
      actionType: 'complete_todo',
    });

    return notifId;
  } catch (err) {
    console.warn('Failed to schedule native todo reminder:', err);
    return null;
  }
}

/**
 * Schedules weekly recurring release notification for on-going anime/series
 */
export async function scheduleMediaReminder(media: MediaItem): Promise<number | null> {
  if (typeof window === 'undefined') return null;
  if (!media.airingDay || media.status !== 'watching') return null;

  const notifId = stringToNumericId(`media-${media.id}`);
  const title = `Episode Baru Rilis: ${media.title}`;
  const body = `Hari ini adalah jadwal rilis episode terbaru ${media.title}! Tonton dan tambah progress tontonanmu.`;

  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: notifId,
          title,
          body,
          schedule: {
            on: {
              hour: 19,
              minute: 0,
            },
            allowWhileIdle: true,
          },
        },
      ],
    });

    await recordInAppNotification({
      title,
      message: body,
      category: 'media',
      relatedEntityId: media.id,
      actionType: 'increment_episode',
    });

    return notifId;
  } catch (err) {
    console.warn('Failed to schedule media reminder:', err);
    return null;
  }
}

/**
 * Cancels a scheduled native notification by ID
 */
export async function cancelNotification(notificationId: number): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    await LocalNotifications.cancel({
      notifications: [{ id: notificationId }],
    });
  } catch (err) {
    console.warn('Failed to cancel native notification:', err);
  }
}

