'use client';

import React, { useEffect } from 'react';
import { IconX } from '@tabler/icons-react';
import { cn } from '@/app/lib/utils';

export interface NbModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export const NbModal: React.FC<NbModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  showCloseButton = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={cn(
          'relative w-full max-w-md bg-[#FFFDF7] dark:bg-[var(--theme-surface)] text-[#0A0A0A] dark:text-[var(--theme-text-primary)] rounded-2xl border-[3px] border-[#0A0A0A] dark:border-[var(--theme-border)] shadow-[6px_6px_0px_#0A0A0A] dark:shadow-[6px_6px_0px_#000000] p-5 animate-in zoom-in-95 duration-150',
          className
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#0A0A0A] dark:border-[var(--theme-border-subtle)]">
            {title ? (
              <h2 className="text-lg font-black tracking-tight text-[#0A0A0A] dark:text-[var(--theme-text-primary)]">
                {title}
              </h2>
            ) : (
              <span />
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FF3B30] text-white border-2 border-[#0A0A0A] dark:border-[var(--theme-border-subtle)] shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#000000] hover:bg-[#E02E24] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              >
                <IconX className="w-5 h-5 stroke-[3]" />
              </button>
            )}
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};
