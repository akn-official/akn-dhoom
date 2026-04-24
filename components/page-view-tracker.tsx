'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/admin') || pathname.startsWith('/portal')) return;

    // Respect consent — only track if the user has accepted analytics
    try {
      if (localStorage.getItem('akn-cookie-consent') !== 'accepted') return;
    } catch {
      return;
    }

    const supabase = createClient();
    supabase.from('page_views').insert({
      path: pathname,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent || null,
    });
  }, [pathname]);

  return null;
}
