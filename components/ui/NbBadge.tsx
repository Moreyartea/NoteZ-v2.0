import React from 'react';
import { cn } from '@/app/lib/utils';
import type { MediaTier, TodoPriority } from '@/app/lib/types';

export type NbBadgeVariant =
  | 'primary'
  | 'secondary'
  | 'finance'
  | 'danger'
  | 'warning'
  | 'media'
  | 'wishlist'
  | 'neutral'
  | 'tier-s'
  | 'tier-a'
  | 'tier-b'
  | 'tier-c'
  | 'tier-d'
  | 'priority-high'
  | 'priority-medium'
  | 'priority-low';

export interface NbBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: NbBadgeVariant;
  tier?: MediaTier;
  priority?: TodoPriority;
  icon?: React.ReactNode;
}

const variantStyles: Record<NbBadgeVariant, string> = {
  primary: 'bg-[#FFE135] text-[#0A0A0A]',
  secondary: 'bg-[#3B6FFF] text-white',
  finance: 'bg-[#00E676] text-[#0A0A0A]',
  danger: 'bg-[#FF3B30] text-white',
  warning: 'bg-[#FF6B2B] text-white',
  media: 'bg-[#A855F7] text-white',
  wishlist: 'bg-[#FF4DA6] text-white',
  neutral: 'bg-white text-[#0A0A0A]',
  'tier-s': 'bg-[#FFE135] text-[#0A0A0A] font-extrabold',
  'tier-a': 'bg-[#00E676] text-[#0A0A0A] font-extrabold',
  'tier-b': 'bg-[#3B6FFF] text-white font-extrabold',
  'tier-c': 'bg-[#A855F7] text-white font-bold',
  'tier-d': 'bg-[#757575] text-white font-bold',
  'priority-high': 'bg-[#FF3B30] text-white',
  'priority-medium': 'bg-[#FF6B2B] text-white',
  'priority-low': 'bg-[#3B6FFF] text-white',
};

export const NbBadge: React.FC<NbBadgeProps> = ({
  className,
  variant,
  tier,
  priority,
  icon,
  children,
  ...props
}) => {
  let resolvedVariant: NbBadgeVariant = variant || 'neutral';

  if (tier) {
    const tierMap: Record<MediaTier, NbBadgeVariant> = {
      S: 'tier-s',
      A: 'tier-a',
      B: 'tier-b',
      C: 'tier-c',
      D: 'tier-d',
    };
    resolvedVariant = tierMap[tier];
  } else if (priority) {
    const priorityMap: Record<TodoPriority, NbBadgeVariant> = {
      high: 'priority-high',
      medium: 'priority-medium',
      low: 'priority-low',
    };
    resolvedVariant = priorityMap[priority];
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] select-none tracking-tight',
        variantStyles[resolvedVariant],
        className
      )}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children || tier || (priority && priority.toUpperCase())}
    </span>
  );
};

