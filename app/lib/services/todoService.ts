import { db } from '@/app/lib/db';
import type { Todo, Subtask, TodoPriority, TodoRecurrence } from '@/app/lib/types';

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
}

export function getLocalTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function advanceDate(dateStr: string, recurrence: TodoRecurrence): string {
  const baseDate = new Date(dateStr);
  if (isNaN(baseDate.getTime())) {
    return getLocalTodayDateString();
  }

  const nextDate = new Date(baseDate);
  if (recurrence === 'daily') {
    nextDate.setDate(nextDate.getDate() + 1);
  } else if (recurrence === 'weekly') {
    nextDate.setDate(nextDate.getDate() + 7);
  } else if (recurrence === 'monthly') {
    nextDate.setMonth(nextDate.getMonth() + 1);
  }

  const year = nextDate.getFullYear();
  const month = String(nextDate.getMonth() + 1).padStart(2, '0');
  const day = String(nextDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * todoService - To-Do & Subtasks CRUD Operations with Offline Dexie.js
 */

export async function createTodo(data: {
  title: string;
  description?: string | null;
  priority?: TodoPriority;
  category?: string;
  dueDate?: string | null;
  reminderTime?: string | null;
  pinToHomeWidget?: boolean;
  recurrence?: TodoRecurrence;
  subtasks?: string[];
}): Promise<string> {
  const id = generateId();
  const now = new Date().toISOString();

  const formattedSubtasks: Subtask[] = (data.subtasks || []).map((st) => ({
    id: generateId(),
    title: st.trim(),
    isDone: false,
  }));

  const newTodo: Todo = {
    id,
    title: data.title.trim(),
    description: data.description?.trim() || null,
    priority: data.priority || 'medium',
    category: data.category?.trim() || 'Pribadi',
    dueDate: data.dueDate || getLocalTodayDateString(),
    reminderTime: data.reminderTime || null,
    isCompleted: false,
    pinToHomeWidget: data.pinToHomeWidget || false,
    recurrence: data.recurrence || 'none',
    subtasks: formattedSubtasks,
    createdAt: now,
    updatedAt: now,
  };

  await db.todos.add(newTodo);
  return id;
}

export async function toggleTodoStatus(id: string): Promise<void> {
  const todo = await db.todos.get(id);
  if (!todo) return;

  const now = new Date().toISOString();

  if (!todo.isCompleted) {
    // Marking as completed
    if (todo.recurrence && todo.recurrence !== 'none') {
      // Recurring task: advance due date & reset subtasks
      const currentDueDate = todo.dueDate || getLocalTodayDateString();
      const nextDueDate = advanceDate(currentDueDate, todo.recurrence);
      const resetSubtasks = todo.subtasks.map((st) => ({ ...st, isDone: false }));

      await db.todos.update(id, {
        dueDate: nextDueDate,
        isCompleted: false, // remains active for the next occurrence
        subtasks: resetSubtasks,
        updatedAt: now,
      });
    } else {
      // Non-recurring task: mark done & mark all subtasks done
      const completedSubtasks = todo.subtasks.map((st) => ({ ...st, isDone: true }));
      await db.todos.update(id, {
        isCompleted: true,
        subtasks: completedSubtasks,
        updatedAt: now,
      });
    }
  } else {
    // Re-opening completed task
    await db.todos.update(id, {
      isCompleted: false,
      updatedAt: now,
    });
  }
}

export async function toggleSubtask(todoId: string, subtaskId: string): Promise<void> {
  const todo = await db.todos.get(todoId);
  if (!todo) return;

  const updatedSubtasks = todo.subtasks.map((st) => {
    if (st.id === subtaskId) {
      return { ...st, isDone: !st.isDone };
    }
    return st;
  });

  // If all subtasks are done, consider task auto-completed (or leave as is)
  const allSubtasksDone =
    updatedSubtasks.length > 0 && updatedSubtasks.every((st) => st.isDone);

  await db.todos.update(todoId, {
    subtasks: updatedSubtasks,
    isCompleted: allSubtasksDone ? true : todo.isCompleted,
    updatedAt: new Date().toISOString(),
  });
}

export async function addSubtask(todoId: string, title: string): Promise<void> {
  const todo = await db.todos.get(todoId);
  if (!todo || !title.trim()) return;

  const newSubtask: Subtask = {
    id: generateId(),
    title: title.trim(),
    isDone: false,
  };

  await db.todos.update(todoId, {
    subtasks: [...todo.subtasks, newSubtask],
    updatedAt: new Date().toISOString(),
  });
}

export async function togglePinWidget(todoId: string): Promise<void> {
  const todo = await db.todos.get(todoId);
  if (!todo) return;

  await db.todos.update(todoId, {
    pinToHomeWidget: !todo.pinToHomeWidget,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteTodo(id: string): Promise<void> {
  await db.todos.delete(id);
}

