function ParallaxBand({ image, label, num, quote }) {
  const ref = React.useRef(null);
  const [y, setY] = React.useState(0);
  React.useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const center = r.top + r.height / 2 - window.innerHeight / 2;
      setY(center * -0.25);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="parallax-band" ref={ref}>
      <div
        className="pb-image"
        style={{
          backgroundImage: `url(${image})`,
          transform: `translate3d(0, ${y}px, 0) scale(1.15)`,
        }}
      />
      <div className="pb-overlay"></div>
      <div className="pb-grain"></div>
      <div className="container pb-content">
        <div className="pb-meta">
          <span className="pb-num">{num}</span>
          <span className="pb-line"></span>
          <span className="pb-label">{label}</span>
        </div>
        <h2 className="pb-quote">{quote}</h2>
      </div>
      <div className="pb-ribbon" aria-hidden="true">
        <span>NO SHORTCUTS · NO EXCUSES · NO MAGIC · ONLY WORK · NO SHORTCUTS · NO EXCUSES · NO MAGIC · ONLY WORK ·</span>
      </div>
    </section>
  );
}
window.ParallaxBand = ParallaxBand;
