function Results() {
  const stories = [
    {
      name: 'M.',
      headline: 'Started with zero confidence. Now trains 5x a week.',
      timeline: ['Week 1', 'Week 8', 'Week 16'],
      quote: '"Every app I tried gave up on me. My coach didn\'t."',
      meta: 'Fat loss · Father of two',
    },
    {
      name: 'R.',
      headline: 'First pull-up at 38. Then the second.',
      timeline: ['Week 1', 'Week 8', 'Week 16'],
      quote: '"I used to avoid mirrors. Now I ask for the heavier bar."',
      meta: 'Muscle gain · Marketing lead',
    },
    {
      name: 'S.',
      headline: 'Post-injury rebuild. Stronger than before.',
      timeline: ['Week 1', 'Week 8', 'Week 16'],
      quote: '"Two surgeries. Three gyms that gave up. Trak didn\'t."',
      meta: 'General fitness · Age 44',
    },
  ];

  return (
    <section className="section results" id="results">
      <div className="container">
        <div className="section-head">
          <div className="mono" style={{ color: 'var(--accent-deep)' }}>05 / Real Transformations</div>
          <div>
            <h2 className="display section-title">
              Real people.<br/>
              <span style={{ color: 'var(--burgundy)' }}>Real weeks.</span><br/>
              Real change.
            </h2>
            <p style={{ marginTop: 24, color: 'var(--ink-dim)', maxWidth: 540, lineHeight: 1.55, fontSize: 17 }}>
              These aren't crash stories. This is what happens when someone keeps showing up — with a coach keeping pace. Names shortened for privacy. Photos shared with permission.
            </p>
          </div>
        </div>

        <div className="results-grid">
          {stories.map((s, i) => (
            <article key={i} className="result-card">
              <div className="result-timeline-row">
                {s.timeline.map((w, wi) => (
                  <React.Fragment key={w}>
                    <div className="result-img-wrap">
                      <div className="result-img">
                        <Placeholder variant={wi === 0 ? 'before' : wi === 2 ? 'after' : 'stripes'} center={`[ ${w} ]`} />
                      </div>
                      <div className="result-week">{w}</div>
                    </div>
                    {wi < s.timeline.length - 1 && <div className="result-arrow">→</div>}
                  </React.Fragment>
                ))}
              </div>
              <div className="result-body">
                <h3 className="result-headline">{s.headline}</h3>
                <p className="result-quote">{s.quote}</p>
                <div className="result-meta">— {s.name} · {s.meta}</div>
              </div>
            </article>
          ))}
        </div>

        <div className="results-foot">
          <div className="mono" style={{ color: 'var(--ink-dim)' }}>Photos shared with permission · Names shortened for privacy</div>
          <a href="#lead" className="btn btn-amber">
            Start Your 16 Weeks
            <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
window.Results = Results;
