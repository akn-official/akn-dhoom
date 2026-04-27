function FreeWorkout() {
  const [slots, setSlots] = React.useState(7);
  return (
    <section className="section free-workout" id="free-workout">
      <div className="container">
        <div className="fw-card">
          <div className="fw-left">
            <div className="mono fw-badge">
              <span className="dot"></span>
              Limited Daily Slots · {slots} Left Today
            </div>
            <h2 className="display fw-title">
              Your first<br/>
              workout is<br/>
              <span className="amber">on us.</span>
            </h2>
            <p className="fw-sub">
              No pressure. No sales pitch. Just a real session with a real coach — so you can feel what training here actually looks like before you decide anything.
            </p>
            <ul className="fw-list">
              <li><span className="fw-tick">✓</span> 60-minute full coached session</li>
              <li><span className="fw-tick">✓</span> Posture + mobility assessment</li>
              <li><span className="fw-tick">✓</span> Honest feedback. Zero upsell.</li>
            </ul>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 32 }}>
              <a href="#membership" className="btn btn-amber">
                Book Your Free Workout
                <span className="arrow">→</span>
              </a>
              <a href="#journey" className="btn btn-ghost" style={{ borderColor: 'rgba(245,239,228,0.4)', color: '#F5EFE4' }}>
                How It Works
              </a>
            </div>
          </div>
          <div className="fw-right">
            <Placeholder
              variant="burgundy"
              label="FREE / SESSION"
              center="[ Warm gym moment — coach spotting a member mid-set ]"
            />
            <div className="fw-stamp">
              <div className="stamp-inner">
                <span className="stamp-text">FIRST · SESSION · FREE · TODAY ·</span>
              </div>
              <span className="stamp-center">FREE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
window.FreeWorkout = FreeWorkout;
