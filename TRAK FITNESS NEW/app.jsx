function App() {
  React.useEffect(() => {
    const els = document.querySelectorAll('.reveal, .draw-line, .fx-reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <React.Fragment>
      <UrgencyBar />
      <Nav />
      <Hero />
      <Marquee />
      <ParallaxBand
        image="assets/manga-warrior.jpg"
        num="II"
        label="The discipline you've been missing"
        quote={<>Pain is temporary.<br/><span style={{ color: 'var(--accent)' }}>Quitting lasts forever.</span></>}
      />
      <FreeWorkout />
      <LeadForm />
      <Testimonials />
      <ParallaxBand
        image="assets/inked-back.jpg"
        num="VI"
        label="Built rep by rep"
        quote={<>You don't <span className="strike">find</span> <span style={{ color: 'var(--accent)' }}>build</span> the body you want.</>}
      />
      <Results />
      <Trainers />
      <Why />
      <Journey />
      <Experience />
      <Membership />
      <Location />
      <FinalCTA />
      <Footer />
      <WhatsAppFloat />
      <MobileStickyCTA />
      <TweaksRoot />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
