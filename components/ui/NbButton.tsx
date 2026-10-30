'use client';

import React from 'react';
import { IconLoader2 } from '@tabler/icons-react';
import { cn } from '@/app/lib/utils';

export type NbButtonVariant =
  | 'primary'
  | 'secondary'
  | 'finance'
  | 'danger'
  | 'warning'
  | 'media'
  | 'wishlist'
  | 'neutral'
  | 'ghost';

export type NbButtonSize = 'sm' | 'md' | 'lg';

export interface NbButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: NbButtonVariant;
  size?: NbButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<NbButtonVariant, string> = {
  primary:
    'bg-[#FFE135] text-[#0A0A0A] hover:bg-[#FDD835]',
  secondary:
    'bg-[#3B6FFF] text-white hover:bg-[#2F5DE0]',
  finance:
    'bg-[#00E676] text-[#0A0A0A] hover:bg-[#00C853]',
  danger:
    'bg-[#FF3B30] text-white hover:bg-[#E02E24]',
  warning:
    'bg-[#FF6B2B] text-white hover:bg-[#E65A1E]',
  media:
    'bg-[#A855F7] text-white hover:bg-[#9333EA]',
  wishlist:
    'bg-[#FF4DA6] text-white hover:bg-[#EC4899]',
  neutral:
    'bg-white text-[#0A0A0A] hover:bg-[#F5F5F5]',
  ghost:
    'bg-transparent text-[#0A0A0A] hover:bg-black/5 shadow-none active:shadow-none border-2',
};

const sizeStyles: Record<NbButtonSize, string> = {
  sm: 'text-xs py-1.5 px-3 min-h-[34px] gap-1.5 rounded-lg',
  md: 'text-sm py-2 px-4 min-h-[44px] gap-2 rounded-xl',
  lg: 'text-base py-3 px-6 min-h-[52px] gap-2.5 rounded-xl',
};

export const NbButton = React.forwardRef<HTMLButtonElement, NbButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const isGhost = variant === 'ghost';
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-bold select-none transition-all duration-75',
          isGhost
            ? 'border-2 border-[#0A0A0A] active:translate-x-[1px] active:translate-y-[1px]'
            : 'border-[3px] border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#0A0A0A]',
          variantStyles[variant],
          sizeStyles[size],
          isDisabled && 'opacity-60 cursor-not-allowed active:translate-x-0 active:translate-y-0 active:shadow-[4px_4px_0px_#0A0A0A]',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <IconLoader2 className="w-4 h-4 animate-spin" />
            <span>Memuat...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex items-center">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex items-center">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

NbButton.displayName = 'NbButton';
