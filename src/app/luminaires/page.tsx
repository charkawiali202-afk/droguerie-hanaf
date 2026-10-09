"use client";
import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { LAMPS } from "@/lib/seed";
import { addToCart, formatMAD, setDrawer, useStore } from "@/lib/store";

export default function Lamps() {
  const { t } = useLang();
  const { products } = useStore();
  const lamps = products.filter((p) => p.categoryId === LAMPS);
  const [on, setOn] = useState(false);

  return (
    <div className={`relative -mb-24 overflow-hidden bg-[#06080d] pb-24 text-white transition-colors duration-1000 ${on ? "bg-[#120d08]" : ""}`}>
      {/* Warm room light, fades in with the switch (opacity only). */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(255_190_110/0.22),transparent_70%)] transition-opacity duration-1000 ${on ? "opacity-100" : "opacity-0"}`}
      />
      <div className="relative mx-auto max-w-6xl px-4 pt-12 sm:pt-20">
        <p className="text-sm font-semibold text-amber-200/80">{t("lamps.kicker")}</p>
        <h1 className="mt-1 font-display text-5xl font-bold leading-none sm:text-7xl">{t("lamps.title")}</h1>
        <p className="mt-4 max-w-md text-white/70">{t("lamps.sub")}</p>

        {/* The switch */}
        <div className="mt-10 flex items-center gap-5">
          <button
            type="button"
            role="switch"
            aria-checked={on}
            aria-label={t("lamps.switch")}
            onClick={() => setOn(!on)}
            className={`relative h-28 w-16 shrink-0 rounded-2xl p-1.5 shadow-[inset_0_2px_6px_rgb(0_0_0/0.6)] ring-1 transition-colors duration-300 ${on ? "bg-amber-100/15 ring-amber-200/40" : "bg-white/5 ring-white/15"}`}
          >
            <span
              className={`block h-1/2 w-full rounded-xl shadow-lg transition-transform duration-300 ease-(--ease-out) ${on ? "translate-y-0 bg-amber-100 shadow-amber-300/40" : "translate-y-full bg-white/80"}`}
            />
          </button>
          <span className={`font-display text-3xl font-bold uppercase transition-colors duration-500 ${on ? "text-amber-100" : "text-white/40"}`} aria-hidden="true">
            {on ? t("lamps.on") : t("lamps.off")}
          </span>
        </div>

        {lamps.length ? (
          <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {lamps.map((p, i) => {
              const onSrc = p.imageOn || p.image;
              const offSrc = p.imageOff || onSrc;
              const fakeOff = !p.imageOff;
              const delay = { transitionDelay: on ? `${i * 120}ms` : "0ms" };
              return (
                <li key={p.id} className="group relative">
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
  );
}
