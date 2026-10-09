import type { Metadata } from "next";
import CountUp from "@/components/CountUp";
import ScrollFX from "@/components/ScrollFX";
import T from "@/components/T";
import type { Key } from "@/lib/i18n";

// All content comes from the shop's "hanaf about.pdf". Nothing added beyond it.
export const metadata: Metadata = {
  title: "À propos",
  description: "Fondée en 1998 par Rachid Hanaf à Marrakech : l'histoire de la Droguerie Hanaf, une histoire de transmission, de persévérance, de confiance et de fidélité.",
  alternates: { canonical: "/a-propos" },
};

const STORY: Key[] = ["about.p1", "about.p2", "about.p3", "about.p4", "about.p5", "about.p6", "about.p7", "about.p8", "about.p9"];
const MILESTONES: [number, Key][] = [[1998, "about.p4"], [2013, "about.p6"], [2023, "about.p7"]];
const VALUES = [1, 2, 3] as const;

export default function About() {
  return (
    <ScrollFX>
      <section className="mx-auto max-w-6xl px-4 pt-12 sm:pt-20">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue"><T k="about.kicker" /></p>
        <h1 className="mt-2 font-display text-6xl font-bold leading-none sm:text-8xl">
          <span className="block overflow-hidden pb-[0.08em]"><span className="hero-line block"><T k="about.title" /></span></span>
        </h1>
        <p data-hero-fade className="mt-4 max-w-xl text-lg text-muted"><T k="about.lead" /></p>
      </section>

      {/* 1998 */}
      <section aria-label="1998" className="mt-12 overflow-hidden bg-blue text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-14 sm:flex-row sm:items-end sm:justify-between sm:py-20">
          <p className="text-lg font-semibold text-white/70"><T k="about.since" /></p>
          <CountUp to={1998} className="font-display text-[clamp(6rem,30vw,16rem)] font-bold leading-[0.8] tabular-nums tracking-tight" />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-24 md:grid-cols-[1fr_1.3fr] md:gap-16">
        <div className="md:sticky md:top-28 md:h-fit" data-reveal>
          <div className="grid aspect-[4/5] place-items-center rounded-3xl bg-blue-soft">
            <span className="font-display text-8xl font-bold text-blue/30" aria-hidden="true">RH</span>
          </div>
          <p className="mt-4 font-display text-2xl font-bold">Rachid Hanaf</p>
          <p className="text-muted"><T k="about.role" /></p>
        </div>
        <div>
          <h2 data-reveal className="font-display text-4xl font-bold leading-tight"><T k="about.founder" /></h2>
          <div className="mt-6 space-y-5 text-lg text-muted text-pretty">
            {STORY.map((k) => <p key={k} data-reveal><T k={k} /></p>)}
          </div>
          <blockquote data-reveal className="mt-10 font-display text-3xl font-bold leading-tight text-blue text-balance">
            <T k="about.quote" />
          </blockquote>
        </div>
      </section>

      <section aria-labelledby="milestones" className="bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 id="milestones" data-reveal className="font-display text-4xl font-bold"><T k="about.timeline" /></h2>
          <ol className="mt-8 grid gap-3 md:grid-cols-3">
            {MILESTONES.map(([y, k]) => (
              <li key={y} data-reveal className="rounded-2xl bg-white p-6 ring-1 ring-line">
                <p className="font-display text-5xl font-bold text-blue" dir="ltr">{y}</p>
                <p className="mt-3 text-muted"><T k={k} /></p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-label="Valeurs" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <ul className="grid gap-8 md:grid-cols-3">
          {VALUES.map((n) => (
            <li key={n} data-reveal className="border-t-2 border-blue pt-5">
              <h3 className="font-display text-3xl font-bold"><T k={`about.v${n}.t`} /></h3>
              <p className="mt-2 text-muted"><T k={`about.v${n}.d`} /></p>
            </li>
          ))}
        </ul>
      </section>
    </ScrollFX>
  );
}
