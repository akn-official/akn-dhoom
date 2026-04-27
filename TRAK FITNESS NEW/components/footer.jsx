function Footer() {
  return (
    <footer className="footer">
      <div className="footer-marquee" aria-hidden="true">
        <div className="fm-track">
          <span>TRAK FITNESS · BUILT NOT BOUGHT · TRAK FITNESS · TRANSFORMATION ON THE CLOCK · TRAK FITNESS · </span>
          <span>TRAK FITNESS · BUILT NOT BOUGHT · TRAK FITNESS · TRANSFORMATION ON THE CLOCK · TRAK FITNESS · </span>
        </div>
      </div>
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-mark"></span>
              Trak<span style={{ color: 'var(--accent)' }}>/</span>Fitness
            </div>
            <p>A coaching-first gym built for people who want more than a membership card. Transformation, on the clock.</p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><a href="#why">Why Trak</a></li>
              <li><a href="#trainers">Coaches</a></li>
              <li><a href="#journey">Method</a></li>
              <li><a href="#experience">The Floor</a></li>
            </ul>
          </div>
          <div>
            <h4>Get Started</h4>
            <ul>
              <li><a href="#lead">Free Plan</a></li>
              <li><a href="#free-workout">Free Workout</a></li>
              <li><a href="#membership">Membership</a></li>
              <li><a href="#location">Visit Us</a></li>
            </ul>
          </div>
          <div>
            <h4>Social</h4>
            <ul>
              <li><a href="#">Instagram ↗</a></li>
              <li><a href="#">YouTube ↗</a></li>
              <li><a href="#">WhatsApp ↗</a></li>
              <li><a href="#">Google ↗</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Trak Fitness · All rights reserved</span>
          <span className="designed-by">
            <span className="db-line"></span>
            <span>Designed by</span>
            <a href="#" className="db-name">AKN</a>
            <span className="db-mark">◆</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
window.Footer = Footer;
