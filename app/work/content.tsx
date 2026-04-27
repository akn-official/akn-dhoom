'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { AKNPortfolioDesign } from './portfolio-design';
import type { Work } from '@/lib/supabase/types';

interface PortfolioSite {
  id: string;
  name: string;
  tag: string;
  year: string;
  url: string;
  href?: string;
  ph: { bg: string; stripe: string; ink: string; angle: number; gap: number };
}

const PORTFOLIO_SITES: PortfolioSite[] = [
  {
    id: 'akn-portfolio',
    name: 'AKN Portfolio',
    tag: 'Sample Design',
    year: '2025',
    url: 'aspirekineticnetwork.in',
    ph: { bg: '#0e1a12', stripe: '#c7ff3b', ink: '#c7ff3b', angle: 30, gap: 12 },
  },
  {
    id: 'trak-fitness',
    name: 'Trak Fitness',
    tag: 'Gym · Chennai',
    year: '2025',
    url: 'trakfitness.in',
    href: '/work/trak-fitness',
    ph: { bg: '#0D0608', stripe: '#9B2335', ink: '#F5EFE4', angle: 45, gap: 10 },
  },
];

function SitePreview({ ph, id }: { ph: PortfolioSite['ph']; id: string }) {
  const stripeId = `work-stripe-${id}`;
  return (
    <svg viewBox="0 0 360 220" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
      <defs>
        <pattern id={stripeId} patternUnits="userSpaceOnUse" width={ph.gap * 2} height={ph.gap * 2} patternTransform={`rotate(${ph.angle})`}>
          <rect width={ph.gap * 2} height={ph.gap * 2} fill={ph.bg} />
          <rect width={ph.gap} height={ph.gap * 2} fill={ph.stripe} opacity={0.15} />
        </pattern>
      </defs>
      <rect width="360" height="220" fill={ph.bg} />
      <rect width="360" height="220" fill={`url(#${stripeId})`} />
      {/* mock nav */}
      <rect x="20" y="16" width="60" height="5" rx="2" fill={ph.ink} opacity={0.6} />
      <rect x="240" y="16" width="30" height="5" rx="2" fill={ph.ink} opacity={0.25} />
      <rect x="280" y="16" width="30" height="5" rx="2" fill={ph.ink} opacity={0.25} />
      <rect x="320" y="16" width="20" height="5" rx="2" fill={ph.ink} opacity={0.25} />
      {/* hero headline */}
      <rect x="20" y="44" width="200" height="18" rx="3" fill={ph.ink} opacity={0.75} />
      <rect x="20" y="68" width="150" height="18" rx="3" fill={ph.stripe} opacity={0.55} />
      {/* sub text */}
      <rect x="20" y="100" width="120" height="5" rx="2" fill={ph.ink} opacity={0.2} />
      <rect x="20" y="112" width="100" height="5" rx="2" fill={ph.ink} opacity={0.15} />
      {/* CTA pill */}
      <rect x="20" y="130" width="80" height="22" rx="11" fill={ph.stripe} opacity={0.7} />
      {/* card grid */}
      <rect x="20" y="168" width="98" height="40" rx="4" fill={ph.stripe} opacity={0.08} />
      <rect x="128" y="168" width="98" height="40" rx="4" fill={ph.stripe} opacity={0.05} />
      <rect x="236" y="168" width="98" height="40" rx="4" fill={ph.stripe} opacity={0.06} />
    </svg>
  );
}

function BrowserCard({ site, onOpen }: { site: PortfolioSite; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const handleClick = () => site.href ? router.push(site.href) : onOpen();
  return (
    <motion.div
      data-browser-card
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`View ${site.name} design`}
      className={`relative flex-shrink-0 cursor-pointer rounded-xl overflow-hidden border backdrop-blur-sm transition-all duration-350 outline-none focus-visible:ring-2 focus-visible:ring-[#2A8B9D] ${
        hovered
          ? 'border-[#2A8B9D] shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(42,139,157,0.2)] -translate-y-2'
          : 'border-zinc-800 shadow-[0_4px_24px_rgba(0,0,0,0.4)] translate-y-0'
      }`}
      style={{ width: 'clamp(280px, 38vw, 420px)', background: 'rgba(24,27,36,0.8)' }}
    >
      {/* Browser Chrome */}
      <div className="flex items-center gap-2.5 bg-[#181818] border-b border-zinc-800 px-3.5 py-2.5">
        <div className="flex gap-1.5 shrink-0">
          <span className="block w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="block w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="block w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 font-mono text-[10px] text-zinc-500 tracking-wide overflow-hidden text-ellipsis whitespace-nowrap">
          {site.url}
        </div>
      </div>

      {/* Preview */}
      <div className="relative overflow-hidden">
        <SitePreview ph={site.ph} id={site.id} />
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black/80 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#2A8B9D] border border-[#2A8B9D] rounded-full px-6 py-2.5">
            View Design →
          </span>
        </div>
      </div>

      {/* Card footer */}
      <div className="flex items-baseline justify-between px-4 py-3 border-t border-zinc-800 bg-zinc-900/50">
        <div>
          <p className="font-epilogue text-sm font-semibold text-white mb-0.5">{site.name}</p>
          <p className={`font-mono text-[10px] tracking-[0.14em] uppercase transition-colors duration-300 ${hovered ? 'text-[#2A8B9D]' : 'text-zinc-500'}`}>
            {site.tag}
          </p>
        </div>
        <span className="font-mono text-[10px] text-zinc-600 tracking-wide">{site.year}</span>
      </div>
    </motion.div>
  );
}

function DesignModal({ site, works, onClose }: { site: PortfolioSite; works: Work[]; onClose: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', handler);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[300] flex flex-col bg-[#0a0a0a]"
    >
      {/* Sticky bar */}
      <div className="flex-shrink-0 flex items-center justify-between gap-4 px-5 sm:px-8 py-3 border-b border-zinc-800 bg-[#0a0a0a]">
        <div className="flex items-center gap-2.5">
          <span className="block w-2 h-2 rounded-full bg-[#2A8B9D] animate-pulse" />
          <span className="font-mono text-[10px] text-zinc-500 tracking-[0.18em] uppercase">
            {site.name} — {site.url}
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close design preview"
          className="font-mono text-[10px] tracking-[0.18em] uppercase text-zinc-300 border border-zinc-700 hover:border-[#2A8B9D] hover:text-[#2A8B9D] px-4 py-1.5 rounded-full transition-colors"
        >
          Close ×
        </button>
      </div>

      {/* Scrollable design */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
        className="flex-1 overflow-y-auto"
      >
        {site.id === 'akn-portfolio' && <AKNPortfolioDesign works={works} />}
      </motion.div>
    </motion.div>
  );
}

export function WorkPageContent({ works }: { works: Work[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [openSiteId, setOpenSiteId] = useState<string | null>(null);
  const openSite = PORTFOLIO_SITES.find((s) => s.id === openSiteId) ?? null;

  const updateActive = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>('[data-browser-card]');
    const center = el.scrollLeft + el.clientWidth / 2;
    let closest = 0, min = Infinity;
    cards.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
      if (d < min) { min = d; closest = i; }
    });
    setActiveIdx(closest);
  }, []);

  const scrollCarousel = (dir: -1 | 1) => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-browser-card]');
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 400) + 28), behavior: 'smooth' });
  };

  const multipleCards = PORTFOLIO_SITES.length > 1;

  return (
    <div id="main-content" className="min-h-screen bg-[#0A0F1C] text-zinc-50">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden>
        <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] rounded-full bg-[#2A8B9D]/6 blur-[120px]" />
        <div className="absolute bottom-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-[#C87A4F]/5 blur-[100px]" />
      </div>

      {/* PAGE HEADER */}
      <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-20 px-4 sm:px-8 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2A8B9D]/40 bg-[#2A8B9D]/5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2A8B9D]" />
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#2A8B9D]">Sample Work</span>
          </div>

          <h1 className="font-epilogue text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            How we{' '}
            <span className="text-[#C87A4F]">design</span>.
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto">
            These are sample designs we&apos;ve built to demonstrate the quality and style of work we deliver for clients. Click any card to explore the full design.
          </p>
        </motion.div>
      </section>

      {/* CAROUSEL */}
      <section className="pb-24 sm:pb-32">
        {multipleCards && (
          <div className="flex justify-end gap-2.5 px-4 sm:px-8 mb-6">
            {([-1, 1] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => scrollCarousel(dir)}
                aria-label={dir === -1 ? 'Previous' : 'Next'}
                className="w-11 h-11 rounded-full border border-zinc-700 hover:border-[#2A8B9D] hover:text-[#2A8B9D] text-zinc-300 transition-colors text-base"
              >
                {dir === -1 ? '←' : '→'}
              </button>
            ))}
          </div>
        )}

        {multipleCards ? (
          <>
            <div
              ref={carouselRef}
              onScroll={updateActive}
              className="flex gap-7 overflow-x-auto scroll-snap-x [scroll-snap-type:x_mandatory] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-4 sm:px-8 pb-4"
              style={{ scrollPaddingLeft: 'clamp(16px,4vw,32px)' }}
            >
              {PORTFOLIO_SITES.map((site) => (
                <div key={site.id} style={{ scrollSnapAlign: 'center' }}>
                  <BrowserCard site={site} onOpen={() => setOpenSiteId(site.id)} />
                </div>
              ))}
              <div className="flex-shrink-0 w-px" />
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {PORTFOLIO_SITES.map((_, i) => (
                <span
                  key={i}
                  className="h-1 rounded-full transition-all duration-400"
                  style={{ width: i === activeIdx ? 28 : 8, background: i === activeIdx ? '#2A8B9D' : '#3f3f46' }}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-5 px-4 sm:px-8">
            <BrowserCard site={PORTFOLIO_SITES[0]} onOpen={() => setOpenSiteId(PORTFOLIO_SITES[0].id)} />
            <p className="font-mono text-[10px] text-zinc-600 tracking-[0.2em] uppercase">
              More designs coming soon
            </p>
          </div>
        )}
      </section>

      <AnimatePresence>
        {openSite && (
          <DesignModal
            key={openSite.id}
            site={openSite}
            works={works}
            onClose={() => setOpenSiteId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
