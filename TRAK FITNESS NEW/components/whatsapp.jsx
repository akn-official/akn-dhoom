function WhatsAppFloat() {
  const [show, setShow] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setShow(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`wa-float ${show ? 'show' : ''} ${expanded ? 'expanded' : ''}`}>
      {expanded && (
        <div className="wa-card">
          <div className="wa-card-header">
            <div className="wa-avatar">C</div>
            <div>
              <div className="wa-name">Coach on standby</div>
              <div className="wa-status"><span className="wa-dot"></span> Usually replies in 5 min</div>
            </div>
            <button className="wa-close" onClick={() => setExpanded(false)} aria-label="Close">×</button>
          </div>
          <div className="wa-msg">
            Hey 👋 Not sure where to start? Tell me your goal and I'll send you a plan. No pressure.
          </div>
          <a href="#lead" className="wa-cta" onClick={() => setExpanded(false)}>
            Start the chat →
          </a>
        </div>
      )}
      <button className="wa-btn" onClick={() => setExpanded(!expanded)} aria-label="Chat with a trainer on WhatsApp">
        <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">
          <path d="M16 3C9 3 3.3 8.7 3.3 15.7c0 2.5.7 4.8 1.9 6.8L3 29l6.7-2.1c1.9 1 4 1.6 6.3 1.6 7 0 12.7-5.7 12.7-12.7S23 3 16 3zm0 23c-2 0-4-.6-5.7-1.6l-.4-.2-4 1.2 1.3-3.9-.3-.4C5.7 19.4 5 17.6 5 15.7 5 9.7 9.9 4.8 16 4.8s11 4.9 11 11c0 6-4.9 10.9-11 10.9zm6-8.2c-.3-.2-2-.9-2.3-1-.3-.1-.5-.2-.8.2-.2.3-.9 1-1.1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.7-1.6-1-.9-1.7-1.9-1.9-2.3-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.8-1.8-1-2.5-.3-.7-.5-.6-.8-.6h-.7c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 3 1.2 3.2c.1.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 2-.8 2.2-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.6-.4z"/>
        </svg>
        {!expanded && (
          <span className="wa-label">Chat with a trainer</span>
        )}
      </button>
    </div>
  );
}
window.WhatsAppFloat = WhatsAppFloat;
