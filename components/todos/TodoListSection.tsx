'use client';

import React, { useState } from 'react';
import {
  IconCheck,
  IconPin,
  IconTrash,
  IconCalendar,
  IconRepeat,
  IconChevronDown,
  IconChevronUp,
} from '@tabler/icons-react';
import type { Todo, TodoPriority } from '@/app/lib/types';
import { NbCard } from '@/components/ui/NbCard';
import { NbBadge } from '@/components/ui/NbBadge';
import {
  toggleTodoStatus,
  toggleSubtask,
  togglePinWidget,
  deleteTodo,
  getLocalTodayDateString,
} from '@/app/lib/services/todoService';
import { cn } from '@/app/lib/utils';

export interface TodoListSectionProps {
  todos: Todo[];
  onOpenModal: () => void;
}

type FilterTab = 'all' | 'today' | 'upcoming' | 'completed';

export const TodoListSection: React.FC<TodoListSectionProps> = ({
  todos,
  onOpenModal,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedTodoIds, setExpandedTodoIds] = useState<Set<string>>(new Set());

  const todayStr = getLocalTodayDateString();

  const toggleExpand = (id: string) => {
    const next = new Set(expandedTodoIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedTodoIds(next);
  };

  // Filter items
  const filtered = todos.filter((todo) => {
    // Category check
    if (categoryFilter !== 'all' && todo.category !== categoryFilter) {
      return false;
    }

    // Tab check
    if (activeFilter === 'today') {
      return !todo.isCompleted && todo.dueDate === todayStr;
    }
    if (activeFilter === 'upcoming') {
      return !todo.isCompleted && todo.dueDate && todo.dueDate > todayStr;
    }
    if (activeFilter === 'completed') {
      return todo.isCompleted;
    }
    return true;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus tugas ini?')) {
      await deleteTodo(id);
    }
  };

  const getPriorityBadgeVariant = (priority: TodoPriority) => {
    switch (priority) {
      case 'high':
        return 'danger' as const;
      case 'medium':
        return 'warning' as const;
      case 'low':
      default:
        return 'secondary' as const;
    }
  };

  return (
    <div className="space-y-3">
      {/* Filter Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-white rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]">
        {[
          { id: 'all', label: 'Semua' },
          { id: 'today', label: 'Hari Ini' },
          { id: 'upcoming', label: 'Mendatang' },
          { id: 'completed', label: 'Selesai' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id as FilterTab)}
            className={cn(
              'py-1.5 text-xs font-black rounded-lg transition-all text-center cursor-pointer',
              activeFilter === tab.id
                ? 'bg-[#FFE135] text-[#0A0A0A] border-2 border-[#0A0A0A] shadow-[1.5px_1.5px_0px_#0A0A0A]'
                : 'text-gray-600 hover:text-[#0A0A0A]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category Pills Filter */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
        {['all', 'Kuliah', 'Kerja', 'Pribadi', 'Project'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={cn(
              'px-2.5 py-1 text-[11px] font-bold rounded-lg border-2 border-[#0A0A0A] transition-all cursor-pointer whitespace-nowrap',
              categoryFilter === cat
                ? 'bg-[#0A0A0A] text-white shadow-[1.5px_1.5px_0px_#0A0A0A]'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            )}
          >
            {cat === 'all' ? 'Semua Kategori' : cat}
          </button>
        ))}
      </div>

      {/* Todo Items List */}
      {filtered.length === 0 ? (
        <NbCard className="p-6 text-center text-gray-500">
          <p className="text-sm font-bold text-[#0A0A0A]">Belum ada tugas</p>
          <p className="text-xs text-gray-500 mt-1">
            Tekan "+ Tambah Tugas" untuk membuat catatan rencana barumu.
          </p>
        </NbCard>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((todo) => {
            const isOverdue =
              !todo.isCompleted && todo.dueDate && todo.dueDate < todayStr;
            const completedSubtasksCount = todo.subtasks.filter((st) => st.isDone).length;
            const isExpanded = expandedTodoIds.has(todo.id);

            return (
              <NbCard
                key={todo.id}
                className={cn(
                  'p-3.5 space-y-2 transition-all',
                  todo.isCompleted && 'bg-gray-50 opacity-80'
                )}
              >
                {/* Main Card Header */}
                <div className="flex items-start gap-3">
                  {/* Big Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleTodoStatus(todo.id)}
                    aria-label="Tandai Selesai"
                    className={cn(
                      'w-6 h-6 rounded-lg border-2 border-[#0A0A0A] flex items-center justify-center flex-shrink-0 mt-0.5 transition-all cursor-pointer',
                      todo.isCompleted
                        ? 'bg-[#00E676] shadow-none'
                        : 'bg-white shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px]'
                    )}
                  >
                    {todo.isCompleted && (
                      <IconCheck className="w-4 h-4 text-[#0A0A0A] stroke-[3.5]" />
                    )}
                  </button>

                  {/* Todo Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1">
                      <h3
                        className={cn(
                          'font-extrabold text-sm text-[#0A0A0A] leading-snug break-words',
                          todo.isCompleted && 'line-through text-gray-500'
                        )}
                      >
                        {todo.title}
                      </h3>

                      {/* Pin to Home Widget toggle */}
                      <button
                        type="button"
                        onClick={() => togglePinWidget(todo.id)}
                        title={
                          todo.pinToHomeWidget
                            ? 'Aktif di Widget HP'
                            : 'Pin ke Widget Layar HP'
                        }
                        className={cn(
                          'p-1 rounded-md border border-[#0A0A0A] transition-all cursor-pointer flex-shrink-0',
                          todo.pinToHomeWidget
                            ? 'bg-[#FFE135] shadow-[1px_1px_0px_#0A0A0A]'
                            : 'bg-gray-100 text-gray-400 hover:text-black'
                        )}
                      >
                        <IconPin className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {todo.description && (
                      <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                        {todo.description}
                      </p>
                    )}

                    {/* Badges row */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <NbBadge variant={getPriorityBadgeVariant(todo.priority)}>
                        {todo.priority.toUpperCase()}
                      </NbBadge>

                      <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-300">
                        {todo.category}
                      </span>

                      {todo.recurrence && todo.recurrence !== 'none' && (
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded border border-purple-300 flex items-center gap-0.5">
                          <IconRepeat className="w-3 h-3" />
                          {todo.recurrence}
                        </span>
                      )}

                      {todo.dueDate && (
                        <span
                          className={cn(
                            'text-[10px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-0.5',
                            isOverdue
                              ? 'bg-red-100 text-red-700 border-red-300'
                              : 'bg-yellow-50 text-gray-700 border-yellow-300'
                          )}
                        >
                          <IconCalendar className="w-3 h-3" />
                          {isOverdue ? 'Terlambat: ' : ''}
                          {todo.dueDate}
                          {todo.reminderTime ? ` ${todo.reminderTime}` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subtasks Accordion (if any) */}
                {todo.subtasks.length > 0 && (
                  <div className="pt-2 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => toggleExpand(todo.id)}
                      className="w-full flex items-center justify-between text-xs font-bold text-gray-700 hover:text-[#0A0A0A] py-0.5 cursor-pointer"
                    >
                      <span>
                        Sub-tugas: {completedSubtasksCount} / {todo.subtasks.length} Selesai
                      </span>
                      {isExpanded ? (
                        <IconChevronUp className="w-4 h-4" />
                      ) : (
                        <IconChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 space-y-1.5 pl-2 border-l-2 border-[#0A0A0A]/30">
                        {todo.subtasks.map((st) => (
                          <div
                            key={st.id}
                            onClick={() => toggleSubtask(todo.id, st.id)}
                            className="flex items-center gap-2 cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              checked={st.isDone}
                              onChange={() => {}}
                              className="w-4 h-4 accent-[#00E676] cursor-pointer"
                            />
                            <span
                              className={cn(
                                'text-xs font-medium text-gray-800',
                                st.isDone && 'line-through text-gray-400'
                              )}
                            >
                              {st.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Card Action */}
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => handleDelete(todo.id)}
                    title="Hapus tugas"
                    className="p-1 rounded text-gray-400 hover:text-red-500 transition-all cursor-pointer"
                  >
                    <IconTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </NbCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
