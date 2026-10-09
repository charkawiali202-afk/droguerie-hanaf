"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Counts from 0 to `to` when scrolled into view. Server HTML and reduced motion show the final number. */
export default function CountUp({ to, className }: { to: number; className?: string }) {
  const el = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const node = el.current!;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const state = { v: 0 };
      node.textContent = "0";
      gsap.to(state, {
        v: to,
        duration: 2.2,
        ease: "power3.out",
        scrollTrigger: { trigger: node, start: "top 85%", once: true },
        onUpdate: () => { node.textContent = String(Math.round(state.v)); },
      });
      return () => { node.textContent = String(to); };
    });
  }, { scope: el });
  return <span ref={el} className={`inline-block min-w-[4ch] text-end ${className ?? ""}`} dir="ltr" aria-label={String(to)}>{to}</span>;
}
