'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'lucide-react';

const LONG_PAGE_PATTERNS = [
  /^\/privacy$/,
  /^\/terms$/,
  /^\/insights\/[^/]+$/,
  /^\/careers\/[^/]+$/,
];

export function BackToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const show = LONG_PAGE_PATTERNS.some((re) => re.test(pathname));

  useEffect(() => {
    if (!show) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 600);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [show]);

  if (!show) return null;

  const go = () => {
    const w = window as typeof window & { lenis?: { scrollTo: (t: number) => void } };
    if (w.lenis) {
      w.lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      type="button"
      onClick={go}
      aria-label="Back to top"
      className={`fixed bottom-24 right-5 z-40 w-11 h-11 rounded-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800 hover:border-[#2A8B9D] text-white flex items-center justify-center transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
    >
      <ArrowUp size={18} />
    </button>
  );
}
