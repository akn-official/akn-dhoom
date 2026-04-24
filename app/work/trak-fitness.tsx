'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

/* ─── Design tokens ─────────────────────────────────────────── */
const BG    = '#0D0608';
const BG1   = '#160b0f';
const BG2   = '#1d1018';
const LINE  = '#2a1219';
const LINE2 = '#3d1c26';
const INK   = '#F5EFE4';
const DIM   = '#a88090';
const FAINT = '#6d4d58';
const LIME  = '#9B2335';
const LIME2 = '#B83048';

const DISPLAY = "var(--font-trak-display, 'Anton', Impact, sans-serif)";
const MONO    = "var(--font-portfolio-mono, 'JetBrains Mono', monospace)";

/* ─── Shared reveal wrapper ─────────────────────────────────── */
function Reveal({ children, delay = 0, y = 28 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── SVG Placeholder (replaces missing photos) ─────────────── */
function Placeholder({ label, dark = false }: { label: string; dark?: boolean }) {
  return (
    <div style={{ width: '100%', height: '100%', background: dark ? BG : BG2, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(45deg, ${LINE} 0, ${LINE} 1px, transparent 0, transparent 50%)`, backgroundSize: '14px 14px', opacity: 0.5 }} />
      <span style={{ position: 'relative', fontFamily: MONO, fontSize: 10, color: FAINT, letterSpacing: '0.14em', textTransform: 'uppercase', textAlign: 'center', padding: '0 16px' }}>{label}</span>
    </div>
  );
}

/* ─── Nav ───────────────────────────────────────────────────── */
function TrakNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const el = document.querySelector('.trak-scroll-container');
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 40);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      padding: scrolled ? '14px 48px' : '20px 48px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: scrolled ? 'rgba(13,6,8,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? `1px solid ${LINE}` : 'none',
      transition: 'all 0.35s ease',
    }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 22, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: LIME, boxShadow: `0 0 20px ${LIME}60`, display: 'inline-block' }} />
        Trak<span style={{ color: LIME }}>/</span>Fitness
      </div>
      <div style={{ display: 'flex', gap: 28 }}>
        {['Why Trak', 'Journey', 'Coaches', 'Join'].map((l) => (
          <span key={l} style={{ fontFamily: MONO, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: DIM, cursor: 'pointer' }}>{l}</span>
        ))}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', padding: '10px 18px', background: LIME, color: INK, fontWeight: 600, cursor: 'pointer' }}>
        Book a Visit →
      </div>
    </nav>
  );
}

/* ─── Urgency bar ───────────────────────────────────────────── */
function UrgencyBar() {
  return (
    <div style={{ background: LIME, padding: '10px 48px', display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
      {[
        <><span style={{ fontFamily: MONO, fontSize: 11 }}>●</span> <strong>15</strong> free trial slots left this week</>,
        <>Next intake starts <strong>Monday</strong></>,
        <>5.0 ★ · 468 members</>,
      ].map((item, i) => (
        <span key={i} style={{ fontFamily: MONO, fontSize: 11, color: INK, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
          {item}
        </span>
      ))}
    </div>
  );
}

/* ─── Hero ──────────────────────────────────────────────────── */
function TrakHero() {
  const words = ['Not a gym.', 'A guided', 'transformation', 'system.'];
  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 'clamp(80px,10vw,140px) clamp(24px,4vw,48px) clamp(60px,8vw,100px)', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glows */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${LIME}18 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${LIME}10 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.2em', color: DIM, marginBottom: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: LIME, display: 'inline-block', animation: 'trakPulse 2s ease-in-out infinite' }} />
        Chennai&apos;s Highest-Rated Coaching Gym · ★★★★★ 468 members · 5.0
      </motion.div>

      <h1 style={{ fontFamily: DISPLAY, fontSize: 'clamp(64px, 12vw, 160px)', lineHeight: 0.88, letterSpacing: '-0.01em', textTransform: 'uppercase', marginBottom: 40 }}>
        {words.map((word, i) => (
          <motion.div key={word}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.15 + i * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ display: 'block', color: i === 1 || i === 2 ? LIME : INK }}
          >
            {word}
          </motion.div>
        ))}
      </h1>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.7 }}
        style={{ maxWidth: 520, color: DIM, fontSize: 17, lineHeight: 1.6, margin: '0 auto 44px' }}>
        You don&apos;t need to know where to start. You don&apos;t need to be fit already.
        You just need one coach who shows up for you — and a room that makes consistency feel easy.{' '}
        <strong style={{ color: INK }}>We&apos;ll take it from there.</strong>
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.9 }}
        style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '18px 28px', fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600, background: LIME, color: INK, border: 'none', cursor: 'pointer', transition: 'all 0.25s ease' }}>
          Start Your Transformation <span>→</span>
        </button>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '18px 28px', fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600, background: 'transparent', color: INK, border: `1px solid ${LINE2}`, cursor: 'pointer' }}>
          Try First Workout <strong style={{ color: LIME2 }}>FREE</strong>
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.1 }}
        style={{ marginTop: 16, fontFamily: MONO, fontSize: 10, color: FAINT, letterSpacing: '0.12em' }}>
        ✓ Only 15 free trial slots this week · No card required
      </motion.div>
    </section>
  );
}

/* ─── Stats strip ───────────────────────────────────────────── */
function StatsStrip() {
  const stats = [
    { val: '468', label: 'Active Members' },
    { val: '5.0', label: 'Average Rating' },
    { val: '4', label: 'Expert Coaches' },
    { val: '6 wk', label: 'Avg. First Visible Change' },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
      {stats.map((s, i) => (
        <motion.div key={s.label}
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
          style={{ padding: '36px 48px', borderRight: i < 3 ? `1px solid ${LINE}` : 'none', textAlign: i === 0 ? 'left' : 'center' }}
        >
          <div style={{ fontFamily: DISPLAY, fontSize: 'clamp(40px,5vw,64px)', lineHeight: 1, color: i % 2 === 0 ? LIME : INK }}>{s.val}</div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: DIM, letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 8 }}>{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Journey steps ─────────────────────────────────────────── */
function TrakJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    { n: '01', title: 'Walk In', body: 'Free first visit. No pressure pitch. We assess, you decide. Takes 45 minutes.' },
    { n: '02', title: 'Get Mapped', body: 'Body analysis, goal conversation, a written plan for your first 30 days. Built for you, not a template.' },
    { n: '03', title: 'Get Coached', body: 'Every session, someone watches. Form calls, weight progressions, honest feedback — the hours you put in actually compound.' },
    { n: '04', title: 'Become', body: "Most members hit their first visible change by week 6. The discipline outlasts the photo. That's the real prize." },
  ];

  return (
    <section style={{ padding: 'clamp(80px,10vw,140px) clamp(24px,4vw,48px)', borderTop: `1px solid ${LINE}` }}>
      <div ref={ref}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 80, flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 11, color: LIME, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>05 / Method</div>
              <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(48px,8vw,100px)', lineHeight: 0.88, textTransform: 'uppercase' }}>
                From doubt<br />to <span style={{ color: LIME }}>done.</span>
              </h2>
            </div>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 0, borderTop: `1px solid ${LINE}` }}>
          {steps.map((s, i) => (
            <motion.div key={s.n}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.15, ease: [0.2, 0.8, 0.2, 1] }}
              style={{ padding: '48px 36px', borderRight: i < 3 ? `1px solid ${LINE}` : 'none', position: 'relative' }}
            >
              <div style={{ fontFamily: MONO, fontSize: 10, color: LIME, letterSpacing: '0.2em', marginBottom: 24 }}>STAGE {s.n}</div>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: inView ? LIME : LINE2, border: `2px solid ${inView ? LIME : FAINT}`, marginBottom: 20, transition: `background 0.5s ease ${i * 0.2}s, border-color 0.5s ease ${i * 0.2}s` }} />
              <h3 style={{ fontFamily: DISPLAY, fontSize: 'clamp(32px,3vw,48px)', textTransform: 'uppercase', lineHeight: 0.95, marginBottom: 16 }}>{s.title}</h3>
              <p style={{ color: DIM, fontSize: 15, lineHeight: 1.6 }}>{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ──────────────────────────────────────────── */
function TrakTestimonials() {
  const quotes = [
    { body: "I was the person who quit every gym in three weeks. Nine months in, still showing up. The coaches actually remember your name — and your goals.", name: "AR · Y1", meta: "9 months in" },
    { body: "Walked in terrified of the barbell. Left deadlifting my bodyweight. They fix your form before your ego gets in the way.", name: "PS · Y2", meta: "1 year in" },
    { body: "Best part isn't the equipment. It's the 7am message asking why I wasn't in yesterday. Accountability, built in.", name: "KV · Y3", meta: "6 months in" },
    { body: "Clean, no-ego, serious training. Zero posturing. You come to work, everyone's working. That's rare anywhere I've trained.", name: "MJ · Y4", meta: "2 years in" },
    { body: "Lost 14 kilos. Gained a spine. The posture corrections alone changed my office back pain forever.", name: "RD · Y5", meta: "8 months in" },
    { body: "I've trained in three cities. Nothing touches the individual attention here. You're not a number on the board.", name: "AT · Y6", meta: "1.5 years in" },
  ];

  return (
    <section style={{ padding: 'clamp(80px,10vw,140px) 0', borderTop: `1px solid ${LINE}` }}>
      <div style={{ padding: '0 clamp(24px,4vw,48px)', marginBottom: 64 }}>
        <Reveal>
          <div style={{ fontFamily: MONO, fontSize: 11, color: LIME2, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>02 / Social Proof</div>
          <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(48px,8vw,100px)', lineHeight: 0.88, textTransform: 'uppercase' }}>
            468 reviews.<br />
            <span style={{ color: LIME }}>Zero</span> below five.
          </h2>
        </Reveal>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 1, borderTop: `1px solid ${LINE}` }}>
        {quotes.map((q, i) => (
          <Reveal key={i} delay={i * 0.07}>
            <div style={{ padding: '40px 36px', background: i % 2 === 0 ? BG : BG1, borderRight: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, height: '100%' }}>
              <div style={{ fontSize: 48, color: LIME, lineHeight: 1, marginBottom: 12, fontFamily: DISPLAY }}>&ldquo;</div>
              <p style={{ color: INK, fontSize: 16, lineHeight: 1.6, marginBottom: 28 }}>{q.body}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 10, color: INK, fontWeight: 700 }}>{q.name.slice(0,2)}</div>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: INK, letterSpacing: '0.12em' }}>{q.name}</div>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: FAINT, letterSpacing: '0.1em' }}>{q.meta}</div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─── Why Trak ──────────────────────────────────────────────── */
function TrakWhy() {
  const items = [
    { num: '01', title: 'We See You Show Up', sub: "You don't need to know where to start. A coach walks you through your first rep to your first deadlift — at whatever pace your body needs." },
    { num: '02', title: "We Notice When You Don't", sub: "Miss a day, get a warm check-in. Not pushy — caring. The hardest part of training is showing up. We make it feel like you're expected." },
    { num: '03', title: 'The Space Feels Human', sub: "No mirror flexing. No grunt squad. Just a clean, warm floor where beginners and lifetime lifters share space with quiet respect." },
    { num: '04', title: 'You Leave With Confidence', sub: "We don't just build bodies. We build the version of you that doesn't flinch in photos, sleeps better, and walks taller into every room." },
  ];

  return (
    <section style={{ padding: 'clamp(80px,10vw,140px) clamp(24px,4vw,48px)', borderTop: `1px solid ${LINE}` }}>
      <Reveal>
        <div style={{ fontFamily: MONO, fontSize: 11, color: LIME2, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>06 / Why Trak</div>
        <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(48px,8vw,100px)', lineHeight: 0.88, textTransform: 'uppercase', marginBottom: 80 }}>
          Most gyms sell <span style={{ WebkitTextStroke: `2px ${INK}`, color: 'transparent' }}>access.</span><br />
          We sell <span style={{ color: LIME }}>change.</span>
        </h2>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 0, borderTop: `1px solid ${LINE}` }}>
        {items.map((it, i) => (
          <Reveal key={it.num} delay={i * 0.1}>
            <div style={{ padding: '48px 36px', borderRight: i < 3 ? `1px solid ${LINE}` : 'none', borderBottom: `1px solid ${LINE}` }}>
              <div style={{ fontFamily: MONO, fontSize: 11, color: LIME, letterSpacing: '0.2em', marginBottom: 20 }}>{it.num}</div>
              <h3 style={{ fontFamily: DISPLAY, fontSize: 'clamp(24px,2.5vw,36px)', textTransform: 'uppercase', lineHeight: 0.95, marginBottom: 16 }}>{it.title}</h3>
              <p style={{ color: DIM, fontSize: 15, lineHeight: 1.6 }}>{it.sub}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─── Trainers ──────────────────────────────────────────────── */
function TrakTrainers() {
  const trainers = [
    { name: 'Coach V.', role: 'Head Coach', quote: "If you don't know where to start, I'll guide you. Literally rep by rep." },
    { name: 'Coach D.', role: 'Performance Coach', quote: "I fix the body your desk job gave you. We'll fix the mindset too." },
    { name: 'Coach R.', role: 'Transformation Lead', quote: "You don't need willpower. You need a plan and someone checking in. That's me." },
    { name: 'Coach A.', role: 'Beginner Specialist', quote: "First day at a gym is scary. I remember. You'll be okay — I promise." },
  ];

  return (
    <section style={{ padding: 'clamp(80px,10vw,140px) clamp(24px,4vw,48px)', borderTop: `1px solid ${LINE}`, background: BG1 }}>
      <Reveal>
        <div style={{ fontFamily: MONO, fontSize: 11, color: LIME2, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>07 / Your Coach</div>
        <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(48px,8vw,100px)', lineHeight: 0.88, textTransform: 'uppercase', marginBottom: 64 }}>
          The people who will<br /><span style={{ color: LIME }}>have your back.</span>
        </h2>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 24 }}>
        {trainers.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.1}>
            <div style={{ background: BG2, border: `1px solid ${LINE}`, overflow: 'hidden' }}>
              <div style={{ aspectRatio: '3/4', position: 'relative' }}>
                <Placeholder label={`${t.name}\n${t.role}`} dark />
                <div style={{ position: 'absolute', top: 14, left: 14, fontFamily: MONO, fontSize: 10, color: LIME, background: BG, padding: '4px 8px', letterSpacing: '0.12em' }}>
                  Coach / 0{i + 1}
                </div>
              </div>
              <div style={{ padding: '20px 24px 24px' }}>
                <div style={{ fontFamily: DISPLAY, fontSize: 24, textTransform: 'uppercase', marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: LIME, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>{t.role}</div>
                <p style={{ color: DIM, fontSize: 14, lineHeight: 1.55 }}>"{t.quote}"</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─── Membership ────────────────────────────────────────────── */
function TrakMembership() {
  const [slots, setSlots] = useState(12);

  useEffect(() => {
    const t = setInterval(() => setSlots((s) => (s > 8 ? s : 12)), 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{ padding: 'clamp(80px,10vw,140px) clamp(24px,4vw,48px)', borderTop: `1px solid ${LINE}` }}>
      <Reveal>
        <div style={{ fontFamily: MONO, fontSize: 11, color: LIME, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>08 / Join</div>
        <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(48px,8vw,100px)', lineHeight: 0.88, textTransform: 'uppercase', marginBottom: 64 }}>
          Good coaches<br />don&apos;t <span style={{ color: LIME }}>scale.</span>
        </h2>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 64, alignItems: 'start' }}>
        <Reveal delay={0.1}>
          <h3 style={{ fontFamily: DISPLAY, fontSize: 'clamp(32px,4vw,56px)', textTransform: 'uppercase', lineHeight: 0.95, marginBottom: 24 }}>
            Personal coaching<br />is <span style={{ color: LIME }}>capped.</span><br />On purpose.
          </h3>
          <p style={{ color: DIM, fontSize: 16, lineHeight: 1.6, maxWidth: 440, marginBottom: 36 }}>
            Every Trak coach caps their roster. No member gets diluted attention. When slots run out, we open a waitlist — not add bodies to the floor. This month has{' '}
            <strong style={{ color: INK }}>{slots}</strong> open spots across all coaches.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '18px 28px', fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600, background: LIME, color: INK, border: 'none', cursor: 'pointer' }}>
              Claim Your Slot →
            </button>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '18px 28px', fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600, background: 'transparent', color: INK, border: `1px solid ${LINE2}`, cursor: 'pointer' }}>
              Book a Free Visit
            </button>
          </div>
        </Reveal>

        {/* Slots widget */}
        <Reveal delay={0.2}>
          <div style={{ background: BG1, border: `1px solid ${LINE}`, padding: '36px 32px' }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: LIME, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: LIME, display: 'inline-block', animation: 'trakPulse 2s ease-in-out infinite' }} />
              Live Availability · Apr 2026
            </div>
            <div style={{ fontFamily: DISPLAY, fontSize: 'clamp(80px,12vw,140px)', lineHeight: 1, color: LIME }}>{String(slots).padStart(2, '0')}</div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: DIM, letterSpacing: '0.12em', marginBottom: 20 }}>coaching slots remaining this month</div>
            <div style={{ height: 4, background: LINE2, borderRadius: 2, marginBottom: 8, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(slots / 40) * 100}%` }}
                transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
                style={{ height: '100%', background: LIME, borderRadius: 2 }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 10, color: FAINT, marginBottom: 28 }}>
              <span>Filled · 28</span><span>Cap · 40</span>
            </div>
            <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: 24 }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: DIM, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>Membership</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontFamily: DISPLAY, fontSize: 44, lineHeight: 1 }}>
                  ₹4,999<span style={{ fontFamily: MONO, fontSize: 11, color: DIM, marginLeft: 8 }}>/mo</span>
                </div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: LIME, letterSpacing: '0.12em' }}>Save 20% quarterly</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Final CTA ─────────────────────────────────────────────── */
function TrakFinalCTA() {
  return (
    <section style={{ padding: 'clamp(100px,14vw,180px) clamp(24px,4vw,48px)', borderTop: `1px solid ${LINE}`, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: `radial-gradient(circle, ${LIME}14 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <Reveal>
        <div style={{ fontFamily: MONO, fontSize: 11, color: LIME, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 32 }}>09 / The Decision</div>
        <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(56px,10vw,130px)', lineHeight: 0.88, textTransform: 'uppercase', marginBottom: 32 }}>
          <div style={{ WebkitTextStroke: `2px ${INK}`, color: 'transparent' }}>Stop waiting.</div>
          <div style={{ color: LIME }}>Start becoming.</div>
        </h2>
        <p style={{ color: DIM, fontSize: 18, maxWidth: 540, margin: '0 auto 48px', lineHeight: 1.6 }}>
          The version of you that walks out of here in six months — they started today. Not Monday. Not next month. Today.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '20px 36px', fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600, background: LIME, color: INK, border: 'none', cursor: 'pointer' }}>
            Book Your Free Workout →
          </button>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '20px 36px', fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600, background: 'transparent', color: INK, border: `1px solid ${LINE2}`, cursor: 'pointer' }}>
            Meet the Coaches
          </button>
        </div>
      </Reveal>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────── */
function TrakFooter() {
  return (
    <footer style={{ padding: '32px clamp(24px,4vw,48px)', borderTop: `1px solid ${LINE}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap', fontFamily: MONO, fontSize: 11, color: FAINT, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
      <span style={{ fontFamily: DISPLAY, fontSize: 18, color: INK }}>Trak<span style={{ color: LIME }}>/</span>Fitness</span>
      <span>Chennai · Est. 2023</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: LIME, display: 'inline-block', animation: 'trakPulse 2s ease-in-out infinite' }} />
        Accepting new members
      </span>
    </footer>
  );
}

/* ─── Root component ─────────────────────────────────────────── */
export function TrakFitnessDesign() {
  return (
    <div style={{ background: BG, color: INK, minHeight: '100vh' }} className="trak-scroll-container">
      <style>{`
        @keyframes trakPulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        @keyframes trakMarquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        .trak-scroll-container { overflow-y:auto; height:100%; }
      `}</style>

      <TrakNav />
      <UrgencyBar />
      <TrakHero />
      <StatsStrip />
      <TrakJourney />
      <TrakTestimonials />
      <TrakWhy />
      <TrakTrainers />
      <TrakMembership />
      <TrakFinalCTA />
      <TrakFooter />
    </div>
  );
}
