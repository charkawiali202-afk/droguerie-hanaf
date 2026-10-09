"use client";

/** Small brass pill toggle. Spring-like overshoot on the knob, press feedback, short haptic tick on phones. */
export default function LampToggle({ on, onChange, label, onText, offText }: {
  on: boolean; onChange: (v: boolean) => void; label: string; onText: string; offText: string;
}) {
  const flip = () => {
    try { navigator.vibrate?.(on ? 8 : [6, 30, 10]); } catch {}
    onChange(!on);
  };
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={flip}
        className={`group relative h-8 w-14 shrink-0 rounded-full p-1 shadow-[inset_0_1px_3px_rgb(0_0_0/0.6)] ring-1 transition-[background-color,box-shadow] duration-300 active:scale-95 ${
          on ? "bg-[#c9a46a] ring-[#e6c48d]/60 shadow-[inset_0_1px_3px_rgb(0_0_0/0.35),0_0_18px_rgb(255_190_110/0.45)]" : "bg-white/10 ring-white/15"
        }`}
        style={{ transitionProperty: "background-color, box-shadow, transform", transitionTimingFunction: "var(--ease-out)" }}
      >
        <span
          className={`block size-6 rounded-full bg-gradient-to-b from-white to-[#d9d4cc] shadow-[0_1px_2px_rgb(0_0_0/0.5)] transition-transform duration-[450ms] group-active:scale-90 ${
            on ? "translate-x-6 rtl:-translate-x-6" : "translate-x-0"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        />
      </button>
      <span className={`text-sm font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${on ? "text-amber-100" : "text-white/45"}`} aria-hidden="true">
        {on ? onText : offText}
      </span>
    </div>
  );
}
