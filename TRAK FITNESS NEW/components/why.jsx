function Why() {
  const items = [
    {
      num: '01',
      title: 'We See You Show Up',
      sub: '"I don\'t know where to start." You don\'t have to. A coach walks you through your first rep to your first deadlift — at whatever pace your body needs.'
    },
    {
      num: '02',
      title: 'We Notice When You Don\'t',
      sub: 'Miss a day, get a warm check-in. Not pushy — caring. The hardest part of training is showing up. We make it feel like you\'re expected.'
    },
    {
      num: '03',
      title: 'The Space Feels Human',
      sub: 'No mirror flexing. No grunt squad. Just a clean, warm floor where beginners and lifetime lifters share space with quiet respect.'
    },
    {
      num: '04',
      title: 'You Leave With Confidence',
      sub: 'We don\'t just build bodies. We build the version of you that doesn\'t flinch in photos, sleeps better, and walks taller into every room.'
    },
  ];
  return (
    <section className="section" id="why">
      <div className="container">
        <div className="section-head">
          <div className="mono" style={{ color: 'var(--accent-deep)' }}>06 / Why Trak</div>
          <h2 className="display section-title">
            Most gyms<br/>
            sell <span style={{ color: 'var(--ink-dim)' }}>access.</span><br/>
            We sell <span style={{ color: 'var(--burgundy)' }}>change.</span>
          </h2>
        </div>

        <div className="why-grid">
          <div className="why-lead">
            <h2 className="display" style={{ fontSize: 'clamp(44px, 6vw, 88px)' }}>
              You don't<br/>
              need more<br/>
              <span className="stroke">equipment.</span><br/>
              You need<br/>
              someone <span style={{ color: 'var(--burgundy)' }}>watching.</span>
            </h2>
            <p style={{ marginTop: 32, color: 'var(--ink-dim)', maxWidth: 420, lineHeight: 1.55 }}>
              The reason most gym memberships die in the first month isn't lack of motivation. It's isolation. Trak was built on one stubborn bet: keep coaches within earshot of every member, every single session.
            </p>
          </div>

          <div className="why-items">
            {items.map((it) => (
              <div key={it.num} className="why-item">
                <div>
                  <div className="why-num">{it.num}</div>
                  <h3>{it.title}</h3>
                </div>
                <div className="why-item-sub">{it.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
window.Why = Why;
