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
          'relative w-full max-w-md bg-white dark:bg-[var(--theme-surface,#1E1E1E)] text-[#0A0A0A] dark:text-[var(--theme-text-primary,#F4F4F0)] rounded-2xl border-[3px] border-[#0A0A0A] dark:border-[var(--theme-border,#2E2E2E)] shadow-[6px_6px_0px_#0A0A0A] dark:shadow-[6px_6px_0px_#000000] p-5 animate-in zoom-in-95 duration-150',
          className
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#0A0A0A]">
            {title ? (
              <h2 className="text-lg font-extrabold tracking-tight text-[#0A0A0A]">
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
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FF3B30] text-white border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:bg-[#E02E24] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
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

