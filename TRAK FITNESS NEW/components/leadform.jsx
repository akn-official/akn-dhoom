function LeadForm() {
  const [form, setForm] = React.useState({ name: '', phone: '', goal: 'Fat loss' });
  const [submitted, setSubmitted] = React.useState(false);
  const goals = ['Fat loss', 'Muscle gain', 'General fitness'];

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setSubmitted(true);
  };

  return (
    <section className="section lead-section" id="lead">
      <div className="container">
        <div className="lead-wrap">
          <div className="lead-left">
            <div className="mono" style={{ color: 'var(--accent-deep)', marginBottom: 16 }}>04 / Your Plan</div>
            <h2 className="display lead-title">
              Get a free<br/>
              <span style={{ color: 'var(--burgundy)' }}>personalized</span><br/>
              fitness plan in <span className="lead-accent">24 hours.</span>
            </h2>
            <p className="lead-sub">
              Tell us three things. A coach reviews your goal, maps a 30-day starting plan, and sends it to your WhatsApp — no sales calls, no pressure.
            </p>
            <ul className="lead-bullets">
              <li><span className="fw-tick">✓</span> Personalized to your current level</li>
              <li><span className="fw-tick">✓</span> Reviewed by a real coach (not AI)</li>
              <li><span className="fw-tick">✓</span> Yours to keep, even if you don't join</li>
            </ul>
            <div className="lead-urgency">
              <span className="urgency-dot"></span>
              <strong>Next batch starts Monday.</strong> Only 15 free-trial slots this week.
            </div>
          </div>

          <form className="lead-form" onSubmit={onSubmit}>
            {!submitted ? (
              <React.Fragment>
                <div className="lead-form-header">
                  <div className="mono" style={{ color: 'var(--accent)' }}>● Free Plan Request</div>
                  <div className="mono" style={{ color: 'rgba(245,239,228,0.5)' }}>~ 30 seconds</div>
                </div>
                <div className="lead-field">
                  <label>Your name</label>
                  <input
                    type="text"
                    placeholder="e.g. Priya"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="lead-field">
                  <label>Phone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+91 ••••• •••••"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="lead-field">
                  <label>Primary goal</label>
                  <div className="goal-chips">
                    {goals.map((g) => (
                      <button
                        type="button"
                        key={g}
                        className={`goal-chip ${form.goal === g ? 'active' : ''}`}
                        onClick={() => setForm({ ...form, goal: g })}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <button type="submit" className="btn-hero-primary lead-submit">
                  <span>Send My Free Plan</span>
                  <span className="arrow">→</span>
                </button>
                <div className="lead-fineprint">
                  We reply on WhatsApp within 24 hours. No spam. Opt out anytime.
                </div>
              </React.Fragment>
            ) : (
              <div className="lead-success">
                <div className="success-mark">✓</div>
                <h3>Got it, {form.name.split(' ')[0] || 'friend'}.</h3>
                <p>A coach will message you on <strong>{form.phone}</strong> within 24 hours with your free <strong>{form.goal.toLowerCase()}</strong> plan.</p>
                <div className="mono" style={{ color: 'rgba(245,239,228,0.5)', marginTop: 20 }}>No sales call. Just your plan.</div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
window.LeadForm = LeadForm;
