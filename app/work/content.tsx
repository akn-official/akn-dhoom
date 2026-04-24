'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { AKNPortfolioDesign } from './portfolio-design';
import type { Work } from '@/lib/supabase/types';

const DISPLAY = 'var(--font-portfolio-display, system-ui)';
const MONO = 'var(--font-portfolio-mono, ui-monospace, monospace)';
const SERIF = 'var(--font-portfolio-serif, Georgia, serif)';

const BG = '#0a0a0a';
const FG = '#f4f1ea';
const LIME = '#c7ff3b';
const MUTED = '#6b6b6b';
const ELEV = '#141414';
const BORDER = '#1f1f1f';

interface PortfolioSite {
  id: string;
  name: string;
  tag: string;
  year: string;
  url: string;
  ph: { bg: string; stripe: string; ink: string; angle: number; gap: number };
}

const PORTFOLIO_SITES: PortfolioSite[] = [
  {
    id: 'akn-portfolio',
    name: 'AKN Portfolio',
    tag: 'Digital Studio',
    year: '2025',
    url: 'aspirekineticnetwork.in',
    ph: { bg: '#0e1a12', stripe: '#c7ff3b', ink: '#c7ff3b', angle: 30, gap: 12 },
  },
];

function SitePreview({ ph, id }: { ph: PortfolioSite['ph']; id: string }) {
  const stripeId = `site-stripe-${id}`;
  return (
    <svg viewBox="0 0 360 220" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <pattern id={stripeId} patternUnits="userSpaceOnUse" width={ph.gap * 2} height={ph.gap * 2} patternTransform={`rotate(${ph.angle})`}>
          <rect width={ph.gap * 2} height={ph.gap * 2} fill={ph.bg} />
          <rect width={ph.gap} height={ph.gap * 2} fill={ph.stripe} opacity={0.15} />
        </pattern>
      </defs>
      <rect width="360" height="220" fill={ph.bg} />
      <rect width="360" height="220" fill={`url(#${stripeId})`} />
      {/* mock nav bar */}
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
  return (
    <motion.div
      data-browser-card
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: 'clamp(280px, 38vw, 420px)',
        cursor: 'pointer',
        borderRadius: 10,
        overflow: 'hidden',
        border: `1px solid ${hovered ? LIME : BORDER}`,
        background: ELEV,
        transition: 'border-color 0.35s ease, transform 0.4s ease, box-shadow 0.4s ease',
        transform: hovered ? 'translateY(-8px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: hovered
          ? `0 28px 64px rgba(0,0,0,0.7), 0 0 0 1px ${LIME}33`
          : '0 4px 24px rgba(0,0,0,0.35)',
      }}
    >
      {/* Browser Chrome */}
      <div style={{
        background: '#181818',
        borderBottom: `1px solid ${BORDER}`,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56', display: 'block' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e', display: 'block' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f', display: 'block' }} />
        </div>
        <div style={{
          flex: 1,
          background: '#0f0f0f',
          border: `1px solid ${BORDER}`,
          borderRadius: 4,
          padding: '4px 10px',
          fontFamily: MONO,
          fontSize: 10,
          color: MUTED,
          letterSpacing: '0.04em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {site.url}
        </div>
      </div>

      {/* Preview viewport */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <SitePreview ph={site.ph} id={site.id} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(10,10,10,0.82)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}>
          <span style={{
            fontFamily: MONO, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: LIME, padding: '10px 24px', border: `1px solid ${LIME}`, borderRadius: 100,
          }}>View Design →</span>
        </div>
      </div>

      {/* Card info */}
      <div style={{ padding: '14px 18px 16px', borderTop: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          <span style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 500, letterSpacing: '-0.01em', color: FG }}>
            {site.name}
          </span>
          <span style={{ fontFamily: MONO, fontSize: 10, color: MUTED, letterSpacing: '0.1em' }}>
            {site.year}
          </span>
        </div>
        <span style={{
          fontFamily: MONO, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
          color: hovered ? LIME : MUTED, transition: 'color 0.3s ease',
        }}>
          {site.tag}
        </span>
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
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: BG,
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Sticky close bar */}
      <div style={{
        flexShrink: 0,
        background: BG,
        borderBottom: `1px solid ${BORDER}`,
        padding: '12px clamp(20px, 4vw, 40px)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: LIME, display: 'inline-block', animation: 'designPulse 2s ease-in-out infinite' }} />
          <span style={{ fontFamily: MONO, fontSize: 10, color: MUTED, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            {site.name} — {site.url}
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close design preview"
          onMouseEnter={(e) => { e.currentTarget.style.background = LIME; e.currentTarget.style.color = BG; e.currentTarget.style.borderColor = LIME; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = FG; e.currentTarget.style.borderColor = BORDER; }}
          style={{
            fontFamily: MONO, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: FG, background: 'transparent', border: `1px solid ${BORDER}`,
            padding: '7px 16px', borderRadius: 100, cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
        >Close ×</button>
      </div>

      {/* Scrollable design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ flex: 1, overflowY: 'auto' }}
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
    let closest = 0;
    let min = Infinity;
    cards.forEach((c, i) => {
      const mid = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(mid - center);
      if (d < min) { min = d; closest = i; }
    });
    setActiveIdx(closest);
  }, []);

  const scrollCarousel = (dir: -1 | 1) => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-browser-card]');
    const w = card ? card.offsetWidth + 28 : 450;
    el.scrollBy({ left: dir * w, behavior: 'smooth' });
  };

  const multipleCards = PORTFOLIO_SITES.length > 1;

  return (
    <div style={{ background: BG, color: FG, fontFamily: DISPLAY, minHeight: '100vh' }}>
      <style>{`
        @keyframes designPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
        .work-carousel::-webkit-scrollbar { display: none; }
      `}</style>

      {/* PAGE HEADER */}
      <section style={{
        padding: 'clamp(80px, 12vw, 160px) clamp(24px, 4vw, 56px) clamp(56px, 8vw, 100px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: LIME, marginBottom: 20 }}>
            ◇ Our Work
          </div>
          <h1 style={{
            fontFamily: DISPLAY, fontWeight: 400,
            fontSize: 'clamp(40px, 7vw, 100px)',
            lineHeight: 0.95, letterSpacing: '-0.035em',
            marginBottom: 28, maxWidth: 800, margin: '0 auto 28px',
          }}>
            Real results,{' '}
            <span style={{ fontFamily: SERIF, fontStyle: 'italic' }}>real clients.</span>
          </h1>
          <p style={{ color: MUTED, fontSize: 16, lineHeight: 1.6, maxWidth: 480, margin: '0 auto 0' }}>
            A growing portfolio of digital work — websites, campaigns, and brands built for businesses that want to stand out and grow.
          </p>
        </motion.div>
      </section>

      {/* CAROUSEL */}
      <section style={{ paddingBottom: 'clamp(80px, 10vw, 140px)' }}>
        {/* Nav row (only shown if multiple sites) */}
        {multipleCards && (
          <div style={{
            padding: '0 clamp(24px, 4vw, 56px)',
            display: 'flex', justifyContent: 'flex-end', gap: 10, marginBottom: 28,
          }}>
            <button
              onClick={() => scrollCarousel(-1)}
              aria-label="Previous"
              onMouseEnter={(e) => { e.currentTarget.style.background = LIME; e.currentTarget.style.color = BG; e.currentTarget.style.borderColor = LIME; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = FG; e.currentTarget.style.borderColor = BORDER; }}
              style={{ width: 48, height: 48, borderRadius: 100, border: `1px solid ${BORDER}`, background: 'transparent', color: FG, cursor: 'pointer', fontSize: 16, transition: 'all 0.3s ease' }}
            >←</button>
            <button
              onClick={() => scrollCarousel(1)}
              aria-label="Next"
              onMouseEnter={(e) => { e.currentTarget.style.background = LIME; e.currentTarget.style.color = BG; e.currentTarget.style.borderColor = LIME; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = FG; e.currentTarget.style.borderColor = BORDER; }}
              style={{ width: 48, height: 48, borderRadius: 100, border: `1px solid ${BORDER}`, background: 'transparent', color: FG, cursor: 'pointer', fontSize: 16, transition: 'all 0.3s ease' }}
            >→</button>
          </div>
        )}

        {/* Cards */}
        {multipleCards ? (
          /* scrollable row for 2+ cards */
          <>
            <div
              ref={carouselRef}
              onScroll={updateActive}
              className="work-carousel"
              style={{
                display: 'flex', gap: 28,
                overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none',
                padding: '8px clamp(24px, 4vw, 56px) 16px',
                scrollPaddingLeft: 'clamp(24px, 4vw, 56px)',
              }}
            >
              {PORTFOLIO_SITES.map((site) => (
                <div key={site.id} style={{ scrollSnapAlign: 'center' }}>
                  <BrowserCard site={site} onOpen={() => setOpenSiteId(site.id)} />
                </div>
              ))}
              <div style={{ flexShrink: 0, width: 1 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
              {PORTFOLIO_SITES.map((_, i) => (
                <span key={i} style={{
                  width: i === activeIdx ? 28 : 8, height: 4, borderRadius: 4,
                  background: i === activeIdx ? LIME : BORDER, transition: 'all 0.4s ease',
                }} />
              ))}
            </div>
          </>
        ) : (
          /* centered single card */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '8px clamp(24px, 4vw, 56px)' }}>
            <BrowserCard site={PORTFOLIO_SITES[0]} onOpen={() => setOpenSiteId(PORTFOLIO_SITES[0].id)} />
            <p style={{ fontFamily: MONO, fontSize: 10, color: MUTED, letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 8 }}>
              More portfolio sites coming soon
            </p>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '24px clamp(24px, 4vw, 56px)',
        borderTop: `1px solid ${BORDER}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: 20, flexWrap: 'wrap',
        fontFamily: MONO, fontSize: 11, color: MUTED, letterSpacing: '0.15em', textTransform: 'uppercase',
      }}>
        <span>© 2026 Aspire Kinetic Network</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: LIME, display: 'inline-block', animation: 'designPulse 2s ease-in-out infinite' }} />
          Available for new clients
        </span>
        <Link href="/" style={{ color: FG, textDecoration: 'none' }}>← Back to Studio</Link>
      </footer>

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
