function Testimonials() {
  const quotes = [
    {
      body: "I was the person who quit every gym in three weeks. Nine months in, still showing up. The coaches actually remember your name — and your goals.",
      name: "A member · Y1",
      meta: "9 months in",
      initials: "AR"
    },
    {
      body: "Walked in terrified of the barbell. Left deadlifting my bodyweight. They fix your form before your ego gets in the way.",
      name: "A member · Y2",
      meta: "1 year in",
      initials: "PS"
    },
    {
      body: "Best part isn't the equipment. It's the 7am message asking why I wasn't in yesterday. Accountability, built in.",
      name: "A member · Y3",
      meta: "6 months in",
      initials: "KV"
    },
    {
      body: "Clean, no-ego, serious training. Zero posturing. You come to work, everyone's working. That's rare anywhere I've trained.",
      name: "A member · Y4",
      meta: "2 years in",
      initials: "MJ"
    },
    {
      body: "Lost 14 kilos. Gained a spine. The posture corrections alone changed my office back pain forever.",
      name: "A member · Y5",
      meta: "8 months in",
      initials: "RD"
    },
    {
      body: "I've trained in three cities. Nothing touches the individual attention here. You're not a number on the board.",
      name: "A member · Y6",
      meta: "1.5 years in",
      initials: "AT"
    },
  ];

  return (
    <section className="section" id="proof">
      <div className="container">
        <div className="section-head">
          <div className="mono" style={{ color: 'var(--accent-deep)' }}>02 / Social Proof</div>
          <h2 className="display section-title">
            468 reviews.<br/>
            <span style={{ color: 'var(--burgundy)' }}>Zero</span> below five.
          </h2>
        </div>
      </div>
      <div className="testimonials-grid">
        {quotes.map((q, i) => (
          <div key={i} className="testimonial">
            <div className="quote-mark">"</div>
            <div className="testimonial-body">{q.body}</div>
            <div className="testimonial-author">
              <div className="avatar">{q.initials}</div>
              <div>
                <div className="author-name">{q.name}</div>
                <div className="author-meta">{q.meta}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
window.Testimonials = Testimonials;
