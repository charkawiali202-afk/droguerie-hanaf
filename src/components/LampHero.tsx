"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLang } from "@/lib/i18n";
import { photo } from "@/lib/seed";
import PendantLamp from "./PendantLamp";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Cinematic intro for /luminaires: the lamp drops on its cord, swings, flickers on and lights the title.
 * A torch follows the finger/cursor in the dark, dust drifts in the beam (canvas), and the scene recedes on scroll.
 * Transforms/opacity only; the canvas runs only while visible and lit. Reduced motion: lit end state, no motion.
 */
export default function LampHero() {
  const { t } = useLang();
  const root = useRef<HTMLElement>(null);
  const torch = useRef<HTMLDivElement>(null);
  const dust = useRef<HTMLCanvasElement>(null);
  const lit = useRef(false);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();
    const on = () => { lit.current = true; };
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({ delay: 0.3 })
        .from(q(".lh-lamp"), { yPercent: -110, duration: 1.1, ease: "power3.out" })
        .fromTo(q(".lh-lamp"), { rotation: 9 }, { rotation: 0, duration: 2.4, ease: "elastic.out(1, 0.25)" }, "-=0.35")
        // flicker
        .to(q(".pl-filament"), { keyframes: { opacity: [0.25, 1, 0.3, 1, 0.15, 0.9, 1] }, duration: 0.7, ease: "none" }, "-=2.0")
        .to(q(".pl-glass"), { keyframes: { opacity: [0.12, 0.8, 0.2, 0.9, 0.1, 0.85, 0.9] }, duration: 0.7, ease: "none" }, "<")
        .to(q(".pl-glow"), { opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.15")
        .call(on, [], "<")
        .to(q(".pl-cone, .lh-dust"), { opacity: 1, duration: 0.9, ease: "power2.out" }, "<")
        .to(q(".lh-title-lit"), { opacity: 1, duration: 0.8, ease: "power2.out" }, "<0.1")
        .to(torch.current, { opacity: 0.55, duration: 1.2 }, "<")
        .from(q(".lh-fade"), { opacity: 0, y: 16, stagger: 0.08, duration: 0.6, ease: "power3.out" }, "<0.2");

      // Scene recedes as you scroll away.
      gsap.to(q(".lh-lamp"), { yPercent: -18, scale: 0.92, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(q(".lh-copy"), { y: -60, opacity: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "center center", end: "bottom top", scrub: true } });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(q(".pl-filament, .pl-glass, .pl-glow, .pl-cone, .lh-title-lit"), { opacity: 1 });
      gsap.set(torch.current, { opacity: 0 });
    });
  }, { scope: root });

  // Torch: an oversized vignette layer moved with transform (GPU only, no repaint) to follow the pointer/finger.
  useEffect(() => {
    const el = root.current!, tEl = torch.current!;
    let raf = 0, x = el.clientWidth / 2, y = el.clientHeight * 0.35;
    const apply = () => { raf = 0; tEl.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`; };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = e.clientX - r.left; y = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerdown", move, { passive: true });
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerdown", move); cancelAnimationFrame(raf); };
  }, []);

  // Dust in the beam: small canvas, ~40 motes, paused off-screen or when reduced motion.
  useEffect(() => {
    const c = dust.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = c.getContext("2d")!;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    let w = 0, h = 0, raf = 0, visible = true;
    const resize = () => { w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const motes = Array.from({ length: 42 }, () => ({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.6, vx: (Math.random() - 0.5) * 0.00025, vy: -0.0001 - Math.random() * 0.0003, a: 0.2 + Math.random() * 0.6 }));
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || !lit.current) return;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.x += m.vx; m.y += m.vy;
        if (m.y < 0) { m.y = 1; m.x = Math.random(); }
        // keep motes inside a cone that widens downward
        const spread = 0.12 + m.y * 0.38;
        if (Math.abs(m.x - 0.5) > spread) m.x = 0.5 + (Math.random() - 0.5) * spread * 2;
        ctx.globalAlpha = m.a * (0.4 + 0.6 * (1 - m.y));
        ctx.fillStyle = "#ffe2b8";
        ctx.beginPath(); ctx.arc(m.x * w, m.y * h, m.r, 0, Math.PI * 2); ctx.fill();
      }
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(c);
    addEventListener("resize", resize);
    tick();
    return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener("resize", resize); };
  }, []);

  return (
    <section ref={root} className="relative h-[100svh] min-h-[560px] touch-pan-y overflow-hidden bg-[#05070b] text-white select-none">
      {/* The dark shop, revealed by the torch */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo("photo-1760727466793-5415cfcd8994", 1400)} alt="" className="absolute inset-0 size-full object-cover opacity-50" />
      <div
        ref={torch}
        aria-hidden="true"
        className="absolute top-0 left-0 size-[400vmax] bg-[radial-gradient(circle,transparent_0,rgb(5_7_11/0.6)_60px,rgb(5_7_11/0.98)_150px)] will-change-transform"
      />
      <div className="absolute top-0 left-1/2 h-[72%] -translate-x-1/2">
        <div className="lh-lamp relative h-full origin-top will-change-transform">
          <PendantLamp id="hero-lamp" className="h-full w-auto" cord={170} />
          <canvas ref={dust} className="lh-dust absolute top-[42%] left-1/2 h-[58%] w-[110%] -translate-x-1/2 opacity-0" aria-hidden="true" />
        </div>
      </div>
      <div className="lh-copy absolute inset-x-0 bottom-0 px-4 pb-[calc(2.5rem+env(safe-area-inset-bottom))] text-center">
        <p className="lh-fade text-sm font-semibold text-amber-200/80">{t("lamps.kicker")}</p>
        <h1 className="relative mt-2 font-display text-6xl font-bold leading-none sm:text-8xl">
          <span className="text-white/10">{t("lamps.title")}</span>
          <span aria-hidden="true" className="lh-title-lit absolute inset-0 text-[#fff4e2] opacity-0 [text-shadow:0_0_24px_rgb(255_190_110/0.55),0_0_60px_rgb(255_160_80/0.3)]">
            {t("lamps.title")}
          </span>
        </h1>
        <p className="lh-fade mx-auto mt-4 max-w-md text-white/70">{t("lamps.sub")}</p>
        <p className="lh-fade mt-3 text-xs text-white/40">{t("lamps.hint")}</p>
      </div>
    </section>
  );
}
