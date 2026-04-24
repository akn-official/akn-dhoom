'use client';

import { useEffect } from 'react';
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';
import { createClient } from '@/lib/supabase/client';

// Vitals listeners are registered once per page load — the web-vitals library
// already deduplicates internally, but we guard with a module-level flag to
// prevent double-registration across React StrictMode double-invocations.
let registered = false;

export function WebVitalsReporter() {
  useEffect(() => {
    if (registered) return;

    // Respect consent
    try {
      if (localStorage.getItem('akn-cookie-consent') !== 'accepted') return;
    } catch {
      return;
    }

    registered = true;
    const supabase = createClient();

    const report = (metric: { name: string; value: number; rating: string }) => {
      supabase.from('web_vitals').insert({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        path: window.location.pathname,
        user_agent: navigator.userAgent,
      });
    };

    onCLS(report);
    onFCP(report);
    onLCP(report);
    onTTFB(report);
    onINP(report);
  // Run once on mount only — pathname changes don't re-register listeners.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
