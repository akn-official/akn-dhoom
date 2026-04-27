function Hero() {
  const [loaded, setLoaded] = React.useState(false);
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const t = requestAnimationFrame(() => setLoaded(true));
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(t); window.removeEventListener('scroll', onScroll); };
  }, []);

  const parallax = Math.min(scrollY * 0.4, 400);
  const fade = Math.max(1 - scrollY / 600, 0);

  return (
    <section className={`hero hero-cine ${loaded ? 'loaded' : ''}`}>
      {/* Parallax background stack */}
      <div className="hero-bg-stack" aria-hidden="true">
        <div
          className="hero-bg-layer hero-bg-far"
          style={{ transform: `translate3d(0, ${parallax * 0.3}px, 0) scale(1.05)`, opacity: fade }}
        />
        <div
          className="hero-bg-layer hero-bg-mid"
          style={{ transform: `translate3d(0, ${parallax * 0.55}px, 0) scale(1.02)`, opacity: fade }}
        />
        <div
          className="hero-bg-layer hero-bg-near"
          style={{ transform: `translate3d(0, ${parallax * 0.8}px, 0)`, opacity: fade * 0.85 }}
        />
        <div className="hero-grid"></div>
        <div className="hero-vignette"></div>
        <div className="hero-scanline"></div>
      </div>

      {/* Reveal ribbons */}
      <div className="ribbon ribbon-top" aria-hidden="true">
        <div className="ribbon-track">
          <span>● BUILT NOT BOUGHT ● TRANSFORM ● DISCIPLINE ● TRAK FITNESS ● BUILT NOT BOUGHT ● TRANSFORM ● DISCIPLINE ● TRAK FITNESS ●</span>
          <span>● BUILT NOT BOUGHT ● TRANSFORM ● DISCIPLINE ● TRAK FITNESS ● BUILT NOT BOUGHT ● TRANSFORM ● DISCIPLINE ● TRAK FITNESS ●</span>
        </div>
      </div>

      {/* Watermark */}
      <div className="hero-watermark" aria-hidden="true">TRAK</div>

      {/* Side index marks */}
      <div className="hero-index hero-index-left" aria-hidden="true">
        <span>N°</span>
        <span className="big">001</span>
        <span>EST · MMXXVI</span>
      </div>
      <div className="hero-index hero-index-right" aria-hidden="true">
        <span className="vert">CHENNAI / IN</span>
      </div>

      <div className="hero-content">
        <div className="hero-eyebrow hero-anim" style={{ '--d': '0ms' }}>
          <span className="hero-eyebrow-dot"></span>
          <span>Chennai's Highest-Rated Coaching Gym</span>
          <span className="hero-eyebrow-sep">/</span>
          <span className="hero-eyebrow-stars">★★★★★</span>
          <span>468 · 5.0</span>
        </div>

        <h1 className="hero-headline hero-anim" style={{ '--d': '120ms' }}>
          <span className="hl-line"><span className="hl-word">Not</span> <span className="hl-word">a</span> <span className="hl-word">gym.</span></span>
          <span className="hl-line hl-accent"><span className="hl-word">A</span> <span className="hl-word">guided</span> <span className="hl-word">transformation</span></span>
          <span className="hl-line hl-em"><span className="hl-word">system.</span></span>
        </h1>

        <p className="hero-subline hero-anim" style={{ '--d': '420ms' }}>
          You don't need to know where to start. You don't need to be fit already. You just need one coach who shows up for you — and a room that makes consistency feel easy. <strong>We'll take it from there.</strong>
        </p>

        <div className="hero-cta hero-anim" style={{ '--d': '600ms' }}>
          <div className="hero-cta-row">
            <a href="#lead" className="cta-pri">
              <span className="cta-pri-bg"></span>
              <span className="cta-pri-text">
                <span>Start Your Transformation</span>
                <span className="cta-arrow">→</span>
              </span>
              <span className="cta-pri-shine"></span>
            </a>
            <a href="#free-workout" className="cta-sec">
              <span className="cta-sec-dot"></span>
              Try Your First Workout <strong>FREE</strong>
            </a>
          </div>
          <div className="hero-cta-micro">
            <span className="micro-tick">✓</span>
            Only <strong>15</strong> free trial slots left this week · No card required
          </div>
        </div>

        <div className="hero-scroll hero-anim" style={{ '--d': '800ms' }}>
          <span className="scroll-line"></span>
          <span>Scroll · 01 / 12</span>
        </div>
      </div>
    </section>
  );
}
window.Hero = Hero;
