'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Cookie } from 'lucide-react';

const STORAGE_KEY = 'akn-cookie-consent';
type Choice = 'accepted' | 'rejected';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Delay to avoid layout thrash during hero animation
    const timer = setTimeout(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
      else if (stored === 'accepted') enableAnalytics();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const save = (choice: Choice) => {
    localStorage.setItem(STORAGE_KEY, choice);
    if (choice === 'accepted') enableAnalytics();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md z-[70] animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="relative rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 shadow-2xl p-5 sm:p-6">
        <button
          onClick={() => save('rejected')}
          aria-label="Dismiss"
          className="absolute top-3 right-3 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
        <div className="flex items-center gap-2 mb-3">
          <Cookie size={18} className="text-[#C87A4F]" />
          <h3 id="cookie-title" className="font-epilogue font-bold text-white text-sm">
            We value your privacy
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
          We use cookies to analyze site traffic and improve your experience. See our{' '}
          <Link href="/privacy" className="text-[#2A8B9D] hover:underline">Privacy Policy</Link>.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => save('accepted')}
            className="flex-1 px-4 py-2 rounded-full bg-gradient-to-r from-[#2A8B9D] to-[#3ab0c5] text-white text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_20px_-5px_rgba(42,139,157,0.6)] transition-shadow"
          >
            Accept
          </button>
          <button
            onClick={() => save('rejected')}
            className="flex-1 px-4 py-2 rounded-full border border-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-widest hover:border-zinc-500 transition-colors"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

function enableAnalytics() {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === 'function') {
    w.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
    });
  }
}
