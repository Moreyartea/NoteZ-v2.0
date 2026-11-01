'use client';

import React from 'react';
import { cn } from '@/app/lib/utils';

export interface NbCardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
  bgColor?: string;
  isHero?: boolean;
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
      isHero = false,
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
        data-hero={isHero ? 'true' : undefined}
        style={{
          ...(bgColor ? ({ '--nb-card-bg-custom': bgColor } as React.CSSProperties) : {}),
          ...style,
        }}
        className={cn(
          'nb-card border-[3px] border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] rounded-2xl text-[var(--theme-text-primary)] transition-colors',
          bgColor ? 'bg-[var(--nb-card-bg-custom)]' : 'bg-[var(--theme-surface)]',
          isHero
            ? 'dark:!bg-[var(--theme-surface)] dark:border-[var(--theme-border-hero)] dark:text-[var(--theme-text-primary)] dark:shadow-[4px_4px_0px_var(--theme-shadow)]'
            : 'dark:border-[var(--theme-border)] dark:bg-[var(--theme-surface)] dark:text-[var(--theme-text-primary)] dark:shadow-[4px_4px_0px_var(--theme-shadow)]',
          paddingStyles[padding],
          hoverEffect &&
            'transition-transform duration-100 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#0A0A0A] dark:hover:shadow-[6px_6px_0px_var(--theme-shadow)]',
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
