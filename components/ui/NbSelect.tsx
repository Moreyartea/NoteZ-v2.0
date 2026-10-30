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
            className="text-sm font-bold text-[#0A0A0A] tracking-tight"
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
              'w-full bg-white text-[#0A0A0A] font-medium text-sm rounded-xl border-[3px] border-[#0A0A0A]',
              'px-3.5 py-2.5 pr-10 appearance-none transition-all outline-none cursor-pointer',
              'focus:shadow-[3px_3px_0px_#3B6FFF] focus:border-[#0A0A0A]',
              disabled && 'bg-gray-100 text-gray-400 cursor-not-allowed',
              error && 'border-[#FF3B30] focus:shadow-[3px_3px_0px_#FF3B30]',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <span className="absolute right-3.5 pointer-events-none text-[#0A0A0A]">
            <IconChevronDown className="w-5 h-5 stroke-[2.5]" />
          </span>
        </div>
        {error ? (
          <p className="text-xs font-semibold text-[#FF3B30]">{error}</p>
        ) : hint ? (
          <p className="text-xs text-gray-600">{hint}</p>
        ) : null}
      </div>
    );
  }
);

NbSelect.displayName = 'NbSelect';
