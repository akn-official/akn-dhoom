function Journey() {
  const [progress, setProgress] = React.useState(0);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setProgress(100);
          io.disconnect();
        }
      });
    }, { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const steps = [
    { n: '01', title: 'Walk In', body: 'Free first visit. No pressure pitch. We assess, you decide. Takes 45 minutes.' },
    { n: '02', title: 'Get Mapped', body: 'Body analysis, goal conversation, a written plan for your first 30 days. Built for you, not a template.' },
    { n: '03', title: 'Get Coached', body: 'Every session, someone watches. Form calls, weight progressions, honest feedback — the hours you put in actually compound.' },
    { n: '04', title: 'Become', body: 'Most members hit their first visible change by week 6. The discipline outlasts the photo. That\'s the real prize.' },
  ];

  return (
    <section className="section journey" id="journey" ref={ref}>
      <div className="container">
        <div className="section-head">
          <div className="mono" style={{ color: 'var(--accent)' }}>05 / Method</div>
          <h2 className="display section-title">
            From doubt<br/>to <span style={{ color: 'var(--accent)' }}>done.</span>
          </h2>
        </div>

        <div className="journey-steps" style={{ '--journey-progress': `${progress}%` }}>
          {steps.map((s, i) => (
            <div key={s.n} className={`journey-step ${progress > 0 ? 'active' : ''}`} style={{ transitionDelay: `${i * 200}ms` }}>
              <div className="step-num">STAGE {s.n}</div>
              <div className="dot"></div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
window.Journey = Journey;
