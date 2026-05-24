import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-bg-sunken text-text-secondary border-border-subtle',
  success: 'bg-success-500/10 text-success-500 border-success-500/20',
  warning: 'bg-warning-500/10 text-warning-500 border-warning-500/20',
  danger: 'bg-danger-500/10 text-danger-500 border-danger-500/20',
  info: 'bg-info-500/10 text-info-500 border-info-500/20',
  brand: 'bg-brand-50 text-brand-600 border-brand-500/20',
};

/** Inline status badge with semantic color variants. */
export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5',
        'text-xs font-medium leading-none',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
