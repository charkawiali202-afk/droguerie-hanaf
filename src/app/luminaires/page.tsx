"use client";
import Link from "next/link";
import { useState } from "react";
import LampHero from "@/components/LampHero";
import LampToggle from "@/components/LampToggle";
import ScrollFX from "@/components/ScrollFX";
import { useLang } from "@/lib/i18n";
import { LAMPS } from "@/lib/seed";
import { addToCart, formatMAD, setDrawer, useStore } from "@/lib/store";

export default function Lamps() {
  const { t } = useLang();
  const { products } = useStore();
  const lamps = products.filter((p) => p.categoryId === LAMPS);
  const [on, setOn] = useState(false);

  return (
    <ScrollFX deps={[lamps.length]}>
    <div className={`relative -mb-24 bg-[#05070b] pb-24 text-white transition-colors duration-1000 ${on ? "bg-[#120d08]" : ""}`}>
      {/* Warm room light, fades in with the switch (opacity only). */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(255_190_110/0.22),transparent_70%)] transition-opacity duration-1000 ${on ? "opacity-100" : "opacity-0"}`}
      />
      <LampHero />
      <div className="relative mx-auto max-w-6xl px-4 pt-14">
        <div className="sticky top-[calc(4.5rem+env(safe-area-inset-top))] z-20 -mx-4 flex items-center justify-between gap-4 bg-[#05070b]/70 px-4 py-3 backdrop-blur-md">
          <h2 className="font-display text-2xl font-bold">{t("lamps.kicker")}</h2>
          <LampToggle on={on} onChange={setOn} label={t("lamps.switch")} onText={t("lamps.on")} offText={t("lamps.off")} />
        </div>

        {lamps.length ? (
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {lamps.map((p, i) => {
              const onSrc = p.imageOn || p.image;
              const offSrc = p.imageOff || onSrc;
              const fakeOff = !p.imageOff;
              const delay = { transitionDelay: on ? `${i * 120}ms` : "0ms" };
              return (
                <li key={p.id} data-card className="group relative">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={offSrc} alt="" loading="lazy" className={`absolute inset-0 size-full object-cover ${fakeOff ? "brightness-[0.32] saturate-[0.35]" : ""}`} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={onSrc} alt={p.name} loading="lazy" style={delay}
                      className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ease-out ${on ? "opacity-100" : "opacity-0"}`} />
                    <div aria-hidden="true" style={delay}
                      className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgb(255_200_120/0.35),transparent_60%)] mix-blend-screen transition-opacity duration-1000 ${on ? "opacity-100" : "opacity-0"}`} />
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="text-sm font-semibold leading-snug sm:text-base">
                        <Link href={`/produits/${p.id}`} className="after:absolute after:inset-0">{p.name}</Link>
                      </h2>
                      <p className="font-display text-lg font-bold tabular-nums text-white/90">{formatMAD(p.price)}</p>
                    </div>
                    <button
                      type="button"
                      disabled={p.stock <= 0}
                      onClick={() => { addToCart(p.id); setDrawer(true); }}
                      className="press relative z-10 grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink disabled:opacity-40"
                      aria-label={t("p.addAria", { name: p.name })}
                    >
                      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-12 text-white/60">{t("lamps.empty")}</p>
        )}
      </div>
    </div>
    </ScrollFX>
  );
}
