'use client';

import React, { useState } from 'react';
import { NbModal } from './NbModal';
import { IconAlertTriangle, IconTrash, IconInfoCircle } from '@tabler/icons-react';

export interface NbConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export const NbConfirmModal: React.FC<NbConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Ya, Hapus',
  cancelText = 'Batal',
  variant = 'danger',
  isLoading: externalLoading,
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = externalLoading !== undefined ? externalLoading : internalLoading;

  const handleConfirm = async () => {
    try {
      setInternalLoading(true);
      await onConfirm();
      onClose();
    } catch (err) {
      console.error('Confirmation action error:', err);
    } finally {
      setInternalLoading(false);
    }
  };

  const getVariantIcon = () => {
    switch (variant) {
      case 'warning':
        return (
          <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-950/40 border-2 border-[#0A0A0A] dark:border-[var(--theme-border-subtle)] flex items-center justify-center flex-shrink-0 text-yellow-600 dark:text-yellow-400 shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000]">
            <IconAlertTriangle className="w-6 h-6 stroke-[2.5]" />
          </div>
        );
      case 'primary':
        return (
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/40 border-2 border-[#0A0A0A] dark:border-[var(--theme-border-subtle)] flex items-center justify-center flex-shrink-0 text-[#3B6FFF] dark:text-blue-400 shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000]">
            <IconInfoCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
        );
      case 'danger':
      default:
        return (
          <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/40 border-2 border-[#0A0A0A] dark:border-[var(--theme-border-subtle)] flex items-center justify-center flex-shrink-0 text-[#FF3B30] dark:text-red-400 shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000]">
            <IconTrash className="w-6 h-6 stroke-[2.5]" />
          </div>
        );
    }
  };

  const getConfirmButtonClasses = () => {
    switch (variant) {
      case 'warning':
        return 'bg-[#FFE135] text-[#0A0A0A] hover:bg-yellow-400';
      case 'primary':
        return 'bg-[#3B6FFF] text-white hover:bg-blue-600';
      case 'danger':
      default:
        return 'bg-[#FF3B30] text-white hover:bg-red-600';
    }
  };

  return (
    <NbModal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3.5">
          {getVariantIcon()}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-black text-[#0A0A0A] dark:text-[var(--theme-text-primary)] leading-snug">
              {title}
            </h3>
            <p className="mt-1 text-xs font-medium text-gray-700 dark:text-[var(--theme-text-muted)] leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t-2 border-[#0A0A0A]/10 dark:border-[var(--theme-border-subtle)]">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-black rounded-xl bg-white dark:bg-[var(--theme-surface-elevated)] text-[#0A0A0A] dark:text-[var(--theme-text-primary)] border-2 border-[#0A0A0A] dark:border-[var(--theme-border)] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000] hover:bg-gray-50 active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`px-4 py-2 text-xs font-black rounded-xl border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer disabled:opacity-50 ${getConfirmButtonClasses()}`}
          >
            {loading ? 'Memproses...' : confirmText}
          </button>
        </div>
      </div>
    </NbModal>
  );
};
