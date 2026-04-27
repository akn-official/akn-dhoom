export const TRAK_CSS = `
#trak-root {
  --bg: #F5EFE4; --bg-1: #EFE6D5; --bg-2: #E7DCC7;
  --line: #D9CCB4; --line-2: #B8A784;
  --ink: #1C120E; --ink-dim: #6B5D51; --ink-faint: #9A8E80;
  --accent: #E8833A; --accent-deep: #B8561F; --accent-rgb: 232,131,58;
  --burgundy: #6E1E2B; --burgundy-rgb: 110,30,43;
  --charcoal: #231915; --danger: #C23B2A;
  --font-display: var(--font-trak-display, 'Anton', sans-serif);
  --font-body: 'Inter', sans-serif;
  --font-mono: var(--font-portfolio-mono, 'JetBrains Mono', monospace);
  --grain-blend: multiply; --radius: 4px; --radius-lg: 8px;
  width: 100%; min-height: 100vh;
  background: var(--bg); color: var(--ink); font-family: var(--font-body);
  -webkit-font-smoothing: antialiased; overflow-x: hidden; position: relative;
  background-image:
    radial-gradient(1200px 700px at 80% -10%, rgba(var(--accent-rgb),0.18), transparent 60%),
    radial-gradient(900px 500px at -10% 30%, rgba(var(--burgundy-rgb),0.08), transparent 60%);
}
#trak-root * { box-sizing: border-box; margin: 0; padding: 0; }
#trak-root img { display: block; max-width: 100%; }
#trak-root a { color: inherit; text-decoration: none; }
#trak-root button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
#trak-root::before {
  content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 200;
  opacity: 0.08; mix-blend-mode: var(--grain-blend);
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.9'/></svg>");
}
#trak-root.no-grain::before { display: none !important; }
.display { font-family: var(--font-display); font-weight: 400; letter-spacing: -0.01em; line-height: 0.88; text-transform: uppercase; }
.mono { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; }
.container { max-width: 1440px; margin: 0 auto; padding: 0 48px; }
@media (max-width: 768px) { .container { padding: 0 20px; } }
.section { position: relative; padding: 140px 0; border-top: 1px solid var(--line); }
.section-alt { background: var(--bg-1); }
.section-head { display: grid; grid-template-columns: 140px 1fr; gap: 40px; margin-bottom: 80px; }
.section-title { font-size: clamp(48px, 8vw, 120px); }
@media (max-width: 768px) { .section { padding: 80px 0; } .section-head { grid-template-columns: 1fr; gap: 16px; margin-bottom: 48px; } }
.btn { display: inline-flex; align-items: center; gap: 12px; padding: 18px 28px; font-family: var(--font-mono); font-size: 12px; text-transform: uppercase; letter-spacing: 0.14em; font-weight: 600; transition: all 0.25s ease; border: 1px solid transparent; border-radius: var(--radius); }
.btn-primary { background: var(--accent); color: #0A0A0A; }
.btn-primary:hover { background: var(--ink); transform: translateY(-2px); }
.btn-ghost { border-color: var(--ink); color: var(--ink); }
.btn-ghost:hover { background: var(--ink); color: var(--bg); }
.btn-amber { background: var(--accent); color: var(--charcoal); }
.btn-amber:hover { background: var(--accent-deep); transform: translateY(-2px); }
.btn .arrow { transition: transform 0.25s ease; }
.btn:hover .arrow { transform: translateX(4px); }
.reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.9s cubic-bezier(.2,.7,.2,1), transform 0.9s cubic-bezier(.2,.7,.2,1); }
.reveal.visible { opacity: 1; transform: translateY(0); }
.draw-line { height: 1px; background: var(--line-2); position: relative; overflow: hidden; }
.draw-line::after { content: ''; position: absolute; inset: 0; background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform 1.2s cubic-bezier(.2,.7,.2,1); }
.draw-line.visible::after { transform: scaleX(1); }
.fx-reveal { opacity: 0; transform: translateY(40px); transition: opacity 1s cubic-bezier(.2,.7,.2,1), transform 1s cubic-bezier(.2,.7,.2,1); }
.fx-reveal.visible { opacity: 1; transform: translateY(0); }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
@keyframes trak-scroll { to { transform: translateX(-50%); } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pinPulse { 0%,100% { box-shadow: 0 0 0 8px rgba(var(--accent-rgb),0.15), 0 0 40px rgba(var(--accent-rgb),0.6); } 50% { box-shadow: 0 0 0 16px rgba(var(--accent-rgb),0.08), 0 0 60px rgba(var(--accent-rgb),0.8); } }
@keyframes slotPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
@keyframes waPop { from { opacity: 0; transform: translateY(8px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes scrollDrop { 0% { transform: translateY(-100%); } 60%, 100% { transform: translateY(100%); } }
@keyframes scanShift { to { background-position: 0 100px; } }
@keyframes ctaPulse { 0%, 100% { box-shadow: 0 0 0 1px rgba(232,131,58,0.4), 0 16px 40px -12px rgba(232,131,58,0.55), 0 0 60px -10px rgba(232,131,58,0.25); } 50% { box-shadow: 0 0 0 1px rgba(232,131,58,0.6), 0 16px 40px -12px rgba(232,131,58,0.7), 0 0 80px -10px rgba(232,131,58,0.4); } }
@keyframes ctaShine { 0%, 100% { left: -75%; } 60%, 100% { left: 125%; } }
.urgency-bar { background: var(--charcoal); color: #F5EFE4; padding: 10px 0; position: relative; z-index: 50; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; }
.urgency-bar-inner { display: flex; gap: 20px; justify-content: center; align-items: center; flex-wrap: wrap; }
.ub-item { display: inline-flex; align-items: center; gap: 8px; color: rgba(245,239,228,0.8); }
.ub-item strong { color: var(--accent); font-weight: 700; }
.ub-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 2s ease-in-out infinite; }
.ub-sep { color: rgba(245,239,228,0.3); }
@media (max-width: 768px) { .ub-sep { display: none; } .urgency-bar-inner { gap: 8px 16px; font-size: 10px; } }
.trak-nav { position: fixed; top: 38px; left: 0; right: 0; z-index: 100; padding: 20px 48px; display: flex; justify-content: space-between; align-items: center; transition: all 0.3s ease; }
.trak-nav.scrolled { background: rgba(245,239,228,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid var(--line); padding: 14px 48px; }
.trak-logo { font-family: var(--font-display); font-size: 22px; letter-spacing: 0.04em; text-transform: uppercase; display: flex; align-items: center; gap: 10px; }
.logo-mark { width: 10px; height: 10px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 20px var(--accent); }
.nav-links { display: flex; gap: 32px; }
.nav-links a { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--ink-dim); transition: color 0.2s; }
.nav-links a:hover { color: var(--accent); }
.nav-cta { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; padding: 10px 18px; background: var(--burgundy); color: #FFF5E6; font-weight: 600; transition: all 0.2s; border-radius: var(--radius); }
.nav-cta:hover { background: var(--charcoal); }
@media (max-width: 1040px) { .nav-links { display: none; } .trak-nav, .trak-nav.scrolled { padding: 14px 20px; } }
@media (max-width: 768px) { .trak-nav { top: 64px; } .trak-nav.scrolled { top: 0; } }
.hero-cine { position: relative; min-height: 100vh; min-height: 100svh; display: flex; align-items: center; justify-content: center; text-align: center; overflow: hidden; padding: 120px 24px 100px; background: #060403; color: #F5EFE4; isolation: isolate; }
.hero-bg-stack { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
.hero-bg-layer { position: absolute; inset: -8% -4%; background-size: cover; background-position: center 30%; background-repeat: no-repeat; will-change: transform, opacity; }
.hero-bg-far { background-image: url('/trak-fitness/inked-back.jpg'); filter: blur(6px) brightness(0.32) contrast(1.1) grayscale(0.6); transform: scale(1.05); opacity: 0.45; }
.hero-bg-mid { background-image: url('/trak-fitness/manga-warrior.jpg'); background-position: center 40%; filter: blur(2px) brightness(0.45) contrast(1.15) saturate(0.85); mix-blend-mode: lighten; opacity: 0.55; }
.hero-bg-near { background-image: url('/trak-fitness/hero-silhouette.jpg'); background-position: center 20%; background-size: contain; background-repeat: no-repeat; filter: brightness(0.9) contrast(1.18); mix-blend-mode: screen; opacity: 0.95; }
.hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(245,239,228,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,239,228,0.04) 1px, transparent 1px); background-size: 80px 80px; mask-image: radial-gradient(ellipse at 50% 40%, black 30%, transparent 75%); -webkit-mask-image: radial-gradient(ellipse at 50% 40%, black 30%, transparent 75%); opacity: 0.55; }
.hero-vignette { position: absolute; inset: 0; background: radial-gradient(ellipse 60% 50% at center, transparent 30%, rgba(6,4,3,0.55) 70%, rgba(6,4,3,0.95) 100%), linear-gradient(180deg, rgba(6,4,3,0.4) 0%, transparent 30%, rgba(6,4,3,0.85) 100%); }
.hero-scanline { position: absolute; inset: 0; background-image: repeating-linear-gradient(0deg, transparent 0 3px, rgba(245,239,228,0.022) 3px 4px); pointer-events: none; mix-blend-mode: overlay; animation: scanShift 8s linear infinite; }
.ribbon { position: absolute; left: 0; right: 0; z-index: 3; overflow: hidden; pointer-events: none; }
.ribbon-top { top: 60px; transform: rotate(-3deg) translateX(-2%); width: 110%; background: var(--accent); padding: 8px 0; box-shadow: 0 8px 30px -6px rgba(232,131,58,0.5); }
.ribbon-track { display: flex; gap: 64px; white-space: nowrap; animation: trak-scroll 28s linear infinite; }
.ribbon-track span { font-family: var(--font-display); font-size: 16px; letter-spacing: 0.2em; color: var(--charcoal); font-weight: 700; }
.hero-watermark { position: absolute; left: 50%; bottom: -8%; transform: translateX(-50%); font-family: var(--font-display); font-size: clamp(160px, 28vw, 420px); font-weight: 400; letter-spacing: -0.02em; color: transparent; -webkit-text-stroke: 1px rgba(245,239,228,0.06); z-index: 1; pointer-events: none; line-height: 0.8; white-space: nowrap; }
.hero-index { position: absolute; z-index: 4; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(245,239,228,0.5); display: flex; flex-direction: column; gap: 6px; }
.hero-index-left { left: 32px; top: 50%; transform: translateY(-50%); }
.hero-index-left .big { font-family: var(--font-display); font-size: 56px; line-height: 1; color: var(--accent); letter-spacing: 0; }
.hero-index-right { right: 32px; top: 50%; transform: translateY(-50%); }
.hero-index-right .vert { writing-mode: vertical-rl; transform: rotate(180deg); letter-spacing: 0.4em; }
@media (max-width: 900px) { .hero-index { display: none; } }
.hero-content { position: relative; z-index: 5; max-width: 920px; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 28px; }
.hero-anim { opacity: 0; transform: translateY(20px); transition: opacity 1000ms cubic-bezier(.2,.7,.2,1), transform 1000ms cubic-bezier(.2,.7,.2,1); transition-delay: var(--d, 0ms); filter: blur(4px); }
.hero-cine.loaded .hero-anim { opacity: 1; transform: translateY(0); filter: blur(0); }
.hero-eyebrow { display: inline-flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; padding: 10px 18px; border: 1px solid rgba(245,239,228,0.18); border-radius: 999px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(245,239,228,0.85); background: rgba(245,239,228,0.04); backdrop-filter: blur(12px); }
.hero-eyebrow-dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 12px var(--accent); animation: pulse 2s ease-in-out infinite; }
.hero-eyebrow-sep { color: rgba(245,239,228,0.3); }
.hero-eyebrow-stars { color: var(--accent); letter-spacing: 0; }
.hero-headline { font-family: var(--font-display); font-weight: 400; text-transform: uppercase; letter-spacing: -0.01em; line-height: 0.92; font-size: clamp(48px, 8vw, 120px); display: flex; flex-direction: column; gap: 0; max-width: 16ch; text-wrap: balance; text-shadow: 0 4px 30px rgba(0,0,0,0.6); }
.hl-line { display: block; }
.hl-word { display: inline-block; }
.hl-em { color: #F5EFE4; }
.hl-accent { color: var(--accent); font-style: italic; text-shadow: 0 0 40px rgba(232,131,58,0.55); }
.hero-subline { max-width: 60ch; font-size: clamp(15px, 1.4vw, 18px); line-height: 1.6; color: rgba(245,239,228,0.78); text-wrap: pretty; text-shadow: 0 2px 20px rgba(0,0,0,0.6); }
.hero-subline strong { color: var(--accent); font-weight: 600; }
.hero-cta { display: flex; flex-direction: column; align-items: center; gap: 18px; margin-top: 12px; }
.hero-cta-row { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; align-items: center; }
.cta-pri { position: relative; display: inline-flex; align-items: stretch; padding: 0; border-radius: 6px; overflow: hidden; isolation: isolate; cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease; box-shadow: 0 0 0 1px rgba(232,131,58,0.4), 0 16px 40px -12px rgba(232,131,58,0.55); animation: ctaPulse 2.4s ease-in-out infinite; }
.cta-pri:hover { transform: translateY(-3px); }
.cta-pri-bg { position: absolute; inset: 0; z-index: 0; background: linear-gradient(135deg, #FF9A4A 0%, #E8833A 50%, #B8561F 100%); }
.cta-pri-text { position: relative; z-index: 2; display: inline-flex; align-items: center; gap: 14px; padding: 22px 36px; font-family: var(--font-mono); font-size: 13px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: #1C0F08; }
.cta-arrow { display: inline-block; transition: transform 0.3s ease; }
.cta-pri:hover .cta-arrow { transform: translateX(6px); }
.cta-pri-shine { position: absolute; top: 0; left: -75%; width: 50%; height: 100%; z-index: 1; background: linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%); transform: skewX(-20deg); animation: ctaShine 3.8s ease-in-out infinite; }
.cta-sec { display: inline-flex; align-items: center; gap: 10px; padding: 22px 28px; background: rgba(245,239,228,0.06); border: 1px solid rgba(245,239,228,0.25); color: #F5EFE4; font-family: var(--font-mono); font-size: 12px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; border-radius: 6px; backdrop-filter: blur(12px); transition: all 0.3s ease; }
.cta-sec:hover { background: rgba(245,239,228,0.1); border-color: rgba(245,239,228,0.5); transform: translateY(-2px); }
.cta-sec strong { color: var(--accent); font-weight: 700; }
.cta-sec-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 12px var(--accent); animation: pulse 1.6s ease-in-out infinite; }
.hero-cta-micro { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(245,239,228,0.7); }
.hero-cta-micro strong { color: var(--accent); font-weight: 700; }
.micro-tick { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 50%; background: var(--accent); color: var(--charcoal); font-size: 10px; font-weight: 700; }
.hero-scroll { position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%) translateY(20px); display: flex; flex-direction: column; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(245,239,228,0.55); z-index: 5; }
.hero-cine.loaded .hero-scroll { transform: translateX(-50%) translateY(0); }
.scroll-line { width: 1px; height: 48px; background: linear-gradient(to bottom, transparent, rgba(245,239,228,0.6)); position: relative; overflow: hidden; }
.scroll-line::after { content: ''; position: absolute; inset: 0; background: var(--accent); animation: scrollDrop 2.4s ease-in-out infinite; }
@media (max-width: 640px) { .hero-cine { padding: 110px 18px 100px; } .ribbon-top { top: 70px; } .cta-pri-text { padding: 20px 28px; font-size: 12px; } .cta-sec { padding: 20px 22px; } }
@media (prefers-reduced-motion: reduce) { .hero-anim { transition: none; opacity: 1; transform: none; filter: none; } .ribbon-track, .scroll-line::after, .cta-pri-shine, .cta-pri { animation: none; } }
.marquee { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 28px 0; overflow: hidden; background: var(--burgundy); color: #F5EFE4; }
.marquee-track { display: flex; gap: 64px; white-space: nowrap; animation: trak-scroll 40s linear infinite; }
.marquee-item { font-family: var(--font-display); font-size: 40px; text-transform: uppercase; letter-spacing: 0.02em; display: flex; align-items: center; gap: 64px; color: rgba(245,239,228,0.55); }
.marquee-item .sep { color: var(--accent); }
.marquee-item.strong { color: #F5EFE4; }
.parallax-band { position: relative; min-height: 70vh; display: flex; align-items: center; overflow: hidden; background: #0E0908; color: #F5EFE4; isolation: isolate; }
.pb-image { position: absolute; inset: -10%; background-size: cover; background-position: center; will-change: transform; filter: brightness(0.55) contrast(1.15) saturate(0.9); }
.pb-overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(14,9,8,0.95) 0%, rgba(14,9,8,0.5) 60%, rgba(14,9,8,0.85) 100%); }
.pb-grain { position: absolute; inset: 0; background-image: repeating-linear-gradient(0deg, transparent 0 2px, rgba(245,239,228,0.025) 2px 3px); mix-blend-mode: overlay; pointer-events: none; }
.pb-content { position: relative; z-index: 2; padding: 80px 0; max-width: 900px; }
.pb-meta { display: inline-flex; align-items: center; gap: 16px; margin-bottom: 28px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(245,239,228,0.6); }
.pb-num { font-family: var(--font-display); font-size: 28px; color: var(--accent); letter-spacing: 0; }
.pb-line { display: inline-block; width: 60px; height: 1px; background: var(--accent); }
.pb-quote { font-family: var(--font-display); font-size: clamp(48px, 7vw, 96px); line-height: 0.95; text-transform: uppercase; max-width: 22ch; }
.pb-ribbon { position: absolute; bottom: 24px; left: -2%; width: 104%; background: rgba(110,30,43,0.92); color: rgba(245,239,228,0.85); padding: 6px 0; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.18em; white-space: nowrap; overflow: hidden; transform: rotate(-1.2deg); z-index: 3; }
.pb-ribbon span { display: inline-block; animation: trak-scroll 22s linear infinite; padding-right: 64px; }
@media (max-width: 768px) { .parallax-band { min-height: 50vh; } .pb-quote { font-size: clamp(32px, 8vw, 44px) !important; } }
.testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--line); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.testimonial { background: var(--bg); padding: 40px 36px; display: flex; flex-direction: column; gap: 24px; min-height: 320px; position: relative; transition: background 0.3s; }
.testimonial:hover { background: var(--bg-1); box-shadow: inset 4px 0 0 var(--accent); }
.testimonial:hover .quote-mark { color: var(--accent); }
.quote-mark { font-family: var(--font-display); font-size: 72px; line-height: 0.6; color: var(--line-2); transition: color 0.3s; }
.testimonial-body { font-size: 18px; line-height: 1.45; color: var(--ink); flex: 1; }
.testimonial-author { display: flex; align-items: center; gap: 12px; padding-top: 20px; border-top: 1px solid var(--line); }
.avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--bg-2); border: 1px solid var(--line-2); display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 12px; color: var(--ink-dim); }
.author-name { font-size: 14px; font-weight: 500; }
.author-meta { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--ink-dim); }
@media (max-width: 900px) { .testimonials-grid { grid-template-columns: 1fr; } }
.results-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
.result-card { background: var(--bg-1); border-radius: var(--radius-lg); padding: 28px; display: flex; flex-direction: column; gap: 24px; transition: transform 0.4s ease, box-shadow 0.4s ease; border: 1px solid var(--line); }
.result-card:hover { transform: translateY(-6px); box-shadow: 0 30px 60px -30px rgba(28,18,14,0.25); }
.result-timeline-row { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; gap: 10px; align-items: center; }
.result-img-wrap { display: flex; flex-direction: column; gap: 8px; }
.result-img { position: relative; aspect-ratio: 3/4; }
.result-img .ph { border-radius: var(--radius); }
.result-week { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--burgundy); text-align: center; font-weight: 600; }
.result-arrow { font-size: 22px; color: var(--burgundy); font-weight: 700; }
.result-headline { font-family: var(--font-display); font-size: 30px; line-height: 1.05; text-transform: uppercase; margin: 12px 0 16px; }
.result-quote { font-size: 15px; line-height: 1.55; color: var(--ink-dim); font-style: italic; margin-bottom: 18px; }
.result-meta { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-faint); padding-top: 16px; border-top: 1px solid var(--line); }
.results-foot { margin-top: 60px; display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; padding-top: 32px; border-top: 1px solid var(--line); }
@media (max-width: 900px) { .results-grid { grid-template-columns: 1fr; } }
.free-workout { padding: 80px 0 120px; }
.fw-card { background: var(--burgundy); color: #F5EFE4; border-radius: var(--radius-lg); padding: 72px 64px; display: grid; grid-template-columns: 1.1fr 1fr; gap: 80px; align-items: center; position: relative; overflow: hidden; box-shadow: 0 40px 80px -40px rgba(var(--burgundy-rgb),0.6); }
.fw-card::before { content: ''; position: absolute; top: -100px; right: -100px; width: 420px; height: 420px; background: radial-gradient(circle, rgba(var(--accent-rgb),0.35), transparent 65%); }
.fw-badge { display: inline-flex; align-items: center; gap: 10px; padding: 10px 16px; background: rgba(245,239,228,0.1); border: 1px solid rgba(245,239,228,0.2); border-radius: 999px; color: #F5EFE4; margin-bottom: 32px; }
.fw-badge .dot { width: 8px; height: 8px; background: var(--accent); border-radius: 50%; animation: pulse 1.8s ease-in-out infinite; }
.fw-title { font-size: clamp(56px, 8vw, 108px); line-height: 0.9; }
.fw-title .amber { color: var(--accent); font-style: italic; }
.fw-sub { font-size: 18px; line-height: 1.55; color: rgba(245,239,228,0.8); margin-top: 24px; max-width: 480px; }
.fw-list { list-style: none; margin-top: 28px; display: flex; flex-direction: column; gap: 12px; }
.fw-list li { display: flex; align-items: center; gap: 14px; font-size: 15px; color: rgba(245,239,228,0.9); }
.fw-tick { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; background: var(--accent); color: var(--charcoal); border-radius: 50%; font-size: 12px; font-weight: 700; }
.fw-right { position: relative; aspect-ratio: 1/1.1; }
.fw-stamp { position: absolute; bottom: -32px; right: -32px; width: 160px; height: 160px; background: var(--accent); color: var(--charcoal); border-radius: 50%; display: flex; align-items: center; justify-content: center; animation: spin 14s linear infinite; box-shadow: 0 20px 40px -12px rgba(28,18,14,0.4); z-index: 2; }
.fw-stamp .stamp-center { position: absolute; font-family: var(--font-display); font-size: 28px; animation: spin 14s linear infinite reverse; }
@media (max-width: 900px) { .fw-card { grid-template-columns: 1fr; padding: 48px 28px; gap: 40px; } .fw-right { aspect-ratio: 4/3; } .fw-stamp { width: 110px; height: 110px; bottom: -16px; right: -16px; } }
.why-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px; }
.why-lead { grid-column: span 5; }
.why-lead h2 { font-size: clamp(56px, 7vw, 96px); }
.why-lead h2 .stroke { -webkit-text-stroke: 1.5px var(--ink); color: transparent; }
.why-items { grid-column: span 7; display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--line); border: 1px solid var(--line); }
.why-item { background: var(--bg); padding: 36px 32px; min-height: 240px; display: flex; flex-direction: column; justify-content: space-between; transition: background 0.3s; }
.why-item:hover { background: var(--burgundy); color: #F5EFE4; transform: translateY(-2px); box-shadow: 0 12px 30px -12px rgba(var(--burgundy-rgb),0.4); }
.why-item:hover .why-num { color: var(--accent); }
.why-item:hover .why-item-sub { color: rgba(245,239,228,0.8); }
.why-num { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.14em; color: var(--accent); transition: color 0.3s; }
.why-item h3 { font-family: var(--font-display); font-size: 36px; text-transform: uppercase; line-height: 1; margin: 16px 0; }
.why-item-sub { font-size: 14px; line-height: 1.5; color: var(--ink-dim); transition: color 0.3s; }
@media (max-width: 900px) { .why-lead, .why-items { grid-column: span 12; } .why-items { grid-template-columns: 1fr; } }
.trainers-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.trainer { position: relative; cursor: pointer; overflow: hidden; }
.trainer-photo { aspect-ratio: 3/4; position: relative; overflow: hidden; background: var(--bg-2); border-radius: var(--radius); }
.trainer-photo .ph { transition: transform 0.6s cubic-bezier(.2,.7,.2,1); }
.trainer:hover .trainer-photo .ph { transform: scale(1.04); }
.trainer-tag { position: absolute; top: 16px; left: 16px; z-index: 3; font-family: var(--font-mono); font-size: 10px; padding: 6px 10px; background: rgba(245,239,228,0.9); color: var(--charcoal); letter-spacing: 0.12em; text-transform: uppercase; border-radius: var(--radius); }
.play-btn { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 2; width: 72px; height: 72px; border-radius: 50%; background: rgba(245,239,228,0.92); color: var(--burgundy); display: flex; align-items: center; justify-content: center; font-size: 22px; padding-left: 4px; box-shadow: 0 10px 40px rgba(28,18,14,0.3); transition: all 0.3s ease; }
.trainer:hover .play-btn { transform: translate(-50%,-50%) scale(1.08); background: var(--accent); color: var(--charcoal); }
.video-duration { position: absolute; top: 16px; right: 16px; z-index: 3; font-family: var(--font-mono); font-size: 10px; padding: 4px 8px; background: var(--charcoal); color: #F5EFE4; letter-spacing: 0.1em; border-radius: 2px; }
.trainer-info { padding: 20px 0; border-top: 1px solid var(--line); margin-top: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
.trainer-name { font-family: var(--font-display); font-size: 28px; text-transform: uppercase; line-height: 1; }
.trainer-role { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--ink-dim); margin-top: 8px; }
.trainer-bio { font-size: 14px; line-height: 1.5; color: var(--ink-dim); font-style: italic; margin-top: 12px; }
@media (max-width: 900px) { .trainers-row { grid-template-columns: repeat(2, 1fr); } }
.journey { position: relative; }
.journey-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; position: relative; }
.journey-steps::before { content: ''; position: absolute; top: 32px; left: 0; right: 0; height: 1px; background: var(--line-2); }
.journey-steps::after { content: ''; position: absolute; top: 33px; left: 0; height: 2px; background: var(--burgundy); width: var(--journey-progress, 0%); transition: width 2s cubic-bezier(.2,.7,.2,1); }
.journey-step { padding: 0 12px; position: relative; }
.journey-step .dot { width: 16px; height: 16px; border-radius: 50%; background: var(--bg); border: 2px solid var(--line-2); margin: 25px 0 32px; position: relative; z-index: 2; transition: all 0.4s; }
.journey-step.active .dot { background: var(--burgundy); border-color: var(--burgundy); box-shadow: 0 0 0 6px rgba(var(--burgundy-rgb),0.15); }
.journey-step .step-num { font-family: var(--font-mono); font-size: 11px; color: var(--accent); letter-spacing: 0.14em; }
.journey-step h3 { font-family: var(--font-display); font-size: 44px; text-transform: uppercase; line-height: 1; margin: 16px 0 12px; }
.journey-step p { font-size: 14px; color: var(--ink-dim); line-height: 1.5; }
@media (max-width: 900px) { .journey-steps { grid-template-columns: 1fr; gap: 24px; } .journey-steps::before, .journey-steps::after { display: none; } }
.exp-grid { display: grid; grid-template-columns: repeat(6, 1fr); grid-auto-rows: 180px; gap: 16px; }
.exp-tile { position: relative; overflow: hidden; border: 1px solid var(--line); transition: border-color 0.3s; }
.exp-tile:hover { border-color: var(--accent); }
.exp-tile .ph { width: 100%; height: 100%; }
.exp-tile .tile-label { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px; font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.14em; background: linear-gradient(to top, rgba(10,10,10,0.95), transparent); display: flex; justify-content: space-between; color: #F5EFE4; }
.exp-tile .tile-label span:last-child { color: var(--accent); }
.t-a { grid-column: span 3; grid-row: span 2; }
.t-b { grid-column: span 3; }
.t-c { grid-column: span 2; }
.t-d { grid-column: span 4; grid-row: span 2; }
.t-e { grid-column: span 2; }
@media (max-width: 900px) { .exp-grid { grid-template-columns: 1fr 1fr; grid-auto-rows: 140px; } .t-a, .t-b, .t-c, .t-d, .t-e { grid-column: span 1; grid-row: span 1; } .t-a { grid-column: span 2; grid-row: span 2; } .t-d { grid-column: span 2; } }
.membership { background: var(--charcoal); color: #F5EFE4; border-radius: var(--radius-lg); padding: 80px 64px; display: grid; grid-template-columns: 1.4fr 1fr; gap: 80px; position: relative; overflow: hidden; box-shadow: 0 40px 80px -40px rgba(28,18,14,0.35); }
.membership::before { content: ''; position: absolute; top: -80px; right: -80px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(var(--accent-rgb),0.15), transparent 70%); }
.membership h2 { font-size: clamp(48px, 6vw, 84px); font-family: var(--font-display); text-transform: uppercase; line-height: 0.9; }
.membership h2 .accent { color: var(--accent); }
.membership-body { font-size: 17px; color: rgba(245,239,228,0.7); line-height: 1.55; margin: 24px 0 36px; max-width: 520px; }
.slots-widget { background: var(--bg); border: 1px solid var(--line-2); padding: 28px; position: relative; z-index: 1; }
.slot-label { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-dim); }
.slot-count { font-family: var(--font-display); font-size: 96px; line-height: 1; color: var(--accent); margin: 12px 0; }
.slot-sub { font-size: 13px; color: var(--ink); margin-bottom: 24px; }
.slot-bar { height: 4px; background: var(--line); margin-bottom: 20px; overflow: hidden; }
.slot-bar-fill { height: 100%; background: var(--burgundy); animation: slotPulse 2.4s ease-in-out infinite; }
.slot-detail { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-dim); }
@media (max-width: 900px) { .membership { grid-template-columns: 1fr; padding: 48px 28px; gap: 40px; } }
.location-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 40px; }
.map-block { position: relative; aspect-ratio: 16/11; border: 1px solid var(--line); background: linear-gradient(rgba(var(--accent-rgb),0.03), rgba(var(--accent-rgb),0.03)), repeating-linear-gradient(0deg, var(--bg-1) 0 39px, var(--line) 39px 40px), repeating-linear-gradient(90deg, var(--bg-1) 0 39px, var(--line) 39px 40px); overflow: hidden; }
.map-block::before { content: ''; position: absolute; top: 0; bottom: 0; left: 20%; width: 2px; background: linear-gradient(to bottom, transparent, var(--line-2) 20%, var(--line-2) 80%, transparent); }
.map-block::after { content: ''; position: absolute; top: 30%; left: 0; right: 0; height: 2px; background: linear-gradient(to right, transparent, var(--line-2) 20%, var(--line-2) 80%, transparent); }
.map-pin { position: absolute; top: 45%; left: 38%; width: 20px; height: 20px; background: var(--accent); border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 0 0 8px rgba(var(--accent-rgb),0.15), 0 0 40px rgba(var(--accent-rgb),0.6); animation: pinPulse 2s ease-in-out infinite; }
.map-label { position: absolute; top: 50%; left: 44%; transform: translateY(-6px); padding: 8px 12px; background: var(--bg); border: 1px solid var(--accent); font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; white-space: nowrap; }
.map-street { position: absolute; bottom: 24px; left: 24px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em; color: var(--ink-dim); text-transform: uppercase; }
.info-block { display: flex; flex-direction: column; gap: 20px; }
.info-row { padding: 20px 0; border-bottom: 1px solid var(--line); }
.info-row:first-child { border-top: 1px solid var(--line); }
.info-label { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--ink-dim); margin-bottom: 10px; }
.info-value { font-size: 18px; line-height: 1.4; }
.info-value .accent-inline { color: var(--accent); }
@media (max-width: 900px) { .location-grid { grid-template-columns: 1fr; } }
.final-cta { min-height: 90vh; padding: 160px 0; text-align: center; position: relative; overflow: hidden; border-top: 1px solid var(--line); background: var(--charcoal); color: #F5EFE4; }
.final-cta::before { content: ''; position: absolute; inset: 0; background: radial-gradient(800px 500px at 50% 50%, rgba(var(--accent-rgb),0.18), transparent 60%); }
.final-cta h2 { font-family: var(--font-display); font-size: clamp(80px, 16vw, 260px); text-transform: uppercase; line-height: 0.88; position: relative; }
.final-cta h2 .line-1 .stroke { -webkit-text-stroke: 2px #F5EFE4 !important; color: transparent !important; }
.final-cta h2 .line-2 { color: var(--accent) !important; font-style: italic; }
.final-cta-sub { font-size: 18px; color: rgba(245,239,228,0.7); max-width: 500px; margin: 40px auto 0; line-height: 1.5; }
.final-cta-actions { display: flex; gap: 16px; justify-content: center; margin-top: 44px; }
.lead-section { padding: 140px 0; background: var(--bg-1); }
.lead-wrap { display: grid; grid-template-columns: 1.1fr 1fr; gap: 80px; align-items: center; }
.lead-title { font-size: clamp(44px, 6vw, 84px); line-height: 0.92; }
.lead-accent { color: var(--accent); font-style: italic; }
.lead-sub { font-size: 17px; line-height: 1.6; color: var(--ink-dim); margin: 24px 0; max-width: 520px; }
.lead-bullets { list-style: none; display: flex; flex-direction: column; gap: 12px; margin: 24px 0; }
.lead-bullets li { display: flex; align-items: center; gap: 12px; font-size: 15px; color: var(--ink); }
.lead-urgency { margin-top: 24px; display: inline-flex; align-items: center; gap: 10px; padding: 12px 16px; background: rgba(var(--burgundy-rgb),0.08); border-left: 3px solid var(--burgundy); border-radius: var(--radius); font-size: 14px; color: var(--ink); }
.lead-urgency strong { color: var(--burgundy); }
.urgency-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--burgundy); animation: pulse 2s ease-in-out infinite; }
.lead-form { background: var(--charcoal); color: #F5EFE4; padding: 40px; border-radius: var(--radius-lg); box-shadow: 0 40px 80px -30px rgba(28,18,14,0.4); display: flex; flex-direction: column; gap: 22px; }
.lead-form-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px solid rgba(245,239,228,0.1); margin-bottom: 8px; }
.lead-field { display: flex; flex-direction: column; gap: 10px; }
.lead-field label { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(245,239,228,0.6); }
.lead-field input { background: rgba(245,239,228,0.06); border: 1px solid rgba(245,239,228,0.15); color: #F5EFE4; padding: 14px 16px; border-radius: var(--radius); font-family: var(--font-body); font-size: 15px; transition: border 0.2s; width: 100%; }
.lead-field input:focus { outline: none; border-color: var(--accent); }
.lead-field input::placeholder { color: rgba(245,239,228,0.35); }
.goal-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.goal-chip { padding: 12px 16px; border: 1px solid rgba(245,239,228,0.15); background: rgba(245,239,228,0.04); color: rgba(245,239,228,0.75); border-radius: var(--radius); font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; transition: all 0.2s; cursor: pointer; }
.goal-chip:hover { border-color: rgba(245,239,228,0.4); color: #F5EFE4; }
.goal-chip.active { background: var(--accent); color: var(--charcoal); border-color: var(--accent); font-weight: 700; }
.lead-submit { width: 100%; justify-content: center; margin-top: 8px; }
.lead-fineprint { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em; color: rgba(245,239,228,0.4); text-align: center; }
.lead-success { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 40px 20px; text-align: center; }
.success-mark { width: 64px; height: 64px; border-radius: 50%; background: var(--accent); color: var(--charcoal); display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 700; }
.lead-success h3 { font-family: var(--font-display); font-size: 36px; text-transform: uppercase; color: #F5EFE4; }
.lead-success p { font-size: 15px; color: rgba(245,239,228,0.8); line-height: 1.55; max-width: 340px; }
.lead-success p strong { color: var(--accent); }
@media (max-width: 900px) { .lead-wrap { grid-template-columns: 1fr; gap: 48px; } .lead-form { padding: 28px; } }
.btn-hero-primary { display: inline-flex; align-items: center; gap: 14px; padding: 20px 34px; background: var(--accent); color: var(--charcoal); font-family: var(--font-mono); font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; border-radius: var(--radius); transition: transform 0.25s ease, box-shadow 0.25s ease; box-shadow: 0 12px 30px -10px rgba(var(--accent-rgb),0.4); }
.btn-hero-primary:hover { transform: translateY(-2px); background: #F5EFE4; }
.wa-float { position: fixed; bottom: 24px; right: 24px; z-index: 90; opacity: 0; transform: translateY(12px); transition: opacity 0.5s ease, transform 0.5s ease; display: flex; flex-direction: column; align-items: flex-end; gap: 12px; pointer-events: none; }
.wa-float.show { opacity: 1; transform: translateY(0); pointer-events: auto; }
.wa-btn { background: #25D366; color: #FFF; padding: 14px 20px 14px 16px; border-radius: 999px; display: inline-flex; align-items: center; gap: 10px; box-shadow: 0 12px 30px -8px rgba(37,211,102,0.55); font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 600; cursor: pointer; transition: transform 0.25s ease; }
.wa-btn:hover { transform: translateY(-2px); }
.wa-float.expanded .wa-label { display: none; }
.wa-float.expanded .wa-btn { padding: 14px; }
.wa-card { width: 300px; background: var(--charcoal); color: #F5EFE4; border-radius: var(--radius-lg); padding: 18px; box-shadow: 0 24px 60px -16px rgba(28,18,14,0.5); animation: waPop 0.3s cubic-bezier(.2,.7,.2,1); }
.wa-card-header { display: grid; grid-template-columns: auto 1fr auto; gap: 12px; align-items: center; padding-bottom: 14px; border-bottom: 1px solid rgba(245,239,228,0.1); }
.wa-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--accent); color: var(--charcoal); display: flex; align-items: center; justify-content: center; font-weight: 700; font-family: var(--font-display); font-size: 20px; }
.wa-name { font-size: 14px; font-weight: 600; }
.wa-status { font-family: var(--font-mono); font-size: 10px; color: rgba(245,239,228,0.55); display: flex; align-items: center; gap: 6px; margin-top: 2px; }
.wa-dot { width: 6px; height: 6px; border-radius: 50%; background: #25D366; }
.wa-close { width: 28px; height: 28px; border-radius: 50%; color: rgba(245,239,228,0.5); font-size: 20px; line-height: 1; cursor: pointer; }
.wa-msg { padding: 14px 0 16px; font-size: 14px; line-height: 1.5; color: rgba(245,239,228,0.85); }
.wa-cta { display: block; padding: 12px; background: #25D366; color: #FFF; text-align: center; border-radius: var(--radius); font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700; }
.mobile-sticky-cta { position: fixed; bottom: 0; left: 0; right: 0; z-index: 80; background: var(--charcoal); color: #F5EFE4; padding: 12px 16px 16px; border-top: 1px solid rgba(245,239,228,0.1); transform: translateY(100%); transition: transform 0.4s cubic-bezier(.2,.7,.2,1); }
.mobile-sticky-cta.show { transform: translateY(0); }
.msc-tag { display: block; font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(245,239,228,0.55); margin-bottom: 10px; }
.msc-tag strong { color: var(--accent); }
.msc-row { display: flex; gap: 10px; }
.msc-pri { flex: 1; display: inline-flex; align-items: center; justify-content: space-between; gap: 10px; padding: 14px 18px; background: var(--accent); color: var(--charcoal); font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700; border-radius: var(--radius); }
.msc-sec { display: flex; align-items: center; justify-content: center; width: 52px; height: 52px; border-radius: var(--radius); background: rgba(245,239,228,0.06); border: 1px solid rgba(245,239,228,0.15); color: #25D366; }
@media (min-width: 769px) { .mobile-sticky-cta { display: none !important; } }
.ph { position: relative; width: 100%; height: 100%; background: var(--bg-2); overflow: hidden; }
.ph-stripes { background: repeating-linear-gradient(135deg, rgba(255,255,255,0.02) 0 2px, transparent 2px 14px), linear-gradient(180deg, #1a1a1a, #0e0e0e); }
.ph-lime { background: repeating-linear-gradient(135deg, rgba(var(--accent-rgb),0.08) 0 2px, transparent 2px 14px), linear-gradient(180deg, #151812, #0f1208); }
.ph-contrast { background: radial-gradient(circle at 30% 40%, rgba(var(--accent-rgb),0.08), transparent 50%), repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0 2px, transparent 2px 14px), linear-gradient(180deg, #1d1d1d, #0a0a0a); }
.ph-burgundy { background: radial-gradient(circle at 40% 40%, rgba(var(--burgundy-rgb),0.6), #1a0608), linear-gradient(180deg, #2a0a10, #1a0608); }
.ph-before { background: linear-gradient(180deg, #2a2a2a, #1a1a1a); }
.ph-after { background: linear-gradient(180deg, #1a3020, #0f2018); }
.ph-label { position: absolute; top: 14px; left: 14px; font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-faint); padding: 4px 8px; background: rgba(10,10,10,0.5); border: 1px solid var(--line); }
.ph-center-label { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink-faint); text-align: center; padding: 20px; white-space: pre-line; }
.trak-footer { background: linear-gradient(180deg, var(--bg-1) 0%, var(--bg-2) 100%); border-top: 1px solid var(--line); }
.footer-marquee { background: var(--charcoal); color: rgba(245,239,228,0.4); padding: 14px 0; overflow: hidden; }
.fm-track { display: flex; gap: 0; white-space: nowrap; animation: trak-scroll 36s linear infinite; }
.fm-track span { font-family: var(--font-display); font-size: 22px; letter-spacing: 0.18em; padding-right: 48px; }
.footer-inner { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 60px; padding-top: 48px; }
.trak-footer h4 { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--ink-dim); margin-bottom: 20px; }
.trak-footer ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.trak-footer ul a { font-size: 14px; transition: color 0.2s; color: var(--ink-dim); }
.trak-footer ul a:hover { color: var(--accent); }
.footer-brand p { font-size: 13px; color: var(--ink-dim); max-width: 280px; line-height: 1.5; }
.footer-bottom { display: flex; justify-content: space-between; padding: 24px 0 32px; border-top: 1px solid var(--line); font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-faint); flex-wrap: wrap; gap: 12px; }
.designed-by { display: inline-flex; align-items: center; gap: 10px; font-size: 11px; letter-spacing: 0.18em; color: var(--ink-dim); }
.db-line { display: inline-block; width: 24px; height: 1px; background: var(--accent); }
.db-name { font-family: var(--font-display); font-size: 18px; letter-spacing: 0.08em; color: var(--burgundy); }
.db-name:hover { color: var(--accent); }
.db-mark { color: var(--accent); animation: pulse 2.6s ease-in-out infinite; }
@media (max-width: 900px) { .footer-inner { grid-template-columns: 1fr 1fr; } }
.tweaks-fab { position: fixed; bottom: 84px; right: 24px; z-index: 199; width: 44px; height: 44px; border-radius: 50%; background: var(--charcoal); color: #F5EFE4; border: 1px solid rgba(245,239,228,0.2); display: flex; align-items: center; justify-content: center; font-size: 18px; cursor: pointer; box-shadow: 0 8px 24px -6px rgba(0,0,0,0.5); transition: all 0.25s ease; }
.tweaks-fab:hover { background: var(--accent); color: var(--charcoal); transform: translateY(-2px); }
.tweaks-panel { position: fixed; bottom: 138px; right: 24px; z-index: 199; width: 272px; background: rgba(245,239,228,0.95); backdrop-filter: blur(20px); border-radius: 12px; border: 1px solid rgba(245,239,228,0.7); box-shadow: 0 20px 50px -15px rgba(0,0,0,0.4); padding: 14px; color: #29261b; font-family: var(--font-mono); font-size: 11px; }
.tweaks-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid rgba(41,38,27,0.12); }
.tweaks-head b { font-size: 12px; }
.tweaks-close { width: 22px; height: 22px; border-radius: 6px; border: 0; background: transparent; color: rgba(41,38,27,0.5); cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; }
.tweaks-close:hover { background: rgba(0,0,0,0.06); color: #29261b; }
.tweaks-label { font-size: 9px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(41,38,27,0.45); margin: 10px 0 6px; }
.tweaks-label:first-child { margin-top: 0; }
.theme-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; }
.theme-swatch { height: 30px; border-radius: 4px; cursor: pointer; border: 1.5px solid transparent; transition: all 0.15s; position: relative; overflow: hidden; }
.theme-swatch.active { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(41,38,27,0.2); }
.tweaks-select { width: 100%; height: 26px; padding: 0 8px; border: 0.5px solid rgba(0,0,0,0.12); border-radius: 7px; background: rgba(255,255,255,0.7); color: inherit; font-family: inherit; font-size: 11px; outline: none; margin-bottom: 4px; }
.tweaks-toggle-row { display: flex; align-items: center; justify-content: space-between; }
.tweaks-toggle { position: relative; width: 32px; height: 18px; border: 0; border-radius: 999px; background: rgba(0,0,0,0.15); transition: background 0.15s; cursor: pointer; padding: 0; }
.tweaks-toggle[data-on="1"] { background: #34c759; }
.tweaks-toggle i { position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.25); transition: transform 0.15s; }
.tweaks-toggle[data-on="1"] i { transform: translateX(14px); }
/* ─── Hamburger nav ────────────────────────────────────────── */
.nav-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 8px 6px; border: 1px solid transparent; border-radius: var(--radius); transition: border-color 0.2s; }
.nav-hamburger:hover { border-color: var(--line-2); }
.nav-hamburger span { display: block; width: 20px; height: 2px; background: var(--ink); border-radius: 2px; transition: transform 0.3s ease, opacity 0.3s ease; }
.nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav-hamburger.open span:nth-child(2) { opacity: 0; }
.nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
@media (max-width: 1040px) { .nav-hamburger { display: flex; } }
.nav-mobile-menu { position: fixed; inset: 0; z-index: 98; background: var(--bg); display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 0; transform: translateX(100%); transition: transform 0.4s cubic-bezier(.2,.7,.2,1); padding: 80px 40px 40px; }
.nav-mobile-menu.open { transform: translateX(0); }
.nav-mobile-menu a { font-family: var(--font-display); font-size: clamp(28px, 8vw, 44px); text-transform: uppercase; color: var(--ink); padding: 14px 0; width: 100%; text-align: center; border-bottom: 1px solid var(--line); transition: color 0.2s; display: block; }
.nav-mobile-menu a:last-of-type { border-bottom: none; }
.nav-mobile-menu a:hover { color: var(--accent); }
.nav-mobile-cta { background: var(--accent) !important; color: var(--charcoal) !important; border-radius: var(--radius) !important; border: none !important; font-family: var(--font-mono) !important; font-size: 13px !important; letter-spacing: 0.12em; margin-top: 20px; padding: 16px 32px !important; font-weight: 700; }
.nav-mobile-close { position: absolute; top: 18px; right: 18px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-dim); cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 8px 12px; border: 1px solid var(--line); border-radius: var(--radius); background: none; transition: all 0.2s; }
.nav-mobile-close:hover { color: var(--ink); border-color: var(--line-2); }
/* ─── Focus visible ─────────────────────────────────────────── */
#trak-root *:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 2px; }
/* ─── Reduced motion (full coverage) ───────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .hero-anim { transition: none !important; opacity: 1 !important; transform: translateY(0) !important; filter: none !important; }
  .reveal, .fx-reveal { transition: none !important; opacity: 1 !important; transform: none !important; }
  .draw-line::after { transition: none !important; }
  .marquee-track, .fm-track, .ribbon-track, .pb-ribbon span { animation: none !important; }
  .fw-stamp, .fw-stamp .stamp-center { animation: none !important; }
  .hero-scanline { animation: none !important; }
  .ub-dot, .hero-eyebrow-dot, .cta-sec-dot, .urgency-dot, .fw-badge .dot, .db-mark, .wa-dot { animation: none !important; }
  .cta-pri { animation: none !important; }
  .cta-pri-shine { animation: none !important; opacity: 0; }
  .scroll-line::after { animation: none !important; }
  .map-pin { animation: none !important; }
  .slot-bar-fill { animation: none !important; }
  .nav-mobile-menu { transition: none !important; }
  .pb-image { transform: none !important; }
}
/* ─── Mobile ≤ 768px ────────────────────────────────────────── */
@media (max-width: 768px) {
  .section { padding: 60px 0 !important; }
  .section-title { font-size: clamp(34px, 9vw, 46px) !important; }
  .section-head { grid-template-columns: 1fr !important; gap: 10px !important; margin-bottom: 28px !important; }
  .trak-nav, .trak-nav.scrolled { padding: 10px 14px !important; }
  .hero-cine { padding: 102px 16px 72px !important; min-height: 95svh; min-height: 95vh; }
  .hero-headline { font-size: clamp(36px, 11vw, 52px) !important; line-height: 0.93 !important; }
  .hero-subline { font-size: 13px !important; }
  .hero-cta-row { flex-direction: column !important; width: 100%; gap: 10px !important; }
  .cta-pri, .cta-sec { width: 100%; justify-content: center; }
  .cta-pri-text { padding: 18px 24px !important; font-size: 12px !important; justify-content: center; width: 100%; }
  .cta-sec { padding: 17px 22px !important; font-size: 11px !important; justify-content: center; }
  .hero-cta-micro { justify-content: center; font-size: 10px !important; }
  .ribbon-top { top: 72px !important; }
  .marquee-item { font-size: 26px !important; gap: 28px !important; }
  .testimonials-grid { grid-template-columns: 1fr !important; }
  .testimonial { padding: 24px 18px !important; min-height: auto !important; }
  .testimonial-body { font-size: 15px !important; }
  .parallax-band { min-height: 40vh !important; }
  .pb-content { padding: 40px 0 !important; }
  .results-grid { grid-template-columns: 1fr !important; gap: 18px !important; }
  .result-headline { font-size: 22px !important; }
  .fw-card { grid-template-columns: 1fr !important; padding: 32px 20px !important; gap: 24px !important; }
  .fw-right { display: none !important; }
  .fw-title { font-size: clamp(36px, 10vw, 52px) !important; }
  .why-grid { display: flex !important; flex-direction: column !important; gap: 24px !important; }
  .why-lead h2 { font-size: clamp(34px, 9vw, 46px) !important; }
  .why-items { display: grid !important; grid-template-columns: 1fr !important; }
  .why-item { min-height: auto !important; padding: 22px 18px !important; }
  .why-item h3 { font-size: 24px !important; }
  .trainers-row { grid-template-columns: 1fr 1fr !important; gap: 14px !important; }
  .trainer-name { font-size: 18px !important; }
  .journey-step h3 { font-size: 28px !important; }
  .exp-grid { grid-template-columns: 1fr 1fr !important; grid-auto-rows: 110px !important; gap: 10px !important; }
  .membership { grid-template-columns: 1fr !important; padding: 36px 18px !important; gap: 28px !important; }
  .membership h2 { font-size: clamp(32px, 8vw, 44px) !important; }
  .slot-count { font-size: 68px !important; }
  .lead-section { padding: 60px 0 !important; }
  .lead-wrap { grid-template-columns: 1fr !important; gap: 28px !important; }
  .lead-title { font-size: clamp(30px, 8vw, 40px) !important; }
  .lead-form { padding: 22px 16px !important; gap: 16px !important; }
  .location-grid { grid-template-columns: 1fr !important; }
  .map-block { aspect-ratio: 4/3 !important; }
  .final-cta { padding: 72px 0 !important; min-height: auto !important; }
  .final-cta h2 { font-size: clamp(48px, 14vw, 72px) !important; }
  .final-cta-actions { flex-direction: column !important; align-items: center !important; gap: 12px !important; }
  .footer-inner { grid-template-columns: 1fr 1fr !important; gap: 20px !important; padding-top: 28px !important; margin-bottom: 32px !important; }
  .footer-bottom { flex-direction: column !important; gap: 8px !important; }
  .tweaks-fab { bottom: 76px !important; right: 16px !important; }
  .tweaks-panel { width: calc(100vw - 32px) !important; right: 16px !important; bottom: 128px !important; }
  .wa-float { bottom: 68px !important; right: 16px !important; }
}
`;
