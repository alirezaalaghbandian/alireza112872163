import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

/** Animated placeholder mimicking content layout during loading. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-bg-sunken',
        className,
      )}
    />
  );
}
