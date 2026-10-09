"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Scroll motion for everything inside. Opt-in via data attributes:
 * data-hero-img (parallax), data-hero-copy (drifts/fades as you scroll away), .hero-line (intro text reveal),
 * data-reveal (fade up), data-card (staggered batches), data-marquee (moves with scroll), data-stagger (children slide in).
 * Transforms and opacity only. Nothing runs under prefers-reduced-motion.
 */
export default function ScrollFX({ children, deps = [] }: { children: React.ReactNode; deps?: unknown[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const introDelay = document.documentElement.dataset.intro === "seen" ? 0.1 : 2.1;

        if (q(".hero-line").length) {
          gsap.from(q(".hero-line"), { yPercent: 110, duration: 0.9, stagger: 0.08, ease: "power4.out", delay: introDelay });
          gsap.from(q("[data-hero-fade]"), { opacity: 0, y: 20, duration: 0.7, stagger: 0.08, ease: "power3.out", delay: introDelay + 0.35 });
        }
        q("[data-hero-img]").forEach((img) =>
          gsap.fromTo(img, { yPercent: -6, scale: 1.12 }, {
            yPercent: 10, scale: 1.12, ease: "none",
            scrollTrigger: { trigger: img.parentElement, start: "top top", end: "bottom top", scrub: true },
          }),
        );
        q("[data-hero-copy]").forEach((el) =>
          gsap.to(el, { y: -60, opacity: 0.15, ease: "none", scrollTrigger: { trigger: el, start: "top 20%", end: "bottom top", scrub: true } }),
        );
        q("[data-marquee]").forEach((el) =>
          gsap.fromTo(el, { xPercent: 0 }, { xPercent: -35, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.5 } }),
        );
        q("[data-stagger]").forEach((el) =>
          gsap.from(el.children, { x: 60, opacity: 0, duration: 0.7, stagger: 0.07, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } }),
        );
        q("[data-reveal]").forEach((el) =>
          gsap.from(el, { y: 40, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } }),
        );
        const cards = q("[data-card]");
        if (cards.length) {
          gsap.set(cards, { opacity: 0, y: 36 });
          ScrollTrigger.batch(cards, {
            start: "top 92%",
            once: true,
            onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power3.out", overwrite: true }),
          });
        }
      });
    },
    { scope: root, dependencies: deps, revertOnUpdate: true },
  );

  return <div ref={root}>{children}</div>;
}
