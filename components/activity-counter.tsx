'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Props = {
  variant?: 'inline' | 'pill';
  className?: string;
};

export function ActivityCounter({ variant = 'pill', className = '' }: Props) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const supabase = createClient();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const { count: c } = await supabase
          .from('contact_submissions')
          .select('*', { count: 'exact', head: true })
          .in('source', ['free_website_claim', 'free_audit'])
          .gte('created_at', sevenDaysAgo.toISOString());
        if (mounted && typeof c === 'number') setCount(c);
      } catch {
        // ignore — just hide
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (count === null || count === 0) return null;

  const label = count === 1 ? 'business claimed' : 'businesses claimed';

  if (variant === 'inline') {
    return (
      <p className={`text-xs sm:text-sm text-zinc-400 inline-flex items-center gap-2 ${className}`}>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
        </span>
        <span>
          <span className="font-semibold text-white">{count}</span> {label} this week
        </span>
      </p>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-green-500/25 bg-green-500/5 ${className}`}>
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
      </span>
      <span className="text-[11px] sm:text-xs font-medium text-zinc-300">
        <span className="font-bold text-white">{count}</span> {label} this week
      </span>
    </div>
  );
}
