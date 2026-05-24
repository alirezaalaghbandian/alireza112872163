import { cn } from '@/lib/utils';
import { Button } from './button';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  helpLink?: {
    label: string;
    href: string;
  };
  className?: string;
}

/** Structured empty state with illustration, primary action, and help link. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  helpLink,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 text-center',
        className,
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-sunken">
        <Icon className="h-6 w-6 text-text-tertiary" />
      </div>
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-text-secondary">{description}</p>
      {action && (
        <Button className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
      {helpLink && (
        <a
          href={helpLink.href}
          className="mt-3 text-xs text-brand-500 hover:text-brand-600 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          {helpLink.label}
        </a>
      )}
    </div>
  );
}
