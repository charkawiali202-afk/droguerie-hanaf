"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import LogoMark from "./LogoMark";

gsap.registerPlugin(useGSAP);
const KEY = "hanaf-intro";

export default function Splash() {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    const el = root.current!;
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === "1"; sessionStorage.setItem(KEY, "1"); } catch {}
    const done = () => { el.style.display = "none"; document.documentElement.dataset.intro = "seen"; };
    if (seen) return done();

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tl.current = gsap.timeline({ onComplete: done }).to(el, { opacity: 0, duration: 0.4, delay: 0.6 });
      return;
    }
    gsap.set(".lm-line", { strokeDasharray: 1, strokeDashoffset: 1 });
    tl.current = gsap
      .timeline({ defaults: { ease: "power3.out" }, onComplete: done })
      .from(".lm-shield", { scale: 0.92, opacity: 0, transformOrigin: "50% 50%", duration: 0.35 })
      .to(".lm-line", { strokeDashoffset: 0, duration: 0.6, stagger: 0.12, ease: "power2.inOut" }, "-=0.05")
      .from(".lm-nut", { rotation: -180, scale: 0.4, opacity: 0, duration: 0.6, ease: "back.out(1.6)" }, "-=0.55")
      .from(".sp-word", { yPercent: 110, duration: 0.45, stagger: 0.07 }, "-=0.3")
      .to(el, { yPercent: -100, duration: 0.55, ease: "power4.inOut" }, "+=0.25");
  }, { scope: root });

  const skip = () => tl.current?.progress(1);

  return (
    <div
      ref={root}
      className="splash fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-white will-change-transform"
      onClick={skip}
    >
      <div className="flex items-center gap-4">
        <LogoMark className="h-24 w-auto sm:h-28" />
        <div className="font-display font-bold uppercase leading-[0.95] text-blue" aria-label="Droguerie Quincaillerie Hanaf">
          {["Droguerie", "Quincaillerie"].map((w) => (
            <span key={w} className="block overflow-hidden text-sm tracking-[0.18em] sm:text-base">
              <span className="sp-word block">{w}</span>
            </span>
          ))}
          <span className="block overflow-hidden text-4xl tracking-[0.06em] sm:text-5xl">
            <span className="sp-word block">Hanaf</span>
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={skip}
        className="press absolute right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] rounded-full px-4 py-2 text-sm font-medium text-muted"
      >
        Passer
      </button>
    </div>
  );
}
