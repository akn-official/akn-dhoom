import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-lg bg-zinc-800/60', className)}
    />
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      <Skeleton className="h-8 w-2/3 mb-4" />
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-4/5 mb-6" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export function InsightCardSkeleton() {
  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      <Skeleton className="h-3 w-20 mb-3" />
      <Skeleton className="h-5 w-full mb-2" />
      <Skeleton className="h-5 w-5/6" />
    </div>
  );
}
