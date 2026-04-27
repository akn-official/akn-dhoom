function Location() {
  return (
    <section className="section" id="location">
      <div className="container">
        <div className="section-head">
          <div className="mono" style={{ color: 'var(--accent-deep)' }}>10 / Find Us</div>
          <h2 className="display section-title">
            One of Chennai's<br/>
            <span style={{ color: 'var(--burgundy)' }}>highest-rated</span> gyms.
          </h2>
        </div>

        <div className="location-grid">
          <div className="map-block">
            <div className="map-pin"></div>
            <div className="map-label">Trak Fitness</div>
            <div className="map-street">Chennai · Coaching-first studio</div>
          </div>

          <div className="info-block">
            <div className="info-row">
              <div className="info-label">Reputation</div>
              <div className="info-value">
                <span className="accent-inline">5.0 ★</span> from 468 members<br/>
                <span style={{ color: 'var(--ink-dim)', fontSize: 14 }}>One of Chennai's highest-rated gyms</span>
              </div>
            </div>
            <div className="info-row">
              <div className="info-label">Hours</div>
              <div className="info-value">
                Mon–Sat · <span className="accent-inline">5:00 – 23:00</span><br/>
                Sun · 6:00 – 14:00
              </div>
            </div>
            <div className="info-row">
              <div className="info-label">First Visit</div>
              <div className="info-value">
                Free workout <span className="accent-inline">on the house.</span><br/>
                <span style={{ color: 'var(--ink-dim)', fontSize: 14 }}>No card. No sales pitch.</span>
              </div>
            </div>
            <div className="info-row">
              <div className="info-label">Response</div>
              <div className="info-value">
                WhatsApp reply within <span className="accent-inline">2 hours</span><br/>
                <span style={{ color: 'var(--ink-dim)', fontSize: 14 }}>Chat with a coach, not a chatbot</span>
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <a href="#lead" className="btn btn-amber">
                Book Your Free Visit
                <span className="arrow">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
window.Location = Location;
