'use client';

import React, { useId } from 'react';
import { cn } from '@/app/lib/utils';

export interface NbInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const NbInput = React.forwardRef<HTMLInputElement, NbInputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
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
          {leftIcon && (
            <span className="absolute left-3 text-gray-500 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            disabled={disabled}
            className={cn(
              'w-full bg-white text-[#0A0A0A] font-medium text-sm rounded-xl border-[3px] border-[#0A0A0A]',
              'px-3.5 py-2.5 transition-all outline-none',
              'focus:shadow-[3px_3px_0px_#3B6FFF] focus:border-[#0A0A0A]',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              disabled && 'bg-gray-100 text-gray-400 cursor-not-allowed',
              error && 'border-[#FF3B30] focus:shadow-[3px_3px_0px_#FF3B30]',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-gray-500 flex items-center justify-center">
              {rightIcon}
            </span>
          )}
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

NbInput.displayName = 'NbInput';

