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
        const relatedId =
          notification.extra?.relatedEntityId || notification.extra?.todoId || null;

        if (relatedId) {
          const existing = await db.notifications
            .where('relatedEntityId')
            .equals(relatedId)
            .first();

          if (!existing) {
            await recordInAppNotification({
              title: notification.title || 'Pengingat NoteZ',
              message: notification.body || '',
              category: (notification.extra?.category as NotificationCategory) || 'todo',
              relatedEntityId: relatedId,
              actionType: (notification.extra?.actionType as NotificationActionType) || 'complete_todo',
            });
          }
        } else {
          await recordInAppNotification({
            title: notification.title || 'Pengingat NoteZ',
            message: notification.body || '',
            category: (notification.extra?.category as NotificationCategory) || 'system',
          });
        }
      }
    );

    await LocalNotifications.addListener(
      'localNotificationActionPerformed',
      async (action) => {
        const notif = action.notification;
        const relatedId = notif.extra?.relatedEntityId || notif.extra?.todoId;
        if (relatedId) {
          const matched = await db.notifications
            .where('relatedEntityId')
            .equals(relatedId)
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

  // Deduplicate: avoid writing duplicate notification for same relatedEntityId
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
            smallIcon: 'ic_stat_notez',
            iconColor: '#FFE135',
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
  const reminderTime = todo.reminderTime || '09:00';
  const [year, month, day] = todo.dueDate.split('-').map(Number);
  const [hour, minute] = reminderTime.split(':').map(Number);
  let scheduledDate = new Date(year, month - 1, day, hour, minute, 0, 0);

  const now = Date.now();
  const diffMs = now - scheduledDate.getTime();

  // If scheduledDate is in current minute (diff < 60s), advance to now + 3s so AlarmManager doesn't discard as past
  if (scheduledDate.getTime() <= now && diffMs >= 0 && diffMs < 60000) {
    scheduledDate = new Date(now + 3000);
  }

  const title = `⏰ Pengingat Tugas: ${todo.title}`;
  const body =
    todo.description ||
    `Kategori: ${todo.category} • Prioritas: ${todo.priority.toUpperCase()}`;

  try {
    await ensureNotificationChannel();

    // Only schedule native OS alarm if scheduled time is in future
    if (scheduledDate.getTime() > Date.now()) {
      if (Capacitor.isNativePlatform()) {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: notifId,
              channelId: HIGH_PRIORITY_CHANNEL_ID,
              title,
              body,
              schedule: {
                at: scheduledDate,
                allowWhileIdle: true,
              },
              sound: 'beep.wav',
              smallIcon: 'ic_stat_notez',
              iconColor: '#FFE135',
              extra: {
                todoId: todo.id,
                relatedEntityId: todo.id,
                category: 'todo',
                actionType: 'complete_todo',
              },
            },
          ],
        });
      }
    } else {
      // Past deadline: immediately record into in-app drawer
      await recordInAppNotification({
        title,
        message: body,
        category: 'todo',
        relatedEntityId: todo.id,
        actionType: 'complete_todo',
      });
    }

    return notifId;
  } catch (err) {
    console.warn('Failed to schedule native todo reminder:', err);
    return null;
  }
}

/**
 * Alias for scheduleTodoReminder
 */
export const scheduleTodoNotification = scheduleTodoReminder;

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
            smallIcon: 'ic_stat_notez',
            iconColor: '#FFE135',
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
 * Checks uncompleted tasks with dueDate and reminderTime where scheduledDate <= Date.now()
 */
export async function syncDueNotificationsToDrawer(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const uncompletedTodos = await db.todos
      .filter((t) => !t.isCompleted && Boolean(t.dueDate))
      .toArray();

    const now = Date.now();

    for (const todo of uncompletedTodos) {
      if (!todo.dueDate) continue;
      const [year, month, day] = todo.dueDate.split('-').map(Number);
      const reminderTime = todo.reminderTime || '09:00';
      const [hour, minute] = reminderTime.split(':').map(Number);
      const scheduledDate = new Date(year, month - 1, day, hour, minute, 0, 0);

      // Task is due or past due
      if (scheduledDate.getTime() <= now) {
        const existing = await db.notifications
          .where('relatedEntityId')
          .equals(todo.id)
          .first();

        if (!existing) {
          await recordInAppNotification({
            title: `⏰ Pengingat Tugas: ${todo.title}`,
            message:
              todo.description ||
              `Kategori: ${todo.category} • Prioritas: ${todo.priority.toUpperCase()}`,
            category: 'todo',
            relatedEntityId: todo.id,
            actionType: 'complete_todo',
          });
        }
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
            schedule: { at: new Date(Date.now() + 2000), allowWhileIdle: true },
            sound: 'beep.wav',
            smallIcon: 'ic_stat_notez',
            iconColor: '#FFE135',
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
