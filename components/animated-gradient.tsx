'use client';

// Flame-curtain hero background. Pure CSS animations — no JS timers, no GSAP,
// GPU-friendly (transform + opacity only). Matches the se7en-style reference
// but uses AKN palette: teal #2A8B9D and copper #C87A4F on #0A0F1C.

type StreakProps = {
  side: 'left' | 'right';
  offset: number;   // % from edge
  width: number;    // vw
  color: string;
  blur: number;     // px
  delay: number;    // s
  duration: number; // s
  opacityMin: number;
  opacityMax: number;
  alt?: boolean;    // use alt keyframe
};

function Streak({ side, offset, width, color, blur, delay, duration, opacityMin, opacityMax, alt }: StreakProps) {
  return (
    <div
      className={alt ? 'flame-streak-alt' : 'flame-streak'}
      style={{
        position: 'absolute',
        bottom: 0,
        top: 0,
        [side]: `${offset}%`,
        width: `${width}vw`,
        maxWidth: '420px',
        background: `linear-gradient(to top, ${color} 0%, ${color}00 85%)`,
        filter: `blur(${blur}px)`,
        mixBlendMode: 'screen',
        // CSS custom props consumed by the keyframes
        ['--flame-delay' as string]: `${delay}s`,
        ['--flame-duration' as string]: `${duration}s`,
        ['--flame-opacity-min' as string]: opacityMin,
        ['--flame-opacity-max' as string]: opacityMax,
        transformOrigin: 'bottom center',
        pointerEvents: 'none',
      }}
    />
  );
}

export function AnimatedGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0A0F1C] z-0 pointer-events-none">
      {/* Left flame curtain — copper dominant */}
      <Streak side="left" offset={-4} width={28} color="#C87A4F" blur={70} delay={0} duration={9} opacityMin={0.35} opacityMax={0.75} />
      <Streak side="left" offset={3} width={20} color="#e08a5c" blur={55} delay={1.5} duration={11} opacityMin={0.25} opacityMax={0.6} alt />
      <Streak side="left" offset={9} width={14} color="#2A8B9D" blur={80} delay={0.8} duration={13} opacityMin={0.15} opacityMax={0.45} />
      <Streak side="left" offset={14} width={10} color="#C87A4F" blur={45} delay={2.3} duration={10} opacityMin={0.2} opacityMax={0.5} alt />

      {/* Right flame curtain — teal dominant */}
      <Streak side="right" offset={-4} width={28} color="#2A8B9D" blur={70} delay={0.5} duration={10} opacityMin={0.35} opacityMax={0.7} />
      <Streak side="right" offset={3} width={20} color="#3BA8BB" blur={55} delay={1.8} duration={12} opacityMin={0.25} opacityMax={0.55} alt />
      <Streak side="right" offset={9} width={14} color="#C87A4F" blur={80} delay={0.3} duration={13} opacityMin={0.15} opacityMax={0.45} />
      <Streak side="right" offset={14} width={10} color="#2A8B9D" blur={45} delay={2.6} duration={10} opacityMin={0.2} opacityMax={0.5} alt />

      {/* Center darkening vignette so text stays crisp */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,15,28,0.85)_75%,#0A0F1C_100%)]" />
      {/* Subtle bottom fade into page */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0A0F1C]" />
    </div>
  );
}
