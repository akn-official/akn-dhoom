'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';
import { createClient } from '@/lib/supabase/client';

export function WebVitalsReporter() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;

    const supabase = createClient();

    const report = (metric: { name: string; value: number; rating: string }) => {
      supabase.from('web_vitals').insert({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        path: pathname,
        user_agent: navigator.userAgent,
      });
    };

    onCLS(report);
    onFCP(report);
    onLCP(report);
    onTTFB(report);
    onINP(report);
  }, [pathname]);

  return null;
}
