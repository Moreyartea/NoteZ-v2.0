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
      img: 'w-7 h-7',
      text: 'text-base',
    },
    md: {
      img: 'w-9 h-9',
      text: 'text-lg',
    },
    lg: {
      img: 'w-12 h-12',
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
      {/* Pure Logo without artificial container background/border */}
      <div className="flex items-center justify-center flex-shrink-0 group-hover:-translate-y-0.5 transition-transform">
        <img
          src="/logo_app.svg"
          alt="NoteZ Logo"
          className={cn('object-contain drop-shadow-sm', current.img)}
          width={48}
          height={48}
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
