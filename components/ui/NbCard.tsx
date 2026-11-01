'use client';

import React from 'react';
import { cn } from '@/app/lib/utils';

export interface NbCardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
  bgColor?: string;
}

const paddingStyles = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const NbCard = React.forwardRef<HTMLDivElement, NbCardProps>(
  (
    {
      className,
      padding = 'md',
      hoverEffect = false,
      bgColor,
      style,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        data-card="true"
        style={{
          backgroundColor: bgColor || 'var(--theme-surface)',
          borderColor: 'var(--theme-border)',
          color: 'var(--theme-text-primary)',
          ...style,
        }}
        className={cn(
          'nb-card border-[3px] border-[#0A0A0A] dark:border-[var(--theme-border)] shadow-[4px_4px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_#000000] rounded-2xl bg-[var(--theme-surface)] text-[var(--theme-text-primary)] transition-colors',
          paddingStyles[padding],
          hoverEffect &&
            'transition-transform duration-100 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#0A0A0A] dark:hover:shadow-[6px_6px_0px_#000000]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NbCard.displayName = 'NbCard';

