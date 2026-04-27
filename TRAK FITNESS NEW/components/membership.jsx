function Membership() {
  const [slots, setSlots] = React.useState(12);

  // Gentle slow countdown pulse (not real — it's a prototype)
  React.useEffect(() => {
    const t = setInterval(() => setSlots((s) => (s > 8 ? s : 12)), 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="section" id="membership">
      <div className="container">
        <div className="section-head">
          <div className="mono" style={{ color: 'var(--accent)' }}>07 / Join</div>
          <h2 className="display section-title">
            Good coaches<br/>don't <span style={{ color: 'var(--accent)' }}>scale.</span>
          </h2>
        </div>

        <div className="membership">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2>
              Personal coaching<br/>is <span className="accent">capped.</span><br/>
              On purpose.
            </h2>
            <p className="membership-body">
              Every Trak coach caps their roster. No member gets diluted attention. When slots run out, we open a waitlist — not add bodies to the floor. This month has {slots} open spots across all coaches.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button className="btn btn-primary">
                Claim Your Slot
                <span className="arrow">→</span>
              </button>
              <button className="btn btn-ghost">
                Book a Free Visit
              </button>
            </div>
          </div>

          <div className="slots-widget">
            <div className="slot-label">● Live Availability · Apr 2026</div>
            <div className="slot-count">{String(slots).padStart(2, '0')}</div>
            <div className="slot-sub">coaching slots remaining this month</div>
            <div className="slot-bar">
              <div className="slot-bar-fill" style={{ width: `${(slots / 40) * 100}%` }}></div>
            </div>
            <div className="slot-detail">
              <span>Filled · 28</span>
              <span>Cap · 40</span>
            </div>
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
window.Membership = Membership;
