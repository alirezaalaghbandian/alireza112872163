'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

/** Text input with consistent styling and error state. */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <input
          ref={ref}
          className={cn(
            'flex h-9 w-full rounded-md border bg-bg-elevated px-3 py-1.5',
            'text-sm text-text-primary placeholder:text-text-tertiary',
            'transition-colors duration-fast',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1',
            'disabled:pointer-events-none disabled:opacity-50',
            error
              ? 'border-danger-500 focus-visible:ring-danger-500'
              : 'border-border-subtle hover:border-border-strong',
            className,
          )}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
        {error && (
          <p className="text-xs text-danger-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
export { Input, type InputProps };
