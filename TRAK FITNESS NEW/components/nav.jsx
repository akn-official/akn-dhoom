function Nav() {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <a href="#" className="logo" style={{ color: "rgb(229, 130, 57)" }}>
        <span className="logo-mark"></span>
        Trak<span style={{ color: 'var(--accent)' }}>/</span>Fitness
      </a>
      <div className="nav-links">
        <a href="#why">Why Trak</a>
        <a href="#trainers">Trainers</a>
        <a href="#journey">Journey</a>
        <a href="#membership">Membership</a>
        <a href="#location">Location</a>
      </div>
      <a href="#membership" className="nav-cta">Book a Visit →</a>
    </nav>);

}
window.Nav = Nav;