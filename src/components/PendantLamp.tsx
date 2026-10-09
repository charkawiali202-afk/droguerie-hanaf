// Hand-drawn pendant lamp with an Edison bulb. Parts carry classes so GSAP can animate them:
// .pl-cone (light beam), .pl-glow (halo), .pl-glass (bulb glass), .pl-filament (filament).
// Everything starts "off"; animations raise the opacities.
export default function PendantLamp({ className, cord = 150, id = "pl" }: { className?: string; cord?: number; id?: string }) {
  const y = cord; // top of the shade
  return (
    <svg viewBox={`-120 0 440 ${y + 330}`} className={className} aria-hidden="true" overflow="visible">
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#ffb85c" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ff9a3c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-cone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd7a0" stopOpacity="0.55" />
          <stop offset="0.6" stopColor="#ffc27a" stopOpacity="0.12" />
          <stop offset="1" stopColor="#ffb860" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0a1426" />
          <stop offset="0.45" stopColor="#1d3560" />
          <stop offset="1" stopColor="#081120" />
        </linearGradient>
      </defs>
      {/* beam: drawn first so the shade sits on top */}
      <polygon className="pl-cone" points={`42,${y + 62} 158,${y + 62} 300,${y + 330} -100,${y + 330}`} fill={`url(#${id}-cone)`} opacity="0" />
      <circle className="pl-glow" cx="100" cy={y + 76} r="120" fill={`url(#${id}-glow)`} opacity="0" />
      <line x1="100" y1="0" x2="100" y2={y - 8} stroke="#2a3446" strokeWidth="2.5" />
      <rect x="91" y={y - 10} width="18" height="16" rx="3" fill="#2a3446" />
      <path d={`M38 ${y + 62}Q38 ${y + 4} 100 ${y + 2}Q162 ${y + 4} 162 ${y + 62}Z`} fill={`url(#${id}-shade)`} />
      <path d={`M38 ${y + 62}H162`} stroke="#c9a46a" strokeWidth="2.5" strokeLinecap="round" />
      <circle className="pl-glass" cx="100" cy={y + 76} r="17" fill="#fff6e6" opacity="0.12" />
      <path
        className="pl-filament"
        d={`M93 ${y + 82}V${y + 74}q2.3-4 4.6 0t4.6 0V${y + 82}`}
        fill="none"
        stroke="#ffb347"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.25"
      />
    </svg>
  );
}
