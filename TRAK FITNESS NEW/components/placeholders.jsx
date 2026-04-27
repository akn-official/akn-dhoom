// Placeholder image blocks — better than generating SVG humans
function Placeholder({ variant = 'stripes', label, center, style }) {
  const cls = variant === 'lime' ? 'ph ph-lime' : variant === 'contrast' ? 'ph ph-contrast' : 'ph ph-stripes';
  return (
    <div className={cls} style={style}>
      {label && <div className="ph-label">{label}</div>}
      {center && <div className="ph-center-label">{center}</div>}
    </div>
  );
}

window.Placeholder = Placeholder;
