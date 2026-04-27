function Trainers() {
  const trainers = [
    { name: 'Coach V.', role: 'Head Coach', duration: '0:18', tag: '01', quote: "If you don't know where to start, I'll guide you. Literally rep by rep." },
    { name: 'Coach D.', role: 'Performance Coach', duration: '0:14', tag: '02', quote: "I fix the body your desk job gave you. We'll fix the mindset too." },
    { name: 'Coach R.', role: 'Transformation Lead', duration: '0:20', tag: '03', quote: "You don't need willpower. You need a plan and someone checking in. That's me." },
    { name: 'Coach A.', role: 'Beginner Specialist', duration: '0:16', tag: '04', quote: "First day at a gym is scary. I remember. You'll be okay — I promise." },
  ];

  return (
    <section className="section section-alt" id="trainers">
      <div className="container">
        <div className="section-head">
          <div className="mono" style={{ color: 'var(--accent-deep)' }}>07 / Your Coach</div>
          <div>
            <h2 className="display section-title">
              The people<br/>
              who will<br/>
              <span style={{ color: 'var(--burgundy)' }}>have your back.</span>
            </h2>
            <p style={{ marginTop: 24, color: 'var(--ink-dim)', maxWidth: 540, lineHeight: 1.55, fontSize: 17 }}>
              Tap any coach to hear them in their own words — 15 seconds each. You pick who you vibe with. They'll pick you up when you stall.
            </p>
          </div>
        </div>

        <div className="trainers-row">
          {trainers.map((t, i) => (
            <div key={t.name} className="trainer">
              <div className="trainer-photo">
                <div className="trainer-tag">Coach / {t.tag}</div>
                <div className="video-duration">▶ {t.duration}</div>
                <Placeholder variant={i % 2 === 1 ? 'lime' : 'stripes'} center={`[ Coach intro video ]\n${t.name}`} />
                <button className="play-btn" aria-label={`Play ${t.name} intro`}>▶</button>
              </div>
              <div className="trainer-info">
                <div>
                  <div className="trainer-name">{t.name}</div>
                  <div className="trainer-role">{t.role}</div>
                </div>
              </div>
              <p className="trainer-bio">"{t.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
window.Trainers = Trainers;
