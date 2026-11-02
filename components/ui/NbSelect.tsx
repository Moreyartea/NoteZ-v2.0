'use client';

import React, { useId } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { cn } from '@/app/lib/utils';

export interface NbSelectOption {
  value: string;
  label: string;
}

export interface NbSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options?: NbSelectOption[];
}

export const NbSelect = React.forwardRef<HTMLSelectElement, NbSelectProps>(
  (
    {
      className,
      label,
      error,
      hint,
      options,
      children,
      id: externalId,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = externalId || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-black uppercase tracking-wider text-[#0A0A0A] dark:text-[var(--theme-text-primary)]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={id}
            disabled={disabled}
            className={cn(
              'w-full bg-white dark:bg-[var(--theme-surface-elevated)] text-[#0A0A0A] dark:text-[var(--theme-text-primary)] font-medium text-sm rounded-xl border-[2.5px] border-[#0A0A0A] dark:border-[var(--theme-border)]',
              'px-3.5 py-2.5 pr-10 appearance-none transition-all outline-none cursor-pointer',
              'focus:shadow-[3px_3px_0px_#3B6FFF] focus:border-[#0A0A0A] dark:focus:border-[#3B6FFF]',
              disabled && 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 cursor-not-allowed',
              error && 'border-[#FF3B30] focus:shadow-[3px_3px_0px_#FF3B30]',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-white dark:bg-[#16181D] text-[#0A0A0A] dark:text-white"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <span className="absolute right-3.5 pointer-events-none text-[#0A0A0A] dark:text-[var(--theme-text-primary)]">
            <IconChevronDown className="w-5 h-5 stroke-[2.5]" />
          </span>
        </div>
        {error ? (
          <p className="text-xs font-semibold text-[#FF3B30]">{error}</p>
        ) : hint ? (
          <p className="text-xs text-gray-600 dark:text-[var(--theme-text-muted)]">{hint}</p>
        ) : null}
      </div>
    );
  }
);

NbSelect.displayName = 'NbSelect';
