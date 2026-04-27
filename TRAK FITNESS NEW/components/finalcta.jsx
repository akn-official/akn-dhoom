function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="container">
        <div className="mono" style={{ color: 'var(--accent)', marginBottom: 32 }}>09 / The Decision</div>
        <h2>
          <div className="line-1"><span className="stroke">Stop</span> waiting.</div>
          <div className="line-2">Start becoming.</div>
        </h2>
        <p className="final-cta-sub">
          The version of you that walks out of here in six months — they started today. Not Monday. Not next month. Today.
        </p>
        <div className="final-cta-actions">
          <a href="#free-workout" className="btn btn-amber">
            Book Your Free Workout
            <span className="arrow">→</span>
          </a>
          <a href="#trainers" className="btn btn-ghost" style={{ borderColor: 'rgba(245,239,228,0.4)', color: '#F5EFE4' }}>
            Meet the Coaches
          </a>
        </div>
      </div>
    </section>
  );
}
window.FinalCTA = FinalCTA;
