'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
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

interface PortfolioProject {
  id: string;
  num: string;
  name: string;
  year: string;
  tag: string;
  short: string;
  long: string;
  role: string;
  stack: string[];
  links: { label: string; href: string }[];
  ph: { bg: string; stripe: string; ink: string; angle: number; gap: number };
}

const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  { id: 'akn-site', num: '01', name: 'AKN Platform', year: '2025', tag: 'Digital Presence',
    short: "The studio's own end-to-end digital presence — built to practise what we preach.",
    long: "The AKN website is our own proof of concept: a production-grade Next.js 15 site with GSAP animations, Supabase backend, and a full admin portal. Every decision — performance budget, accessibility, conversion architecture — is something we carry into every client engagement.",
    role: 'Full Build', stack: ['Next.js 15', 'Tailwind CSS', 'GSAP', 'Supabase'],
    links: [{ label: 'Live', href: 'https://aspirekineticnetwork.in' }],
    ph: { bg: '#0e1a12', stripe: '#c7ff3b', ink: '#c7ff3b', angle: 30, gap: 12 } },
  { id: 'local-seo', num: '02', name: 'Local Visibility', year: '2025', tag: 'SEO / Local Search',
    short: 'A full-stack local SEO campaign turning invisible businesses into first-page results.',
    long: "Local search is a zero-sum game: either you rank or your competitor does. Our local SEO package combines on-page optimisation, citation building, and Google Business Profile management into a single, measurable push. Clients see ranking improvements in 30–60 days.",
    role: 'Strategy + Execution', stack: ['Local SEO', 'GMB', 'On-Page Optimisation', 'Citations'],
    links: [{ label: 'Claim Free Audit', href: '/claim' }],
    ph: { bg: '#140e0e', stripe: '#f4f1ea', ink: '#c7ff3b', angle: -20, gap: 18 } },
  { id: 'gmb', num: '03', name: 'GMB Mastery', year: '2025', tag: 'Google Business Profile',
    short: 'Transforming underperforming GMB listings into lead-generating assets.',
    long: "Your Google Business Profile is often the first — and only — thing a potential customer sees. We set it up right: complete profile, keyword-rich descriptions, regular posts, review management, and Q&A monitoring. A well-run GMB consistently outperforms paid ads for local intent.",
    role: 'Setup + Management', stack: ['Google Business Profile', 'Local SEO', 'Review Strategy', 'Analytics'],
    links: [{ label: 'Get Started', href: '/claim' }],
    ph: { bg: '#0a0a0a', stripe: '#3a3a3a', ink: '#c7ff3b', angle: 90, gap: 8 } },
  { id: 'content', num: '04', name: 'Content Engine', year: '2025', tag: 'Content Strategy',
    short: 'A repeatable content system that builds authority and keeps audiences coming back.',
    long: "Content without strategy is just noise. We build content plans tied to your business goals and your audience's actual behaviour — research-led, calendar-driven, measurable from day one. The output isn't posts for the sake of posts; it's a content machine that compounds over time.",
    role: 'Strategy + Creation', stack: ['Content Strategy', 'SEO Writing', 'Social Media', 'Analytics'],
    links: [{ label: 'See the Approach', href: '/claim' }],
    ph: { bg: '#0f0c18', stripe: '#c7ff3b', ink: '#c7ff3b', angle: 60, gap: 6 } },
  { id: 'web-presence', num: '05', name: 'Web Presence', year: '2025', tag: 'Web Design + Build',
    short: 'Clean, fast, conversion-focused websites built to represent businesses 24/7.',
    long: "A website that doesn't convert is just an expensive business card. We design and build sites that load fast, look sharp, and move visitors toward action — with mobile-first layouts, basic SEO baked in, and no unnecessary bloat. Currently free for our first five clients.",
    role: 'Design + Development', stack: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'Supabase'],
    links: [{ label: 'Claim Free Website', href: '/claim' }],
    ph: { bg: '#0c0e14', stripe: '#6b6b6b', ink: '#f4f1ea', angle: 0, gap: 24 } },
];

const CAPABILITIES = [
  'Web Presence & Design',
  'Local SEO & Discovery',
  'Google Business Profile',
  'Content Strategy',
  'Social Media Growth',
  'Growth Consulting',
];

function ProjectPlaceholder({ ph, label }: { ph: PortfolioProject['ph']; label: string }) {
  const stripeId = `stripe-${label.replace(/\s+/g, '-')}`;
  return (
    <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <pattern id={stripeId} patternUnits="userSpaceOnUse" width={ph.gap * 2} height={ph.gap * 2} patternTransform={`rotate(${ph.angle})`}>
          <rect width={ph.gap * 2} height={ph.gap * 2} fill={ph.bg} />
          <rect width={ph.gap} height={ph.gap * 2} fill={ph.stripe} opacity={0.12} />
        </pattern>
      </defs>
      <rect width="600" height="400" fill={ph.bg} />
      <rect width="600" height="400" fill={`url(#${stripeId})`} />
      <text x="40" y="370" fill={ph.ink} style={{ fontFamily: MONO, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</text>
    </svg>
  );
}

function AnimatedHeadline({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            opacity: 0,
            transform: 'translateY(0.9em)',
            animation: 'portfolioCharIn 0.9s cubic-bezier(0.2,0.8,0.2,1) forwards',
            animationDelay: `${delay + i * 0.03}s`,
            whiteSpace: 'pre',
          }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </>
  );
}

function ProjectCard({ p, onOpen }: { p: PortfolioProject; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      data-card
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: 'clamp(300px, 42vw, 580px)',
        scrollSnapAlign: 'start',
        cursor: 'pointer',
        background: ELEV,
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        overflow: 'hidden',
        transition: 'transform 0.5s ease, border-color 0.4s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        borderColor: hovered ? LIME : BORDER,
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '3/2', overflow: 'hidden' }}>
        <ProjectPlaceholder ph={p.ph} label={p.tag} />
        <div
          style={{
            position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: hovered ? 1 : 0, transition: 'opacity 0.4s ease',
          }}
        >
          <span style={{
            fontFamily: MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: LIME, padding: '10px 22px', border: `1px solid ${LIME}`, borderRadius: 100,
          }}>View Case →</span>
        </div>
      </div>
      <div style={{ padding: '24px 28px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontFamily: MONO, fontSize: 11, color: MUTED, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          <span>{p.num} / {p.tag}</span>
          <span>{p.year}</span>
        </div>
        <h3 style={{ fontFamily: DISPLAY, fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', marginBottom: 10, lineHeight: 1.05 }}>{p.name}</h3>
        <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.55 }}>{p.short}</p>
      </div>
    </motion.div>
  );
}

function ProjectModal({ p, onClose, onNav }: { p: PortfolioProject; onClose: () => void; onNav: (dir: -1 | 1) => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNav(-1);
      if (e.key === 'ArrowRight') onNav(1);
    };
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', handler);
    };
  }, [onClose, onNav]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(8px)', overflowY: 'auto', padding: '60px 20px' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 1100, margin: '0 auto', background: ELEV, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}
      >
        <div style={{ position: 'relative', aspectRatio: '16/9' }}>
          <ProjectPlaceholder ph={p.ph} label={p.tag} />
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute', top: 20, right: 20, width: 44, height: 44, borderRadius: 100,
              background: BG, border: `1px solid ${BORDER}`, color: FG, cursor: 'pointer',
              fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
        </div>
        <div style={{ padding: 'clamp(32px, 5vw, 64px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, fontFamily: MONO, fontSize: 11, color: MUTED, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            <span>{p.num} / {p.tag}</span>
            <span>{p.year}</span>
          </div>
          <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(36px, 5.5vw, 72px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 0.98, marginBottom: 28 }}>{p.name}</h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: FG, maxWidth: 720, marginBottom: 40 }}>{p.long}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 28, marginBottom: 40, borderTop: `1px solid ${BORDER}`, paddingTop: 32 }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: MUTED, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>Role</div>
              <div style={{ fontSize: 15 }}>{p.role}</div>
            </div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: MUTED, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>Stack</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {p.stack.map((s) => (
                  <span key={s} style={{ fontFamily: MONO, fontSize: 11, padding: '4px 10px', border: `1px solid ${BORDER}`, borderRadius: 100, color: FG }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {p.links.map((l) => (
              <Link key={l.href} href={l.href} className="portfolio-hover-lime" style={{
                fontFamily: MONO, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase',
                padding: '12px 22px', borderRadius: 100, border: `1px solid ${FG}`, color: FG,
                textDecoration: 'none', transition: 'all 0.3s ease',
              }}>{l.label} →</Link>
            ))}
            <button onClick={() => onNav(1)} style={{
              fontFamily: MONO, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase',
              padding: '12px 22px', borderRadius: 100, border: `1px solid ${BORDER}`, color: MUTED,
              background: 'transparent', cursor: 'pointer',
            }}>Next Project →</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function WorkPageContent({ works }: { works: Work[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [modalIdx, setModalIdx] = useState<number | null>(null);

  const updateActive = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>('[data-card]');
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

  const scrollBy = (dir: -1 | 1) => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    const w = card ? card.offsetWidth + 24 : 400;
    el.scrollBy({ left: dir * w, behavior: 'smooth' });
  };

  const navigate = useCallback((dir: -1 | 1) => {
    setModalIdx((cur) => {
      if (cur === null) return cur;
      const next = (cur + dir + PORTFOLIO_PROJECTS.length) % PORTFOLIO_PROJECTS.length;
      return next;
    });
  }, []);

  return (
    <div style={{ background: BG, color: FG, fontFamily: DISPLAY, minHeight: '100vh' }}>
      <style>{`
        @keyframes portfolioCharIn { to { opacity: 1; transform: none; } }
        @keyframes portfolioMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes portfolioPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .portfolio-hover-lime:hover { background: ${LIME} !important; color: ${BG} !important; border-color: ${LIME} !important; }
        .cap-item { transition: color 0.3s ease, padding 0.3s ease; }
        .cap-item:hover { color: ${LIME}; padding-left: 16px; }
        .portfolio-carousel::-webkit-scrollbar { display: none; }
      `}</style>

      {/* HERO */}
      <section style={{ minHeight: '100vh', padding: 'clamp(24px, 4vw, 56px)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED }}>
          <span style={{ color: FG }}>Aspire Kinetic Network <span style={{ color: LIME }}>/</span> Work</span>
          <span>Portfolio · 2026</span>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingTop: 'clamp(40px, 8vw, 120px)' }}>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(44px, 8.2vw, 130px)', lineHeight: 0.92, letterSpacing: '-0.035em' }}>
            <div><AnimatedHeadline text="Building" delay={0.1} /></div>
            <div>
              <span style={{ fontFamily: SERIF, fontStyle: 'italic', paddingRight: '0.12em', marginRight: '0.08em' }}>
                <AnimatedHeadline text="digital " delay={0.35} />
              </span>
              <AnimatedHeadline text="presence" delay={0.7} />
            </div>
            <div>
              <AnimatedHeadline text="that " delay={0.95} />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '4px 20px 8px', background: LIME, color: BG, borderRadius: 100, transform: 'translateY(-0.1em)', fontSize: '0.82em' }}>
                <AnimatedHeadline text="performs" delay={1.2} />
                <span style={{ display: 'inline-block', width: '0.65em', height: '0.65em', borderTop: '2px solid currentColor', borderRight: '2px solid currentColor', transform: 'rotate(45deg) translate(-10%,10%)' }} />
              </span>
            </div>
          </h1>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 40, flexWrap: 'wrap' }}>
          <p style={{ maxWidth: 460, color: MUTED, fontSize: 15, lineHeight: 1.6 }}>
            A growing portfolio of work in web design, local SEO, and digital strategy — each project built to help businesses show up, stand out, and grow.
          </p>
          <a href="#work" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: FG, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 12 }}>
            Scroll to Work <span style={{ display: 'inline-block', width: 32, height: 1, background: FG }} />
          </a>
        </div>
        <div style={{ position: 'absolute', bottom: -20, left: 0, right: 0, whiteSpace: 'nowrap', fontFamily: DISPLAY, fontSize: 'clamp(100px, 20vw, 300px)', fontWeight: 500, letterSpacing: '-0.04em', color: 'transparent', WebkitTextStroke: `1px ${BORDER}`, animation: 'portfolioMarquee 40s linear infinite', pointerEvents: 'none' }}>
          WORK · WORK · WORK · WORK · WORK · WORK · WORK · WORK · WORK · WORK ·
        </div>
      </section>

      {/* CAROUSEL */}
      <section id="work" style={{ padding: 'clamp(60px, 10vw, 140px) 0' }}>
        <div style={{ padding: '0 clamp(24px, 4vw, 56px)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: LIME, marginBottom: 14 }}>
              ◇ Selected Capabilities
            </div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(32px, 4.5vw, 60px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1 }}>
              What we{' '}
              <span style={{ fontFamily: SERIF, fontStyle: 'italic', color: MUTED }}>build</span>.
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Previous"
              onMouseEnter={(e) => { e.currentTarget.style.background = LIME; e.currentTarget.style.color = BG; e.currentTarget.style.borderColor = LIME; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = FG; e.currentTarget.style.borderColor = BORDER; }}
              style={{ width: 52, height: 52, borderRadius: 100, border: `1px solid ${BORDER}`, background: 'transparent', color: FG, cursor: 'pointer', fontSize: 18, transition: 'all 0.3s ease' }}
            >←</button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Next"
              onMouseEnter={(e) => { e.currentTarget.style.background = LIME; e.currentTarget.style.color = BG; e.currentTarget.style.borderColor = LIME; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = FG; e.currentTarget.style.borderColor = BORDER; }}
              style={{ width: 52, height: 52, borderRadius: 100, border: `1px solid ${BORDER}`, background: 'transparent', color: FG, cursor: 'pointer', fontSize: 18, transition: 'all 0.3s ease' }}
            >→</button>
          </div>
        </div>
        <div
          ref={carouselRef}
          onScroll={updateActive}
          className="portfolio-carousel"
          style={{ display: 'flex', gap: 24, overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', padding: '0 clamp(24px, 4vw, 56px) 16px', scrollPaddingLeft: 'clamp(24px, 4vw, 56px)' }}
        >
          {PORTFOLIO_PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} p={p} onOpen={() => setModalIdx(i)} />
          ))}
          <div style={{ flexShrink: 0, width: 1 }} />
        </div>
        <div style={{ padding: '24px clamp(24px, 4vw, 56px) 0', display: 'flex', justifyContent: 'center', gap: 8 }}>
          {PORTFOLIO_PROJECTS.map((_, i) => (
            <span key={i} style={{ width: i === activeIdx ? 28 : 8, height: 4, borderRadius: 4, background: i === activeIdx ? LIME : BORDER, transition: 'all 0.4s ease' }} />
          ))}
        </div>
      </section>

      {/* APPROACH */}
      <section style={{ padding: 'clamp(60px, 10vw, 140px) clamp(24px, 4vw, 56px)', borderTop: `1px solid ${BORDER}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(40px, 6vw, 80px)', maxWidth: 1400, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: LIME, marginBottom: 20 }}>◇ The Approach</div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(36px, 5vw, 72px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 28 }}>
              Work that{' '}
              <span style={{ fontFamily: SERIF, fontStyle: 'italic' }}>moves</span>{' '}
              the number that matters.
            </h2>
            <p style={{ color: MUTED, fontSize: 16, lineHeight: 1.65, maxWidth: 520 }}>
              We don&apos;t chase vanity metrics. Every project is scoped to a measurable outcome: more calls, more leads, more first-page rankings. The work is only as good as what it earns you.
            </p>
          </motion.div>
          <motion.ul initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {CAPABILITIES.map((cap, i) => (
              <li key={cap} className="cap-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '22px 0', borderBottom: `1px solid ${BORDER}`, fontSize: 18, cursor: 'default' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: MUTED, letterSpacing: '0.15em' }}>{String(i + 1).padStart(2, '0')}</span>
                  {cap}
                </span>
                <span style={{ color: MUTED, fontSize: 18 }}>→</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* REAL CLIENT WORKS */}
      {works.length > 0 && (
        <section style={{ padding: 'clamp(60px, 10vw, 140px) clamp(24px, 4vw, 56px)', borderTop: `1px solid ${BORDER}` }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: LIME, marginBottom: 14 }}>◇ Client Work</div>
              <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(32px, 4.5vw, 60px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1 }}>
                Live{' '}
                <span style={{ fontFamily: SERIF, fontStyle: 'italic' }}>engagements</span>.
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
              {works.map((w, i) => (
                <motion.article key={w.id} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, delay: i * 0.05 }} style={{ background: ELEV, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden' }}>
                  {w.cover_image_url && (
                    <div style={{ position: 'relative', aspectRatio: '3/2', overflow: 'hidden' }}>
                      <Image src={w.cover_image_url} alt={w.title} fill sizes="(max-width:768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ padding: '24px 28px 28px' }}>
                    {w.client_name && <div style={{ fontFamily: MONO, fontSize: 11, color: LIME, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>{w.client_name}</div>}
                    <h3 style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 500, letterSpacing: '-0.02em', marginBottom: 10, lineHeight: 1.1 }}>{w.title}</h3>
                    <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.55, marginBottom: 16 }}>{w.description}</p>
                    {w.services_used.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                        {w.services_used.map((s) => (<span key={s} style={{ fontFamily: MONO, fontSize: 10, padding: '4px 10px', border: `1px solid ${BORDER}`, borderRadius: 100, color: MUTED, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s}</span>))}
                      </div>
                    )}
                    {w.results && (
                      <div style={{ padding: 14, background: BG, border: `1px solid ${BORDER}`, borderRadius: 6 }}>
                        <div style={{ fontFamily: MONO, fontSize: 10, color: LIME, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4 }}>Results</div>
                        <p style={{ fontSize: 13, color: FG }}>{w.results}</p>
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: 'clamp(80px, 12vw, 180px) clamp(24px, 4vw, 56px)', borderTop: `1px solid ${BORDER}`, textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(44px, 7vw, 110px)', fontWeight: 400, letterSpacing: '-0.035em', lineHeight: 0.95, marginBottom: 40 }}>
            Let&apos;s build something{' '}
            <span style={{ fontFamily: SERIF, fontStyle: 'italic' }}>that stands out.</span>
          </h2>
          <Link href="/claim" className="portfolio-hover-lime" style={{
            display: 'inline-flex', alignItems: 'center', gap: 14, padding: '18px 38px', borderRadius: 100,
            border: `1px solid ${FG}`, color: FG, fontFamily: MONO, fontSize: 12,
            letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.3s ease',
          }}>Start a project →</Link>
        </motion.div>
      </section>

      {/* FOOTER STRIP */}
      <footer style={{ padding: '28px clamp(24px, 4vw, 56px)', borderTop: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap', fontFamily: MONO, fontSize: 11, color: MUTED, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        <span>© 2026 Aspire Kinetic Network</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: 100, background: LIME, animation: 'portfolioPulse 2s ease-in-out infinite' }} />
          Available for new clients
        </span>
        <Link href="/" style={{ color: FG, textDecoration: 'none' }}>← Back to Studio</Link>
      </footer>

      <AnimatePresence>
        {modalIdx !== null && (
          <ProjectModal
            key={PORTFOLIO_PROJECTS[modalIdx].id}
            p={PORTFOLIO_PROJECTS[modalIdx]}
            onClose={() => setModalIdx(null)}
            onNav={navigate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
