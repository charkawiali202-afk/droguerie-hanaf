"use client";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLang } from "@/lib/i18n";
import PendantLamp from "./PendantLamp";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Home "Luminaires" section: pinned while you scroll, the lamp warms up from off to fully on and reverses on the way back. */
export default function HomeLamp() {
  const { t } = useLang();
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=140%", scrub: 0.6, pin: true, anticipatePin: 1 },
      })
        .to(q(".pl-filament"), { opacity: 1, duration: 0.25 })
        .to(q(".pl-glass"), { opacity: 0.9, duration: 0.25 }, "<0.1")
        .to(q(".pl-glow"), { opacity: 1, duration: 0.35 }, "<0.1")
        .to(q(".pl-cone"), { opacity: 1, duration: 0.35 }, "<0.05")
        .to(q(".hl-warm"), { opacity: 1, duration: 0.5 }, "<")
        .from(q(".hl-text"), { opacity: 0, y: 40, stagger: 0.08, duration: 0.3 }, "-=0.35");
    });
    // Reduced motion: show the lit end state, no pin.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(q(".pl-filament, .pl-glass, .pl-glow, .pl-cone, .hl-warm"), { opacity: 1 });
    });
  }, { scope: root });

  return (
    <section ref={root} aria-labelledby="lamps-teaser" className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#05070b] text-white">
      <div aria-hidden="true" className="hl-warm absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_35%,rgb(255_176_92/0.28),transparent_70%)] opacity-0" />
      <div className="pointer-events-none absolute top-0 left-1/2 h-[70svh] -translate-x-1/2"><PendantLamp id="home-lamp" className="h-full w-auto" cord={180} /></div>
      <div className="relative mx-auto mt-[38svh] w-full max-w-6xl px-4 text-center">
        <p className="hl-text text-sm font-semibold text-amber-200/90">{t("home.lamps.kicker")}</p>
        <h2 id="lamps-teaser" className="hl-text mx-auto mt-2 max-w-xl font-display text-5xl font-bold leading-none sm:text-7xl">{t("home.lamps.title")}</h2>
        <div className="hl-text mt-8">
          <Link href="/luminaires" className="press inline-block rounded-full bg-white px-6 py-3.5 font-semibold text-ink">{t("home.lamps.cta")}</Link>
        </div>
      </div>
    </section>
  );
}
