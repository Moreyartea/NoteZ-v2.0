import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { db } from '@/app/lib/db';
import type {
  Todo,
  MediaItem,
  NotificationCategory,
  NotificationActionType,
} from '@/app/lib/types';
import { getLocalTodayDateString } from './todoService';

export const HIGH_PRIORITY_CHANNEL_ID = 'notez_channel_high';

/**
 * Generates standard unique string ID for Dexie database records
 */
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
}

/**
 * Generates a valid 32-bit positive integer ID for Android LocalNotifications (Max: 2147483647)
 */
export function generateNumericNotificationId(seed?: string): number {
  if (seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const safeInt = Math.abs(hash) % 2147400000;
    return safeInt === 0 ? 100001 : safeInt;
  }
  return Math.floor(100000 + Math.random() * 899999);
}

/**
 * Creates and verifies the Android Notification Channel (Required for Android 8+)
 */
export async function ensureNotificationChannel(): Promise<void> {
  if (typeof window === 'undefined' || !Capacitor.isNativePlatform()) return;

  try {
    await LocalNotifications.createChannel({
      id: HIGH_PRIORITY_CHANNEL_ID,
      name: 'Pengingat & Alarm NoteZ',
      description: 'Notifikasi pengingat tugas harian, checklist habit, dan catatan penting NoteZ',
      importance: 5, // High/Max importance
      visibility: 1, // Public visibility on lockscreen
      sound: 'beep.wav',
      vibration: true,
      lights: true,
      lightColor: '#FFE135',
    });
  } catch (err) {
    console.warn('Failed to create native notification channel:', err);
  }
}

/**
 * Registers native notification listeners to capture background/foreground triggers
 */
let listenersInitialized = false;
export async function initNotificationListeners(): Promise<void> {
  if (typeof window === 'undefined' || !Capacitor.isNativePlatform() || listenersInitialized) {
    return;
  }

  try {
    await ensureNotificationChannel();

    await LocalNotifications.addListener(
      'localNotificationReceived',
      async (notification) => {
        // Record into In-App Notification drawer upon native arrival
        const existing = notification.extra?.relatedEntityId
          ? await db.notifications
              .where('relatedEntityId')
              .equals(notification.extra.relatedEntityId)
              .first()
          : null;

        if (!existing) {
          await recordInAppNotification({
            title: notification.title || 'Pengingat NoteZ',
            message: notification.body || '',
            category: (notification.extra?.category as NotificationCategory) || 'system',
            relatedEntityId: notification.extra?.relatedEntityId || null,
            actionType: (notification.extra?.actionType as NotificationActionType) || null,
          });
        }
      }
    );

    await LocalNotifications.addListener(
      'localNotificationActionPerformed',
      async (action) => {
        const notif = action.notification;
        if (notif.extra?.relatedEntityId) {
          const matched = await db.notifications
            .where('relatedEntityId')
            .equals(notif.extra.relatedEntityId)
            .first();
          if (matched && !matched.isRead) {
            await db.notifications.update(matched.id, { isRead: true });
          }
        }
      }
    );

    listenersInitialized = true;
  } catch (err) {
    console.warn('Failed to initialize local notification listeners:', err);
  }
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

  // Deduplicate: avoid writing duplicate notification for same relatedEntityId within same day
  if (data.relatedEntityId) {
    const existing = await db.notifications
      .where('relatedEntityId')
      .equals(data.relatedEntityId)
      .first();

    if (existing) {
      // Update message & timestamp without bloating unread drawer
      await db.notifications.update(existing.id, {
        title: data.title.trim(),
        message: data.message.trim(),
        createdAt: now,
      });
      return existing.id;
    }
  }

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
 * Requests Notification Permission (Android 13+ / Browser Web Notification)
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // 1. Native Capacitor Request
  if (Capacitor.isNativePlatform()) {
    try {
      await ensureNotificationChannel();
      const status = await LocalNotifications.requestPermissions();
      return status.display === 'granted';
    } catch (err) {
      console.warn('Native local notifications permission request failed:', err);
      return false;
    }
  }

  // 2. Web Browser Fallback
  if ('Notification' in window) {
    try {
      const perm = await Notification.requestPermission();
      return perm === 'granted';
    } catch (err) {
      console.warn('Web notification permission request failed:', err);
      return false;
    }
  }

  return false;
}

/**
 * Schedules daily review reminder at specified hour/minute (e.g. 20:00 WIB)
 */
export async function scheduleDailyReviewNotification(
  hour: number = 20,
  minute: number = 0
): Promise<void> {
  if (typeof window === 'undefined') return;

  const notifId = 999901; // Reserved 32-bit ID for daily review
  const title = 'Waktunya Catat Keuangan & Habit!';
  const body = 'Buka NoteZ sekarang untuk mencatat pengeluaran hari ini dan menuntaskan checklist habit harianmu.';

  try {
    await ensureNotificationChannel();

    if (Capacitor.isNativePlatform()) {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: notifId,
            channelId: HIGH_PRIORITY_CHANNEL_ID,
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
            extra: {
              category: 'system',
            },
          },
        ],
      });
    }

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

  const notifId = generateNumericNotificationId(todo.id);
  const timeStr = todo.reminderTime || '09:00';
  const [hour, minute] = timeStr.split(':').map((v) => parseInt(v, 10) || 0);

  const [y, m, d] = todo.dueDate.split('-').map((v) => parseInt(v, 10));
  const triggerDate = new Date(y, m - 1, d, hour, minute, 0);

  const title = `Pengingat Tugas: ${todo.title}`;
  const body = `Tugas kategori ${todo.category} harus diselesaikan sebelum deadline!`;

  try {
    await ensureNotificationChannel();

    // Only schedule OS alarm if trigger time is in future
    if (triggerDate.getTime() > Date.now()) {
      if (Capacitor.isNativePlatform()) {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: notifId,
              channelId: HIGH_PRIORITY_CHANNEL_ID,
              title,
              body,
              schedule: {
                at: triggerDate,
                allowWhileIdle: true,
              },
              sound: 'beep.wav',
              extra: {
                category: 'todo',
                relatedEntityId: todo.id,
                actionType: 'complete_todo',
              },
            },
          ],
        });
      }
    }

    // Always record active task reminder in in-app drawer
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

  const notifId = generateNumericNotificationId(`media-${media.id}`);
  const title = `Episode Baru Rilis: ${media.title}`;
  const body = `Hari ini jadwal rilis episode terbaru ${media.title}! Tonton dan update progress tontonanmu.`;

  try {
    await ensureNotificationChannel();

    if (Capacitor.isNativePlatform()) {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: notifId,
            channelId: HIGH_PRIORITY_CHANNEL_ID,
            title,
            body,
            schedule: {
              on: {
                hour: 19,
                minute: 0,
              },
              allowWhileIdle: true,
            },
            sound: 'beep.wav',
            extra: {
              category: 'media',
              relatedEntityId: media.id,
              actionType: 'increment_episode',
            },
          },
        ],
      });
    }

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
  if (typeof window === 'undefined' || !Capacitor.isNativePlatform()) return;
  try {
    await LocalNotifications.cancel({
      notifications: [{ id: notificationId }],
    });
  } catch (err) {
    console.warn('Failed to cancel native notification:', err);
  }
}

/**
 * Scans all active due tasks and synchronizes them to the in-app drawer
 */
export async function syncDueNotificationsToDrawer(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const todayStr = getLocalTodayDateString();
    const activeTodos = await db.todos
      .filter((t) => !t.isCompleted && Boolean(t.dueDate) && t.dueDate! <= todayStr)
      .toArray();

    for (const todo of activeTodos) {
      const existing = await db.notifications
        .where('relatedEntityId')
        .equals(todo.id)
        .first();

      if (!existing) {
        await recordInAppNotification({
          title: `Pengingat Tugas: ${todo.title}`,
          message: `Tugas kategori ${todo.category} harus diselesaikan (Jatuh tempo: ${todo.dueDate}).`,
          category: 'todo',
          relatedEntityId: todo.id,
          actionType: 'complete_todo',
        });
      }
    }
  } catch (err) {
    console.warn('Failed to sync due notifications to drawer:', err);
  }
}

/**
 * Triggers an immediate test notification (Native OS + Web Fallback + In-App Drawer)
 */
export async function triggerTestNotification(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const notifId = generateNumericNotificationId();
  const title = 'Uji Notifikasi Berhasil!';
  const message = 'Notifikasi lokal NoteZ v2.0 aktif dan siap mengingatkan jadwal harianmu.';

  try {
    await requestNotificationPermission();
    await ensureNotificationChannel();

    // 1. Android Native Local Notification
    if (Capacitor.isNativePlatform()) {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: notifId,
            channelId: HIGH_PRIORITY_CHANNEL_ID,
            title,
            body: message,
            schedule: { at: new Date(Date.now() + 2000) },
            sound: 'beep.wav',
            extra: { category: 'system' },
          },
        ],
      });
    } else if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      // 2. Web Browser Fallback
      new Notification(title, {
        body: message,
        icon: '/logo_app.svg',
      });
    }
  } catch (err) {
    console.warn('Native local notification test failed, recording in-app only:', err);
  }

  // 3. Immediately record in Dexie DB for In-App Drawer & Bell Badge
  await recordInAppNotification({
    title,
    message,
    category: 'system',
  });

  return true;
}
