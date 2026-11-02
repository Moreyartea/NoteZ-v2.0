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
  IconSchool,
  IconBriefcase,
  IconUser,
  IconRocket,
  IconLayersLinked,
} from '@tabler/icons-react';
import type { Todo, TodoPriority } from '@/app/lib/types';
import { NbCard } from '@/components/ui/NbCard';
import { NbBadge } from '@/components/ui/NbBadge';
import { NbConfirmModal } from '@/components/ui/NbConfirmModal';
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
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      setIsDeleting(true);
      await deleteTodo(pendingDeleteId);
      setPendingDeleteId(null);
    } finally {
      setIsDeleting(false);
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

  const getCategoryIconBadge = (cat: string) => {
    switch (cat) {
      case 'Kuliah':
        return {
          icon: IconSchool,
          label: 'Kuliah',
          className: 'bg-blue-100 text-[#3B6FFF] border-[#3B6FFF]',
        };
      case 'Kerja':
        return {
          icon: IconBriefcase,
          label: 'Kerja',
          className: 'bg-yellow-100 text-[#0A0A0A] border-[#FFE135]',
        };
      case 'Pribadi':
        return {
          icon: IconUser,
          label: 'Pribadi',
          className: 'bg-emerald-100 text-[#00A854] border-[#00E676]',
        };
      case 'Project':
        return {
          icon: IconRocket,
          label: 'Project',
          className: 'bg-purple-100 text-[#8B5CF6] border-[#A855F7]',
        };
      default:
        return {
          icon: IconCheck,
          label: cat,
          className: 'bg-gray-100 text-gray-700 border-gray-300',
        };
    }
  };

  const todoCategoryFilters = [
    { id: 'all', label: 'Semua', icon: IconLayersLinked, color: '#0A0A0A', bg: 'bg-white' },
    { id: 'Kuliah', label: 'Kuliah', icon: IconSchool, color: '#3B6FFF', bg: 'bg-blue-50' },
    { id: 'Kerja', label: 'Kerja', icon: IconBriefcase, color: '#0A0A0A', bg: 'bg-yellow-100' },
    { id: 'Pribadi', label: 'Pribadi', icon: IconUser, color: '#00A854', bg: 'bg-emerald-50' },
    { id: 'Project', label: 'Project', icon: IconRocket, color: '#8B5CF6', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-3">
      {/* Filter Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-white dark:bg-[var(--theme-surface)] rounded-xl border-2 border-[#0A0A0A] dark:border-[var(--theme-border)] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_var(--theme-shadow)]">
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
                ? 'bg-[#FFE135] dark:bg-[var(--theme-accent-primary)] text-[#0A0A0A] dark:text-[var(--theme-accent-text)] border-2 border-[#0A0A0A] dark:border-[var(--theme-border-hero)] shadow-[1.5px_1.5px_0px_#0A0A0A]'
                : 'text-gray-600 dark:text-[var(--theme-text-muted)] hover:text-[#0A0A0A] dark:hover:text-[var(--theme-text-primary)]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category Pills Filter (Colored Neo-Brutalism Icon Chips) */}
      <div className="flex gap-1.5 overflow-x-auto py-1 px-1 -mx-1 scrollbar-none">
        {todoCategoryFilters.map((cat) => {
          const Icon = cat.icon;
          const isSelected = categoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              title={`Kategori ${cat.label}`}
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-black rounded-lg border-2 transition-all cursor-pointer whitespace-nowrap select-none',
                isSelected
                  ? 'bg-[#0A0A0A] dark:bg-[var(--theme-accent-primary)] text-white dark:text-[var(--theme-accent-text)] border-[#0A0A0A] dark:border-[var(--theme-border-hero)] shadow-[2px_2px_0px_#0A0A0A]'
                  : 'bg-white dark:bg-[var(--theme-surface)] text-gray-800 dark:text-[var(--theme-text-primary)] border-[#0A0A0A] dark:border-[var(--theme-border-subtle)] shadow-[1.5px_1.5px_0px_#0A0A0A] dark:shadow-[1.5px_1.5px_0px_var(--theme-shadow)] active:translate-x-[1px] active:translate-y-[1px]'
              )}
            >
              <Icon
                className="w-3.5 h-3.5 stroke-[2.5]"
                style={{ color: isSelected ? 'inherit' : cat.color }}
              />
              <span className="text-[11px]">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Todo Items List */}
      {filtered.length === 0 ? (
        <NbCard className="p-6 text-center text-gray-500 dark:text-[var(--theme-text-muted)]">
          <p className="text-sm font-bold text-[#0A0A0A] dark:text-[var(--theme-text-primary)]">Belum ada tugas</p>
          <p className="text-xs text-gray-500 dark:text-[var(--theme-text-muted)] mt-1">
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
                  todo.isCompleted && 'opacity-80'
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
                      'w-6 h-6 rounded-lg border-2 border-[#0A0A0A] dark:border-[var(--theme-border-subtle)] flex items-center justify-center flex-shrink-0 mt-0.5 transition-all cursor-pointer',
                      todo.isCompleted
                        ? 'bg-[#00E676] shadow-none'
                        : 'bg-white dark:bg-[var(--theme-surface-elevated)] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[1px_1px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px]'
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
                          'font-extrabold text-sm leading-snug break-words',
                          todo.isCompleted
                            ? 'line-through text-gray-500 dark:text-gray-500'
                            : 'text-[#0A0A0A] dark:text-[var(--theme-text-primary)]'
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
                          'p-1 rounded-md border border-[#0A0A0A] dark:border-[var(--theme-border-subtle)] transition-all cursor-pointer flex-shrink-0',
                          todo.pinToHomeWidget
                            ? 'bg-[#FFE135] text-[#0A0A0A] shadow-[1px_1px_0px_#0A0A0A]'
                            : 'bg-gray-100 dark:bg-[var(--theme-surface-elevated)] text-gray-400 dark:text-[var(--theme-text-muted)] hover:text-black dark:hover:text-white'
                        )}
                      >
                        <IconPin className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {todo.description && (
                      <p className="text-xs text-gray-600 dark:text-[var(--theme-text-muted)] mt-0.5 line-clamp-2">
                        {todo.description}
                      </p>
                    )}

                    {/* Badges row */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <NbBadge variant={getPriorityBadgeVariant(todo.priority)}>
                        {todo.priority.toUpperCase()}
                      </NbBadge>

                      {(() => {
                        const catInfo = getCategoryIconBadge(todo.category);
                        const CatIcon = catInfo.icon;
                        return (
                          <span
                            title={`Kategori: ${catInfo.label}`}
                            className={cn(
                              'text-[10px] font-black uppercase px-1.5 py-0.5 rounded border inline-flex items-center gap-1 shadow-[1px_1px_0px_#0A0A0A]',
                              catInfo.className
                            )}
                          >
                            <CatIcon className="w-3 h-3 stroke-[2.5]" />
                            <span>{catInfo.label}</span>
                          </span>
                        );
                      })()}

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
                              : 'bg-yellow-50 dark:bg-[var(--theme-surface-elevated)] text-gray-700 dark:text-[var(--theme-text-muted)] border-yellow-300 dark:border-[var(--theme-border-subtle)]'
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
                  <div className="pt-2 border-t-2 border-[#0A0A0A]/20 dark:border-[var(--theme-border-subtle)]">
                    <button
                      type="button"
                      onClick={() => toggleExpand(todo.id)}
                      className="w-full flex items-center justify-between text-xs font-bold text-gray-700 dark:text-[var(--theme-text-muted)] hover:text-[#0A0A0A] dark:hover:text-[var(--theme-text-primary)] py-0.5 cursor-pointer"
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
                      <div className="mt-2 space-y-1.5 pl-2 border-l-2 border-[#0A0A0A]/30 dark:border-[var(--theme-border-subtle)]">
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
                                'text-xs font-medium',
                                st.isDone
                                   ? 'line-through text-gray-400 dark:text-gray-500'
                                   : 'text-gray-800 dark:text-[var(--theme-text-primary)]'
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
                <div className="flex justify-end pt-1 border-t-2 border-[#0A0A0A]/10 dark:border-[var(--theme-border-subtle)]">
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

      {/* Confirmation Modal */}
      <NbConfirmModal
        isOpen={!!pendingDeleteId}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="HAPUS TUGAS"
        message="Apakah kamu yakin ingin menghapus tugas ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
