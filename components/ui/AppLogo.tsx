'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/app/lib/utils';

export interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  href?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = true,
  className,
  href = '/',
}) => {
  const sizeMap = {
    sm: {
      box: 'w-7 h-7',
      img: 'w-5 h-5',
      text: 'text-base',
    },
    md: {
      box: 'w-9 h-9',
      img: 'w-6 h-6',
      text: 'text-lg',
    },
    lg: {
      box: 'w-12 h-12',
      img: 'w-8 h-8',
      text: 'text-xl',
    },
  };

  const current = sizeMap[size];

  const content = (
    <div
      className={cn(
        'inline-flex items-center gap-2 group select-none transition-transform active:translate-x-[1px] active:translate-y-[1px]',
        className
      )}
    >
      {/* Neo-Brutalism Logo Icon Container */}
      <div
        className={cn(
          'rounded-xl bg-[#FFE135] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] flex items-center justify-center p-0.5 overflow-hidden flex-shrink-0 group-hover:-translate-y-0.5 transition-transform',
          current.box
        )}
      >
        <img
          src="/logo_app.svg"
          alt="NoteZ Logo"
          className={cn('object-contain', current.img)}
          width={36}
          height={36}
        />
      </div>

      {showText && (
        <span
          className={cn(
            'font-black tracking-tight text-[#0A0A0A] dark:text-[var(--theme-text-primary)] leading-tight',
            current.text
          )}
        >
          NoteZ
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
};

