// Vector recreation of the DQH shield from public/logo.webp, used for the intro and the footer.
// Each stroke has pathLength=1 so the intro can draw it with strokeDashoffset 1 -> 0.
export default function LogoMark({ className, shield = "var(--blue)", line = "#fff" }: { className?: string; shield?: string; line?: string }) {
  return (
    <svg viewBox="0 0 120 130" className={className} aria-hidden="true">
      <path className="lm-shield" d="M0 0H120V130C58 130 6 104 0 52Z" fill={shield} />
      <g fill="none" stroke={line} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
        <path className="lm-line" pathLength={1} d="M14 18H28A18 18 0 0 1 28 54H14Z" />
        <path className="lm-line" pathLength={1} d="M34 52a15 15 0 1 1 0 30a15 15 0 1 1 0-30M42 78C50 92 62 96 74 88" />
        <path className="lm-line" pathLength={1} d="M68 66V110M96 66V110M68 88H96" />
      </g>
      <g className="lm-nut" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <path d="M82 6L101 17V39L82 50L63 39V17Z" fill={line} />
        <circle cx="82" cy="28" r="8" fill={shield} />
      </g>
    </svg>
  );
}
