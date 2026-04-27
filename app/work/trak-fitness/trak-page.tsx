'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TRAK_CSS } from './trak-styles';

/* ─── Themes ─────────────────────────────────────────────── */
const THEMES: Record<string, { label: string; bg: string; accent: string; vars: Record<string, string> }> = {
  ember:         { label: 'Ember',        bg: '#F5EFE4', accent: '#E8833A', vars: { '--bg':'#F5EFE4','--bg-1':'#EFE6D5','--bg-2':'#E7DCC7','--line':'#D9CCB4','--line-2':'#B8A784','--ink':'#1C120E','--ink-dim':'#6B5D51','--ink-faint':'#9A8E80','--accent':'#E8833A','--accent-deep':'#B8561F','--accent-rgb':'232,131,58','--burgundy':'#6E1E2B','--burgundy-rgb':'110,30,43','--charcoal':'#231915','--grain-blend':'multiply' } },
  'midnight-lime':{ label: 'Midnight Lime', bg: '#0A0A0A', accent: '#D4FF3A', vars: { '--bg':'#0A0A0A','--bg-1':'#111111','--bg-2':'#161616','--line':'#1f1f1f','--line-2':'#2a2a2a','--ink':'#F5F3EE','--ink-dim':'#8a8a85','--ink-faint':'#5a5a55','--accent':'#D4FF3A','--accent-deep':'#A8D42A','--accent-rgb':'212,255,58','--burgundy':'#1a3a0a','--burgundy-rgb':'26,58,10','--charcoal':'#050505','--grain-blend':'overlay' } },
  'blood-orange':{ label: 'Blood Orange', bg: '#0A0706', accent: '#FF4A1C', vars: { '--bg':'#0A0706','--bg-1':'#140E0B','--bg-2':'#1A120E','--line':'#241914','--line-2':'#33241C','--ink':'#F5EDE6','--ink-dim':'#8a7f75','--ink-faint':'#5a5048','--accent':'#FF4A1C','--accent-deep':'#CC3A16','--accent-rgb':'255,74,28','--burgundy':'#4a1008','--burgundy-rgb':'74,16,8','--charcoal':'#060302','--grain-blend':'overlay' } },
  'ice-electric':{ label: 'Ice Electric',  bg: '#06090F', accent: '#2AE5FF', vars: { '--bg':'#06090F','--bg-1':'#0C1119','--bg-2':'#111825','--line':'#1a2130','--line-2':'#2a3446','--ink':'#EEF3F8','--ink-dim':'#7f8a98','--ink-faint':'#4d5668','--accent':'#2AE5FF','--accent-deep':'#1DB5CC','--accent-rgb':'42,229,255','--burgundy':'#0a1a3a','--burgundy-rgb':'10,26,58','--charcoal':'#020408','--grain-blend':'overlay' } },
  'bone-crimson':{ label: 'Bone & Crimson',bg: '#F4F1EB', accent: '#DC2626', vars: { '--bg':'#F4F1EB','--bg-1':'#EAE6DD','--bg-2':'#E0DACE','--line':'#D2CBBB','--line-2':'#B8B1A0','--ink':'#141311','--ink-dim':'#55514a','--ink-faint':'#8a857b','--accent':'#DC2626','--accent-deep':'#991B1B','--accent-rgb':'220,38,38','--burgundy':'#7f1d1d','--burgundy-rgb':'127,29,29','--charcoal':'#1a1a1a','--grain-blend':'multiply' } },
  'toxic-violet':{ label: 'Toxic Violet',  bg: '#0B0713', accent: '#B4FF00', vars: { '--bg':'#0B0713','--bg-1':'#130C1E','--bg-2':'#1B1129','--line':'#281936','--line-2':'#3a2550','--ink':'#F3EEFC','--ink-dim':'#8a7fa0','--ink-faint':'#5a5068','--accent':'#B4FF00','--accent-deep':'#8AC200','--accent-rgb':'180,255,0','--burgundy':'#2a0a4a','--burgundy-rgb':'42,10,74','--charcoal':'#040209','--grain-blend':'overlay' } },
  'sand-ink':    { label: 'Sand & Ink',    bg: '#1A1814', accent: '#E8B765', vars: { '--bg':'#1A1814','--bg-1':'#22201B','--bg-2':'#2A2822','--line':'#363229','--line-2':'#4a4439','--ink':'#EAE4D5','--ink-dim':'#8f887a','--ink-faint':'#5f584d','--accent':'#E8B765','--accent-deep':'#B88A3E','--accent-rgb':'232,183,101','--burgundy':'#3a2a10','--burgundy-rgb':'58,42,16','--charcoal':'#0d0c0a','--grain-blend':'overlay' } },
};

function applyTheme(key: string) {
  const t = THEMES[key];
  if (!t) return;
  const root = document.getElementById('trak-root');
  if (!root) return;
  Object.entries(t.vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

/* ─── Placeholder ────────────────────────────────────────── */
type PhVariant = 'stripes' | 'lime' | 'contrast' | 'burgundy' | 'before' | 'after';
function Placeholder({ variant = 'stripes', label, center, style }: { variant?: PhVariant; label?: string; center?: string; style?: React.CSSProperties }) {
  const cls = `ph ph-${variant}`;
  return (
    <div className={cls} style={style}>
      {label && <div className="ph-label">{label}</div>}
      {center && <div className="ph-center-label">{center}</div>}
    </div>
  );
}

/* ─── UrgencyBar ─────────────────────────────────────────── */
function UrgencyBar() {
  return (
    <div className="urgency-bar">
      <div className="container urgency-bar-inner">
        <div className="ub-item"><span className="ub-dot" /><strong>15</strong> free trial slots left this week</div>
        <div className="ub-sep">/</div>
        <div className="ub-item">Next intake batch starts <strong>Monday</strong></div>
        <div className="ub-sep">/</div>
        <div className="ub-item">5.0 ★ · 468 members</div>
      </div>
    </div>
  );
}

/* ─── TrakNav ────────────────────────────────────────────── */
function TrakNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className={`trak-nav${scrolled ? ' scrolled' : ''}`}>
      <a href="#" className="trak-logo" style={{ color: 'var(--accent)' }}>
        <span className="logo-mark" />
        Trak<span style={{ color: 'var(--accent)' }}>/</span>Fitness
      </a>
      <div className="nav-links">
        <a href="#why">Why Trak</a>
        <a href="#trainers">Trainers</a>
        <a href="#journey">Journey</a>
        <a href="#membership">Membership</a>
        <a href="#location">Location</a>
      </div>
      <a href="#membership" className="nav-cta">Book a Visit →</a>
    </nav>
  );
}

/* ─── Hero ───────────────────────────────────────────────── */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const t = requestAnimationFrame(() => setLoaded(true));
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(t); window.removeEventListener('scroll', onScroll); };
  }, []);
  const parallax = Math.min(scrollY * 0.4, 400);
  const fade = Math.max(1 - scrollY / 600, 0);
  return (
    <section className={`hero-cine${loaded ? ' loaded' : ''}`}>
      <div className="hero-bg-stack" aria-hidden>
        <div className="hero-bg-layer hero-bg-far" style={{ transform: `translate3d(0,${parallax * 0.3}px,0) scale(1.05)`, opacity: fade }} />
        <div className="hero-bg-layer hero-bg-mid" style={{ transform: `translate3d(0,${parallax * 0.55}px,0) scale(1.02)`, opacity: fade }} />
        <div className="hero-bg-layer hero-bg-near" style={{ transform: `translate3d(0,${parallax * 0.8}px,0)`, opacity: fade * 0.85 }} />
        <div className="hero-grid" />
        <div className="hero-vignette" />
        <div className="hero-scanline" />
      </div>
      <div className="ribbon ribbon-top" aria-hidden>
        <div className="ribbon-track">
          <span>● BUILT NOT BOUGHT ● TRANSFORM ● DISCIPLINE ● TRAK FITNESS ● BUILT NOT BOUGHT ● TRANSFORM ● DISCIPLINE ● TRAK FITNESS ●</span>
          <span>● BUILT NOT BOUGHT ● TRANSFORM ● DISCIPLINE ● TRAK FITNESS ● BUILT NOT BOUGHT ● TRANSFORM ● DISCIPLINE ● TRAK FITNESS ●</span>
        </div>
      </div>
      <div className="hero-watermark" aria-hidden>TRAK</div>
      <div className="hero-index hero-index-left" aria-hidden>
        <span>N°</span><span className="big">001</span><span>EST · MMXXVI</span>
      </div>
      <div className="hero-index hero-index-right" aria-hidden>
        <span className="vert">CHENNAI / IN</span>
      </div>
      <div className="hero-content">
        <div className="hero-eyebrow hero-anim" style={{ '--d': '0ms' } as React.CSSProperties}>
          <span className="hero-eyebrow-dot" />
          <span>Chennai&apos;s Highest-Rated Coaching Gym</span>
          <span className="hero-eyebrow-sep">/</span>
          <span className="hero-eyebrow-stars">★★★★★</span>
          <span>468 · 5.0</span>
        </div>
        <h1 className="hero-headline hero-anim" style={{ '--d': '120ms' } as React.CSSProperties}>
          <span className="hl-line">Not a gym.</span>
          <span className="hl-line hl-accent">A guided transformation</span>
          <span className="hl-line hl-em">system.</span>
        </h1>
        <p className="hero-subline hero-anim" style={{ '--d': '420ms' } as React.CSSProperties}>
          You don&apos;t need to know where to start. You don&apos;t need to be fit already. You just need one coach who shows up for you — and a room that makes consistency feel easy. <strong>We&apos;ll take it from there.</strong>
        </p>
        <div className="hero-cta hero-anim" style={{ '--d': '600ms' } as React.CSSProperties}>
          <div className="hero-cta-row">
            <a href="#lead" className="cta-pri">
              <span className="cta-pri-bg" />
              <span className="cta-pri-text"><span>Start Your Transformation</span><span className="cta-arrow">→</span></span>
              <span className="cta-pri-shine" />
            </a>
            <a href="#free-workout" className="cta-sec">
              <span className="cta-sec-dot" />
              Try Your First Workout <strong>FREE</strong>
            </a>
          </div>
          <div className="hero-cta-micro">
            <span className="micro-tick">✓</span>
            Only <strong>15</strong> free trial slots left this week · No card required
          </div>
        </div>
        <div className="hero-scroll hero-anim" style={{ '--d': '800ms' } as React.CSSProperties}>
          <span className="scroll-line" /><span>Scroll · 01 / 12</span>
        </div>
      </div>
    </section>
  );
}

/* ─── Marquee ────────────────────────────────────────────── */
function TrakMarquee() {
  const items = ['No Excuses','Form First','Coached Every Rep','Judgement Free','Built Not Bought','Beginner Safe','Daily Follow-Up','Zero Ego'];
  const loop = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {loop.map((txt, i) => (
          <div key={i} className={`marquee-item${i % 2 === 0 ? ' strong' : ''}`}>
            {txt}<span className="sep">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── ParallaxBand ───────────────────────────────────────── */
function ParallaxBand({ image, label, num, quote }: { image: string; label: string; num: string; quote: string }) {
  const ref = useRef<HTMLElement>(null);
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setY((r.top + r.height / 2 - window.innerHeight / 2) * -0.25);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <section className="parallax-band" ref={ref}>
      <div className="pb-image" style={{ backgroundImage: `url(${image})`, transform: `translate3d(0,${y}px,0) scale(1.15)` }} />
      <div className="pb-overlay" /><div className="pb-grain" />
      <div className="container pb-content">
        <div className="pb-meta"><span className="pb-num">{num}</span><span className="pb-line" /><span>{label}</span></div>
        <h2 className="pb-quote">{quote}</h2>
      </div>
      <div className="pb-ribbon" aria-hidden><span>NO SHORTCUTS · NO EXCUSES · NO MAGIC · ONLY WORK · NO SHORTCUTS · NO EXCUSES · NO MAGIC · ONLY WORK ·</span></div>
    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────────── */
const QUOTES = [
  { body: "I was the person who quit every gym in three weeks. Nine months in, still showing up. The coaches actually remember your name — and your goals.", name: "A member · Y1", meta: "9 months in", initials: "AR" },
  { body: "Walked in terrified of the barbell. Left deadlifting my bodyweight. They fix your form before your ego gets in the way.", name: "A member · Y2", meta: "1 year in", initials: "PS" },
  { body: "Best part isn't the equipment. It's the 7am message asking why I wasn't in yesterday. Accountability, built in.", name: "A member · Y3", meta: "6 months in", initials: "KV" },
  { body: "Clean, no-ego, serious training. Zero posturing. You come to work, everyone's working. That's rare anywhere I've trained.", name: "A member · Y4", meta: "2 years in", initials: "MJ" },
  { body: "Lost 14 kilos. Gained a spine. The posture corrections alone changed my office back pain forever.", name: "A member · Y5", meta: "8 months in", initials: "RD" },
  { body: "I've trained in three cities. Nothing touches the individual attention here. You're not a number on the board.", name: "A member · Y6", meta: "1.5 years in", initials: "AT" },
];
function Testimonials() {
  return (
    <section className="section" id="proof">
      <div className="container">
        <div className="section-head">
          <div className="mono" style={{ color: 'var(--accent-deep)' }}>02 / Social Proof</div>
          <h2 className="display section-title">468 reviews.<br /><span style={{ color: 'var(--burgundy)' }}>Zero</span> below five.</h2>
        </div>
      </div>
      <div className="testimonials-grid">
        {QUOTES.map((q, i) => (
          <div key={i} className="testimonial">
            <div className="quote-mark">&ldquo;</div>
            <div className="testimonial-body">{q.body}</div>
            <div className="testimonial-author">
              <div className="avatar">{q.initials}</div>
              <div><div className="author-name">{q.name}</div><div className="author-meta">{q.meta}</div></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Results ────────────────────────────────────────────── */
const STORIES = [
  { name: 'M.', headline: 'Started with zero confidence. Now trains 5x a week.', timeline: ['Week 1','Week 8','Week 16'], quote: '"Every app I tried gave up on me. My coach didn\'t."', meta: 'Fat loss · Father of two' },
  { name: 'R.', headline: 'First pull-up at 38. Then the second.', timeline: ['Week 1','Week 8','Week 16'], quote: '"I used to avoid mirrors. Now I ask for the heavier bar."', meta: 'Muscle gain · Marketing lead' },
  { name: 'S.', headline: 'Post-injury rebuild. Stronger than before.', timeline: ['Week 1','Week 8','Week 16'], quote: '"Two surgeries. Three gyms that gave up. Trak didn\'t."', meta: 'General fitness · Age 44' },
];
function Results() {
  return (
    <section className="section" id="results">
      <div className="container">
        <div className="section-head">
          <div className="mono" style={{ color: 'var(--accent-deep)' }}>05 / Real Transformations</div>
          <div>
            <h2 className="display section-title">Real people.<br /><span style={{ color: 'var(--burgundy)' }}>Real weeks.</span><br />Real change.</h2>
            <p style={{ marginTop: 24, color: 'var(--ink-dim)', maxWidth: 540, lineHeight: 1.55, fontSize: 17 }}>These aren&apos;t crash stories. This is what happens when someone keeps showing up — with a coach keeping pace.</p>
          </div>
        </div>
        <div className="results-grid">
          {STORIES.map((s, i) => (
            <article key={i} className="result-card">
              <div className="result-timeline-row">
                {s.timeline.map((w, wi) => (
                  <React.Fragment key={w}>
                    <div className="result-img-wrap">
                      <div className="result-img"><Placeholder variant={wi === 0 ? 'before' : wi === 2 ? 'after' : 'stripes'} center={`[ ${w} ]`} /></div>
                      <div className="result-week">{w}</div>
                    </div>
                    {wi < s.timeline.length - 1 && <div className="result-arrow">→</div>}
                  </React.Fragment>
                ))}
              </div>
              <h3 className="result-headline">{s.headline}</h3>
              <p className="result-quote">{s.quote}</p>
              <div className="result-meta">— {s.name} · {s.meta}</div>
            </article>
          ))}
        </div>
        <div className="results-foot">
          <div className="mono" style={{ color: 'var(--ink-dim)' }}>Photos shared with permission · Names shortened for privacy</div>
          <a href="#lead" className="btn btn-amber">Start Your 16 Weeks <span className="arrow">→</span></a>
        </div>
      </div>
    </section>
  );
}

/* ─── FreeWorkout ────────────────────────────────────────── */
function FreeWorkout() {
  return (
    <section className="section free-workout" id="free-workout">
      <div className="container">
        <div className="fw-card">
          <div className="fw-left">
            <div className="mono fw-badge"><span className="dot" />Limited Daily Slots · 7 Left Today</div>
            <h2 className="display fw-title">Your first<br />workout is<br /><span className="amber">on us.</span></h2>
            <p className="fw-sub">No pressure. No sales pitch. Just a real session with a real coach — so you can feel what training here actually looks like before you decide anything.</p>
            <ul className="fw-list">
              <li><span className="fw-tick">✓</span> 60-minute full coached session</li>
              <li><span className="fw-tick">✓</span> Posture + mobility assessment</li>
              <li><span className="fw-tick">✓</span> Honest feedback. Zero upsell.</li>
            </ul>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 32 }}>
              <a href="#membership" className="btn btn-amber">Book Your Free Workout <span className="arrow">→</span></a>
              <a href="#journey" className="btn btn-ghost" style={{ borderColor: 'rgba(245,239,228,0.4)', color: '#F5EFE4' }}>How It Works</a>
            </div>
          </div>
          <div className="fw-right">
            <Placeholder variant="burgundy" label="FREE / SESSION" center="[ Warm gym moment — coach spotting a member mid-set ]" />
            <div className="fw-stamp"><span className="stamp-center">FREE</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Trainers ───────────────────────────────────────────── */
const TRAINERS = [
  { name: 'Coach V.', role: 'Head Coach', duration: '0:18', tag: '01', quote: "If you don't know where to start, I'll guide you. Literally rep by rep." },
  { name: 'Coach D.', role: 'Performance Coach', duration: '0:14', tag: '02', quote: "I fix the body your desk job gave you. We'll fix the mindset too." },
  { name: 'Coach R.', role: 'Transformation Lead', duration: '0:20', tag: '03', quote: "You don't need willpower. You need a plan and someone checking in. That's me." },
  { name: 'Coach A.', role: 'Beginner Specialist', duration: '0:16', tag: '04', quote: "First day at a gym is scary. I remember. You'll be okay — I promise." },
];
function Trainers() {
  return (
    <section className="section section-alt" id="trainers">
      <div className="container">
        <div className="section-head">
          <div className="mono" style={{ color: 'var(--accent-deep)' }}>07 / Your Coach</div>
          <div>
            <h2 className="display section-title">The people<br />who will<br /><span style={{ color: 'var(--burgundy)' }}>have your back.</span></h2>
            <p style={{ marginTop: 24, color: 'var(--ink-dim)', maxWidth: 540, lineHeight: 1.55, fontSize: 17 }}>Tap any coach to hear them in their own words. You pick who you vibe with. They&apos;ll pick you up when you stall.</p>
          </div>
        </div>
        <div className="trainers-row">
          {TRAINERS.map((t, i) => (
            <div key={t.name} className="trainer">
              <div className="trainer-photo">
                <div className="trainer-tag">Coach / {t.tag}</div>
                <div className="video-duration">▶ {t.duration}</div>
                <Placeholder variant={i % 2 === 1 ? 'lime' : 'stripes'} center={`[ Coach intro video ]\n${t.name}`} />
                <button className="play-btn" aria-label={`Play ${t.name} intro`}>▶</button>
              </div>
              <div className="trainer-info">
                <div><div className="trainer-name">{t.name}</div><div className="trainer-role">{t.role}</div></div>
              </div>
              <p className="trainer-bio">&ldquo;{t.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Why ────────────────────────────────────────────────── */
const WHY_ITEMS = [
  { num: '01', title: 'We See You Show Up', sub: '"I don\'t know where to start." You don\'t have to. A coach walks you through your first rep to your first deadlift — at whatever pace your body needs.' },
  { num: '02', title: 'We Notice When You Don\'t', sub: 'Miss a day, get a warm check-in. Not pushy — caring. The hardest part of training is showing up. We make it feel like you\'re expected.' },
  { num: '03', title: 'The Space Feels Human', sub: 'No mirror flexing. No grunt squad. Just a clean, warm floor where beginners and lifetime lifters share space with quiet respect.' },
  { num: '04', title: 'You Leave With Confidence', sub: 'We don\'t just build bodies. We build the version of you that doesn\'t flinch in photos, sleeps better, and walks taller into every room.' },
];
function Why() {
  return (
    <section className="section" id="why">
      <div className="container">
        <div className="section-head">
          <div className="mono" style={{ color: 'var(--accent-deep)' }}>06 / Why Trak</div>
          <h2 className="display section-title">Most gyms<br />sell <span style={{ color: 'var(--ink-dim)' }}>access.</span><br />We sell <span style={{ color: 'var(--burgundy)' }}>change.</span></h2>
        </div>
        <div className="why-grid">
          <div className="why-lead">
            <h2 className="display" style={{ fontSize: 'clamp(44px,6vw,88px)' }}>You don&apos;t<br />need more<br /><span className="stroke">equipment.</span><br />You need<br />someone <span style={{ color: 'var(--burgundy)' }}>watching.</span></h2>
            <p style={{ marginTop: 32, color: 'var(--ink-dim)', maxWidth: 420, lineHeight: 1.55 }}>The reason most gym memberships die in the first month isn&apos;t lack of motivation. It&apos;s isolation. Trak was built on one stubborn bet: keep coaches within earshot of every member, every single session.</p>
          </div>
          <div className="why-items">
            {WHY_ITEMS.map((it) => (
              <div key={it.num} className="why-item">
                <div><div className="why-num">{it.num}</div><h3>{it.title}</h3></div>
                <div className="why-item-sub">{it.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Journey ────────────────────────────────────────────── */
const STEPS = [
  { n: '01', title: 'Walk In', body: 'Free first visit. No pressure pitch. We assess, you decide. Takes 45 minutes.' },
  { n: '02', title: 'Get Mapped', body: 'Body analysis, goal conversation, a written plan for your first 30 days. Built for you, not a template.' },
  { n: '03', title: 'Get Coached', body: 'Every session, someone watches. Form calls, weight progressions, honest feedback — the hours you put in actually compound.' },
  { n: '04', title: 'Become', body: 'Most members hit their first visible change by week 6. The discipline outlasts the photo. That\'s the real prize.' },
];
function Journey() {
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setProgress(100); io.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <section className="section journey" id="journey" ref={ref}>
      <div className="container">
        <div className="section-head">
          <div className="mono" style={{ color: 'var(--accent)' }}>05 / Method</div>
          <h2 className="display section-title">From doubt<br />to <span style={{ color: 'var(--accent)' }}>done.</span></h2>
        </div>
        <div className="journey-steps" style={{ '--journey-progress': `${progress}%` } as React.CSSProperties}>
          {STEPS.map((s, i) => (
            <div key={s.n} className={`journey-step${progress > 0 ? ' active' : ''}`} style={{ transitionDelay: `${i * 200}ms` }}>
              <div className="step-num">STAGE {s.n}</div>
              <div className="dot" />
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Experience ─────────────────────────────────────────── */
function Experience() {
  return (
    <section className="section" id="experience">
      <div className="container">
        <div className="section-head">
          <div className="mono" style={{ color: 'var(--accent)' }}>06 / The Floor</div>
          <h2 className="display section-title">The space<br />does its <span style={{ color: 'var(--accent)' }}>job.</span></h2>
        </div>
        <div className="exp-grid">
          <div className="exp-tile t-a"><Placeholder variant="contrast" label="FLOOR / 01" center="[ Wide shot — main training floor ]" /><div className="tile-label"><span>Main Floor</span><span>2,400 sqft</span></div></div>
          <div className="exp-tile t-b"><Placeholder variant="stripes" label="FLOOR / 02" center="[ Rack row — rigs & plates ]" /><div className="tile-label"><span>Power Rigs</span><span>×6</span></div></div>
          <div className="exp-tile t-c"><Placeholder variant="lime" label="FLOOR / 03" center="[ Dumbbell wall ]" /><div className="tile-label"><span>Free Weights</span><span>2.5–50kg</span></div></div>
          <div className="exp-tile t-d"><Placeholder variant="contrast" label="FLOOR / 04" center="[ Cardio zone, window light ]" /><div className="tile-label"><span>Cardio Deck</span><span>Open 6am–11pm</span></div></div>
          <div className="exp-tile t-e"><Placeholder variant="stripes" label="FLOOR / 05" center="[ Recovery / stretch area ]" /><div className="tile-label"><span>Recovery</span><span>Mats · Rollers</span></div></div>
        </div>
      </div>
    </section>
  );
}

/* ─── Membership ─────────────────────────────────────────── */
function Membership() {
  const [slots, setSlots] = useState(12);
  useEffect(() => {
    const t = setInterval(() => setSlots((s) => (s > 8 ? s : 12)), 60000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="section" id="membership">
      <div className="container">
        <div className="section-head">
          <div className="mono" style={{ color: 'var(--accent)' }}>07 / Join</div>
          <h2 className="display section-title">Good coaches<br />don&apos;t <span style={{ color: 'var(--accent)' }}>scale.</span></h2>
        </div>
        <div className="membership">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2>Personal coaching<br />is <span className="accent">capped.</span><br />On purpose.</h2>
            <p className="membership-body">Every Trak coach caps their roster. No member gets diluted attention. When slots run out, we open a waitlist — not add bodies to the floor. This month has {slots} open spots across all coaches.</p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button className="btn btn-primary">Claim Your Slot <span className="arrow">→</span></button>
              <button className="btn btn-ghost">Book a Free Visit</button>
            </div>
          </div>
          <div className="slots-widget">
            <div className="slot-label">● Live Availability · Apr 2026</div>
            <div className="slot-count">{String(slots).padStart(2, '0')}</div>
            <div className="slot-sub">coaching slots remaining this month</div>
            <div className="slot-bar"><div className="slot-bar-fill" style={{ width: `${(slots / 40) * 100}%` }} /></div>
            <div className="slot-detail"><span>Filled · 28</span><span>Cap · 40</span></div>
            <div style={{ marginTop: 24, padding: '16px 0 0', borderTop: '1px solid var(--line)' }}>
              <div className="slot-label" style={{ marginBottom: 8 }}>Membership</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, lineHeight: 1 }}>₹4,999<span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-dim)', marginLeft: 8 }}>/mo</span></div>
                <div className="mono" style={{ color: 'var(--accent)' }}>Save 20% quarterly</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── LeadForm ───────────────────────────────────────────── */
function LeadForm() {
  const [form, setForm] = useState({ name: '', phone: '', goal: 'Fat loss' });
  const [submitted, setSubmitted] = useState(false);
  const goals = ['Fat loss', 'Muscle gain', 'General fitness'];
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setSubmitted(true);
  };
  return (
    <section className="section lead-section" id="lead">
      <div className="container">
        <div className="lead-wrap">
          <div className="lead-left">
            <div className="mono" style={{ color: 'var(--accent-deep)', marginBottom: 16 }}>04 / Your Plan</div>
            <h2 className="display lead-title">Get a free<br /><span style={{ color: 'var(--burgundy)' }}>personalized</span><br />fitness plan in <span className="lead-accent">24 hours.</span></h2>
            <p className="lead-sub">Tell us three things. A coach reviews your goal, maps a 30-day starting plan, and sends it to your WhatsApp — no sales calls, no pressure.</p>
            <ul className="lead-bullets">
              <li><span className="fw-tick">✓</span> Personalized to your current level</li>
              <li><span className="fw-tick">✓</span> Reviewed by a real coach (not AI)</li>
              <li><span className="fw-tick">✓</span> Yours to keep, even if you don&apos;t join</li>
            </ul>
            <div className="lead-urgency">
              <span className="urgency-dot" /><strong>Next batch starts Monday.</strong> Only 15 free-trial slots this week.
            </div>
          </div>
          <form className="lead-form" onSubmit={onSubmit}>
            {!submitted ? (
              <>
                <div className="lead-form-header">
                  <div className="mono" style={{ color: 'var(--accent)' }}>● Free Plan Request</div>
                  <div className="mono" style={{ color: 'rgba(245,239,228,0.5)' }}>~ 30 seconds</div>
                </div>
                <div className="lead-field">
                  <label>Your name</label>
                  <input type="text" placeholder="e.g. Priya" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="lead-field">
                  <label>Phone / WhatsApp</label>
                  <input type="tel" placeholder="+91 ••••• •••••" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                </div>
                <div className="lead-field">
                  <label>Primary goal</label>
                  <div className="goal-chips">
                    {goals.map((g) => (
                      <button type="button" key={g} className={`goal-chip${form.goal === g ? ' active' : ''}`} onClick={() => setForm({ ...form, goal: g })}>{g}</button>
                    ))}
                  </div>
                </div>
                <button type="submit" className="btn-hero-primary lead-submit"><span>Send My Free Plan</span><span className="arrow">→</span></button>
                <div className="lead-fineprint">We reply on WhatsApp within 24 hours. No spam. Opt out anytime.</div>
              </>
            ) : (
              <div className="lead-success">
                <div className="success-mark">✓</div>
                <h3>Got it, {form.name.split(' ')[0] || 'friend'}.</h3>
                <p>A coach will message you on <strong>{form.phone}</strong> within 24 hours with your free <strong>{form.goal.toLowerCase()}</strong> plan.</p>
                <div className="mono" style={{ color: 'rgba(245,239,228,0.5)', marginTop: 20 }}>No sales call. Just your plan.</div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

/* ─── Location ───────────────────────────────────────────── */
function Location() {
  return (
    <section className="section" id="location">
      <div className="container">
        <div className="section-head">
          <div className="mono" style={{ color: 'var(--accent-deep)' }}>10 / Find Us</div>
          <h2 className="display section-title">One of Chennai&apos;s<br /><span style={{ color: 'var(--burgundy)' }}>highest-rated</span> gyms.</h2>
        </div>
        <div className="location-grid">
          <div className="map-block">
            <div className="map-pin" />
            <div className="map-label">Trak Fitness</div>
            <div className="map-street">Chennai · Coaching-first studio</div>
          </div>
          <div className="info-block">
            {[
              { label: 'Reputation', value: <><span className="accent-inline">5.0 ★</span> from 468 members<br /><span style={{ color: 'var(--ink-dim)', fontSize: 14 }}>One of Chennai&apos;s highest-rated gyms</span></> },
              { label: 'Hours', value: <>Mon–Sat · <span className="accent-inline">5:00 – 23:00</span><br />Sun · 6:00 – 14:00</> },
              { label: 'First Visit', value: <>Free workout <span className="accent-inline">on the house.</span><br /><span style={{ color: 'var(--ink-dim)', fontSize: 14 }}>No card. No sales pitch.</span></> },
              { label: 'Response', value: <>WhatsApp reply within <span className="accent-inline">2 hours</span><br /><span style={{ color: 'var(--ink-dim)', fontSize: 14 }}>Chat with a coach, not a chatbot</span></> },
            ].map((r) => (
              <div key={r.label} className="info-row">
                <div className="info-label">{r.label}</div>
                <div className="info-value">{r.value}</div>
              </div>
            ))}
            <div style={{ marginTop: 20 }}>
              <a href="#lead" className="btn btn-amber">Book Your Free Visit <span className="arrow">↗</span></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FinalCTA ───────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="container">
        <div className="mono" style={{ color: 'var(--accent)', marginBottom: 32 }}>09 / The Decision</div>
        <h2><div className="line-1"><span className="stroke">Stop</span> waiting.</div><div className="line-2">Start becoming.</div></h2>
        <p className="final-cta-sub">The version of you that walks out of here in six months — they started today. Not Monday. Not next month. Today.</p>
        <div className="final-cta-actions">
          <a href="#free-workout" className="btn btn-amber">Book Your Free Workout <span className="arrow">→</span></a>
          <a href="#trainers" className="btn btn-ghost" style={{ borderColor: 'rgba(245,239,228,0.4)', color: '#F5EFE4' }}>Meet the Coaches</a>
        </div>
      </div>
    </section>
  );
}

/* ─── TrakFooter ─────────────────────────────────────────── */
function TrakFooter() {
  return (
    <footer className="trak-footer">
      <div className="footer-marquee" aria-hidden>
        <div className="fm-track">
          <span>TRAK FITNESS · BUILT NOT BOUGHT · TRAK FITNESS · TRANSFORMATION ON THE CLOCK · TRAK FITNESS · </span>
          <span>TRAK FITNESS · BUILT NOT BOUGHT · TRAK FITNESS · TRANSFORMATION ON THE CLOCK · TRAK FITNESS · </span>
        </div>
      </div>
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="trak-logo"><span className="logo-mark" />Trak<span style={{ color: 'var(--accent)' }}>/</span>Fitness</div>
            <p>A coaching-first gym built for people who want more than a membership card. Transformation, on the clock.</p>
          </div>
          <div><h4>Explore</h4><ul><li><a href="#why">Why Trak</a></li><li><a href="#trainers">Coaches</a></li><li><a href="#journey">Method</a></li><li><a href="#experience">The Floor</a></li></ul></div>
          <div><h4>Get Started</h4><ul><li><a href="#lead">Free Plan</a></li><li><a href="#free-workout">Free Workout</a></li><li><a href="#membership">Membership</a></li><li><a href="#location">Visit Us</a></li></ul></div>
          <div><h4>Social</h4><ul><li><a href="#">Instagram ↗</a></li><li><a href="#">YouTube ↗</a></li><li><a href="#">WhatsApp ↗</a></li><li><a href="#">Google ↗</a></li></ul></div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Trak Fitness · All rights reserved</span>
          <span className="designed-by"><span className="db-line" /><span>Designed by</span><a href="/work" className="db-name">AKN</a><span className="db-mark">◆</span></span>
        </div>
      </div>
    </footer>
  );
}

/* ─── WhatsAppFloat ──────────────────────────────────────── */
function WhatsAppFloat() {
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1800);
    return () => clearTimeout(t);
  }, []);
  const WaIcon = () => (
    <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden>
      <path d="M16 3C9 3 3.3 8.7 3.3 15.7c0 2.5.7 4.8 1.9 6.8L3 29l6.7-2.1c1.9 1 4 1.6 6.3 1.6 7 0 12.7-5.7 12.7-12.7S23 3 16 3zm0 23c-2 0-4-.6-5.7-1.6l-.4-.2-4 1.2 1.3-3.9-.3-.4C5.7 19.4 5 17.6 5 15.7 5 9.7 9.9 4.8 16 4.8s11 4.9 11 11c0 6-4.9 10.9-11 10.9zm6-8.2c-.3-.2-2-.9-2.3-1-.3-.1-.5-.2-.8.2-.2.3-.9 1-1.1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.7-1.6-1-.9-1.7-1.9-1.9-2.3-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.8-1.8-1-2.5-.3-.7-.5-.6-.8-.6h-.7c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 3 1.2 3.2c.1.2 2.1 3.2 5.2 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-.1.3-.8.3-1.5.2-1.6-.1-.1-.3-.2-.6-.3z" />
    </svg>
  );
  return (
    <div className={`wa-float${show ? ' show' : ''}${expanded ? ' expanded' : ''}`}>
      {expanded && (
        <div className="wa-card">
          <div className="wa-card-header">
            <div className="wa-avatar">C</div>
            <div><div className="wa-name">Coach on standby</div><div className="wa-status"><span className="wa-dot" /> Usually replies in 5 min</div></div>
            <button className="wa-close" onClick={() => setExpanded(false)} aria-label="Close">×</button>
          </div>
          <div className="wa-msg">Hey 👋 Not sure where to start? Tell me your goal and I&apos;ll send you a plan. No pressure.</div>
          <a href="#lead" className="wa-cta" onClick={() => setExpanded(false)}>Start the chat →</a>
        </div>
      )}
      <button className="wa-btn" onClick={() => setExpanded(!expanded)} aria-label="Chat with a trainer">
        <WaIcon />
        {!expanded && <span className="wa-label">Chat with a trainer</span>}
      </button>
    </div>
  );
}

/* ─── MobileStickyCTA ────────────────────────────────────── */
function MobileStickyCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const nearBottom = y + window.innerHeight > document.documentElement.scrollHeight - 600;
      setShow(y > 600 && !nearBottom);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className={`mobile-sticky-cta${show ? ' show' : ''}`} aria-hidden={!show}>
      <span className="msc-tag"><strong>15</strong> free trial slots left this week</span>
      <div className="msc-row">
        <a href="#lead" className="msc-pri"><span>Claim Your Free Trial</span><span>→</span></a>
        <a href="#lead" className="msc-sec" aria-label="Book now">
          <svg viewBox="0 0 32 32" width="22" height="22" fill="#25D366"><path d="M16 3C9 3 3.3 8.7 3.3 15.7c0 2.5.7 4.8 1.9 6.8L3 29l6.7-2.1c1.9 1 4 1.6 6.3 1.6 7 0 12.7-5.7 12.7-12.7S23 3 16 3z" /></svg>
        </a>
      </div>
    </div>
  );
}

/* ─── TweaksPanel ────────────────────────────────────────── */
function TweaksPanel() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState('ember');
  const [grain, setGrain] = useState(true);

  const handleTheme = (key: string) => {
    setTheme(key);
    applyTheme(key);
  };

  useEffect(() => {
    const root = document.getElementById('trak-root');
    if (!root) return;
    root.classList.toggle('no-grain', !grain);
  }, [grain]);

  return (
    <>
      {open && (
        <div className="tweaks-panel">
          <div className="tweaks-head">
            <b>Customise Design</b>
            <button className="tweaks-close" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="tweaks-label">Theme</div>
          <div className="theme-grid">
            {Object.entries(THEMES).map(([key, t]) => (
              <button
                key={key}
                title={t.label}
                className={`theme-swatch${theme === key ? ' active' : ''}`}
                style={{ background: `linear-gradient(135deg, ${t.bg} 50%, ${t.accent} 50%)` }}
                onClick={() => handleTheme(key)}
              />
            ))}
          </div>
          <div className="tweaks-label" style={{ marginTop: 12 }}>Effects</div>
          <div className="tweaks-toggle-row">
            <span>Film grain</span>
            <button
              className="tweaks-toggle"
              data-on={grain ? '1' : '0'}
              onClick={() => setGrain((v) => !v)}
              aria-label="Toggle grain"
            >
              <i />
            </button>
          </div>
        </div>
      )}
      <button className="tweaks-fab" onClick={() => setOpen((v) => !v)} aria-label="Customise design" title="Customise">
        {open ? '×' : '✦'}
      </button>
    </>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export function TrakFitnessPage() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal, .draw-line, .fx-reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div id="trak-root">
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: TRAK_CSS }} />
      <UrgencyBar />
      <TrakNav />
      <Hero />
      <TrakMarquee />
      <Testimonials />
      <ParallaxBand
        image="/trak-fitness/inked-back.jpg"
        label="The Shift"
        num="03"
        quote="The gym you join doesn't matter. The one you show up to does."
      />
      <Results />
      <LeadForm />
      <FreeWorkout />
      <Why />
      <Journey />
      <Experience />
      <Membership />
      <ParallaxBand
        image="/trak-fitness/manga-warrior.jpg"
        label="The Method"
        num="08"
        quote="One coach. One plan. One hour a day. That's all it takes."
      />
      <Location />
      <FinalCTA />
      <TrakFooter />
      <WhatsAppFloat />
      <MobileStickyCTA />
      <TweaksPanel />
    </div>
  );
}
