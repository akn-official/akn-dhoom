'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith('/admin')) return;

    const supabase = createClient();
    supabase.from('page_views').insert({
      path: pathname,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent || null,
    });
  }, [pathname]);

  return null;
}
