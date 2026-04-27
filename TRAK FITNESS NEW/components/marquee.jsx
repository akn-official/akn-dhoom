function Marquee() {
  const items = [
    { text: 'No Excuses', strong: true },
    { text: 'Form First' },
    { text: 'Coached Every Rep', strong: true },
    { text: 'Judgement Free' },
    { text: 'Built Not Bought', strong: true },
    { text: 'Beginner Safe' },
    { text: 'Daily Follow-Up', strong: true },
    { text: 'Zero Ego' },
  ];
  // Double for seamless loop
  const loop = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {loop.map((it, i) => (
          <div key={i} className={`marquee-item ${it.strong ? 'strong' : ''}`}>
            {it.text}
            <span className="sep">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
window.Marquee = Marquee;
