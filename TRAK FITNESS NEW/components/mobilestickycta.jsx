function MobileStickyCTA() {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => {
      // Show after scrolling past hero (~600px), hide near final CTA / footer
      const y = window.scrollY;
      const docH = document.documentElement.scrollHeight;
      const winH = window.innerHeight;
      const nearBottom = y + winH > docH - 600;
      setShow(y > 600 && !nearBottom);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`mobile-sticky-cta ${show ? 'show' : ''}`} aria-hidden={!show}>
      <span className="msc-tag">
        <strong>15</strong> free trial slots left this week
      </span>
      <div className="msc-row">
        <a href="#lead" className="msc-pri">
          <span className="msc-pulse"></span>
          <span>Claim Your Free Trial</span>
          <span>→</span>
        </a>
        <a href="#" className="msc-sec" aria-label="Chat on WhatsApp">
          <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
            <path d="M16 3C9 3 3.3 8.7 3.3 15.7c0 2.5.7 4.8 1.9 6.8L3 29l6.7-2.1c1.9 1 4 1.6 6.3 1.6 7 0 12.7-5.7 12.7-12.7S23 3 16 3zm0 23c-2 0-4-.6-5.7-1.6l-.4-.2-4 1.2 1.3-3.9-.3-.4C5.7 19.4 5 17.6 5 15.7 5 9.8 9.9 5 16 5s11 4.8 11 10.7S22.1 26 16 26zm6.3-7.9c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.3-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.5.2-.2.2-.3.3-.5.1-.2.1-.4 0-.5-.1-.2-.8-1.9-1.1-2.5-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.1 1.3 3.4c.2.2 2.3 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.1-.3-.2-.6-.3z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
window.MobileStickyCTA = MobileStickyCTA;
