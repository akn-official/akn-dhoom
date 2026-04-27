function Experience() {
  return (
    <section className="section" id="experience">
      <div className="container">
        <div className="section-head">
          <div className="mono" style={{ color: 'var(--accent)' }}>06 / The Floor</div>
          <h2 className="display section-title">
            The space<br/>does its <span style={{ color: 'var(--accent)' }}>job.</span>
          </h2>
        </div>

        <div className="exp-grid">
          <div className="exp-tile t-a">
            <Placeholder variant="contrast" label="FLOOR / 01" center="[ Wide shot — main training floor ]" />
            <div className="tile-label"><span>Main Floor</span><span>2,400 sqft</span></div>
          </div>
          <div className="exp-tile t-b">
            <Placeholder variant="stripes" label="FLOOR / 02" center="[ Rack row — rigs & plates ]" />
            <div className="tile-label"><span>Power Rigs</span><span>×6</span></div>
          </div>
          <div className="exp-tile t-c">
            <Placeholder variant="lime" label="FLOOR / 03" center="[ Dumbbell wall ]" />
            <div className="tile-label"><span>Free Weights</span><span>2.5–50kg</span></div>
          </div>
          <div className="exp-tile t-d">
            <Placeholder variant="contrast" label="FLOOR / 04" center="[ Cardio zone, window light ]" />
            <div className="tile-label"><span>Cardio Deck</span><span>Open 6am–11pm</span></div>
          </div>
          <div className="exp-tile t-e">
            <Placeholder variant="stripes" label="FLOOR / 05" center="[ Recovery / stretch area ]" />
            <div className="tile-label"><span>Recovery</span><span>Mats · Rollers</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
window.Experience = Experience;
