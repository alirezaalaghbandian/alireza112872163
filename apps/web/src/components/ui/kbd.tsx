import { cn } from '@/lib/utils';

interface KbdProps {
  children: string;
  className?: string;
}

/** Keyboard shortcut indicator. */
export function Kbd({ children, className }: KbdProps) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 items-center rounded border border-border-subtle bg-bg-sunken px-1.5',
        'font-mono text-[11px] text-text-tertiary',
        className,
      )}
    >
      {children}
    </kbd>
  );
}
