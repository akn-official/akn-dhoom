function UrgencyBar() {
  return (
    <div className="urgency-bar">
      <div className="container urgency-bar-inner">
        <div className="ub-item"><span className="ub-dot"></span><strong>15</strong> free trial slots left this week</div>
        <div className="ub-sep">/</div>
        <div className="ub-item">Next intake batch starts <strong>Monday</strong></div>
        <div className="ub-sep">/</div>
        <div className="ub-item">5.0 ★ · 468 members</div>
      </div>
    </div>
  );
}
window.UrgencyBar = UrgencyBar;
