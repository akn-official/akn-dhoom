'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, X } from 'lucide-react';
import { events } from '@/lib/analytics';

const STORAGE_KEY = 'akn-sticky-cta-dismissed';
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function StickyCta() {
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const suppress =
    pathname === '/claim' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/portal') ||
    pathname === '/privacy' ||
    pathname === '/terms';

  useEffect(() => {
    setMounted(true);
    if (suppress) return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const ts = Number(raw);
        if (!Number.isNaN(ts) && Date.now() - ts < TTL_MS) return;
      }
    } catch {
      // ignore storage errors
    }

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const threshold = window.innerHeight * 0.8;
        setVisible(window.scrollY > threshold);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [suppress]);

  if (!mounted || suppress) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {
      // ignore
    }
  };

  const go = () => {
    events.navCtaClick();
    router.push('/claim');
  };

  return (
    <div
      role="complementary"
      aria-label="Claim free website"
      className={`fixed z-40 transition-all duration-500 ease-out ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
      } bottom-3 left-3 right-3 sm:bottom-5 sm:left-auto sm:right-5 sm:max-w-md`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#0A0F1C]/95 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(200,122,79,0.35)]">
        {/* Left accent strip */}
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#2A8B9D] via-[#C87A4F] to-[#2A8B9D]" />
        <div className="flex items-center gap-3 sm:gap-4 pl-4 pr-2 py-3 sm:pl-5 sm:pr-3 sm:py-4">
          <div className="hidden sm:flex shrink-0 w-10 h-10 rounded-full bg-[#C87A4F]/15 items-center justify-center">
            <Sparkles size={18} className="text-[#C87A4F]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-[15px] font-semibold text-white leading-tight">
              Still deciding? Claim a free website.
            </p>
            <p className="text-xs text-zinc-400 mt-0.5 hidden sm:block">
              Only 5 slots — first come, first served.
            </p>
          </div>
          <button
            onClick={go}
            className="shrink-0 rounded-full bg-gradient-to-r from-[#C87A4F] to-[#e08a5c] px-3.5 sm:px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:shadow-[0_0_24px_-4px_rgba(200,122,79,0.7)] transition-shadow"
          >
            Claim
          </button>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="shrink-0 p-1.5 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
