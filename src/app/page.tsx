import Link from "next/link";
import FeaturedGrid from "@/components/FeaturedGrid";
import ScrollFX from "@/components/ScrollFX";
import { ADDRESS, BUSINESS, MAPS_QUERY } from "@/lib/business";
import { HERO_IMAGE, photo, SEED } from "@/lib/seed";

const STEPS = [
  ["Choisissez", "Parcourez le catalogue et ajoutez vos articles au panier."],
  ["Commandez", "Laissez votre nom, votre téléphone et votre adresse. Nous vous rappelons pour confirmer."],
  ["Payez à la livraison", "Réglez en espèces à la réception. Aucune carte bancaire demandée."],
];

export default function Home() {
  const names = SEED.categories.map((c) => c.name);
  return (
    <ScrollFX>
      {/* Hero */}
      <section className="relative -mt-16 flex min-h-[100svh] items-end overflow-hidden bg-blue-deep pt-16 text-white">
        <div className="absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-hero-img src={photo(HERO_IMAGE, 1600)} alt="" fetchPriority="high" className="size-full object-cover will-change-transform" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_34_79/0.35)_0%,rgb(0_34_79/0.55)_45%,rgb(0_34_79/0.95)_100%)]" />
        </div>
        <div data-hero-copy className="relative mx-auto w-full max-w-6xl px-4 pb-[calc(3rem+env(safe-area-inset-bottom))] sm:pb-20">
          <p data-hero-fade className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-xs font-semibold tracking-wide ring-1 ring-white/25 backdrop-blur">
            Guéliz · Marrakech · depuis {BUSINESS.since}
          </p>
          <h1 className="font-display text-[clamp(3rem,13vw,7.5rem)] font-bold uppercase leading-[0.86] tracking-[-0.01em]">
            {["Peinture.", "Outillage.", "Plomberie."].map((w) => (
              <span key={w} className="block overflow-hidden pb-[0.04em]"><span className="hero-line block">{w}</span></span>
            ))}
          </h1>
          <p data-hero-fade className="mt-6 max-w-md text-lg text-white/85 text-pretty">
            Tout le nécessaire pour peindre, réparer et entretenir la maison. Commandez en ligne, payez à la livraison.
          </p>
          <div data-hero-fade className="mt-8 flex flex-wrap gap-3">
            <Link href="/catalogue" className="press rounded-full bg-white px-6 py-3.5 font-semibold text-blue">Voir le catalogue</Link>
            <Link href="#contact" className="press rounded-full px-6 py-3.5 font-semibold text-white ring-1 ring-white/40 hover:bg-white/10">Venir au magasin</Link>
          </div>
        </div>
      </section>

      {/* Category marquee */}
      <div className="overflow-hidden border-b border-line bg-white py-5" aria-hidden="true">
        <div data-marquee className="flex w-max gap-8 whitespace-nowrap font-display text-3xl font-bold uppercase text-blue will-change-transform sm:text-5xl">
          {[...names, ...names].map((n, i) => (
            <span key={i} className="flex items-center gap-8">{n}<span className="size-2.5 rotate-45 bg-blue/25" /></span>
          ))}
        </div>
      </div>

      {/* Departments */}
      <section aria-labelledby="rayons" className="py-16 sm:py-24">
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-4 px-4">
          <div data-reveal>
            <p className="text-sm font-semibold text-blue">Nos rayons</p>
            <h2 id="rayons" className="mt-1 font-display text-4xl font-bold leading-none sm:text-5xl">Un comptoir, sept métiers.</h2>
          </div>
        </div>
        <ul data-stagger className="no-scrollbar mx-auto mt-8 flex max-w-6xl snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2">
          {SEED.categories.map((c) => (
            <li key={c.id} className="w-[72vw] max-w-72 shrink-0 snap-start">
              <Link href={`/catalogue?cat=${c.id}`} className="press group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-blue-deep">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt="" loading="lazy" className="size-full object-cover opacity-80 transition-transform duration-700 ease-(--ease-out) group-hover:scale-105" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgb(0_34_79/0.9))]" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <h3 className="font-display text-2xl font-bold leading-tight">{c.name}</h3>
                  <p className="text-sm text-white/80">{c.blurb}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured */}
      <section aria-labelledby="selection" className="bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div data-reveal className="mb-8 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
            <h2 id="selection" className="font-display text-4xl font-bold leading-none sm:text-5xl">Les incontournables</h2>
            <Link href="/catalogue" className="shrink-0 text-sm font-semibold text-blue underline underline-offset-4">Tout le catalogue</Link>
          </div>
          <FeaturedGrid />
        </div>
      </section>

      {/* Cash on delivery */}
      <section aria-labelledby="cod" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <h2 id="cod" data-reveal className="max-w-xl font-display text-4xl font-bold leading-none sm:text-5xl">
          Commandez en ligne, <span className="text-blue">payez à la livraison.</span>
        </h2>
        <ol className="mt-10 grid gap-3 sm:grid-cols-3">
          {STEPS.map(([t, d], i) => (
            <li key={t} data-reveal className="rounded-2xl p-6 ring-1 ring-line">
              <span className="font-display text-5xl font-bold text-blue/20 tabular-nums">0{i + 1}</span>
              <h3 className="mt-3 font-display text-xl font-bold">{t}</h3>
              <p className="mt-1 text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* About */}
      <section aria-labelledby="apropos" className="bg-blue text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:py-24 md:grid-cols-2 md:items-end">
          <p data-reveal className="font-display text-[clamp(5rem,22vw,12rem)] font-bold leading-[0.8] text-white/15">{BUSINESS.since}</p>
          <div data-reveal>
            <h2 id="apropos" className="font-display text-3xl font-bold leading-tight sm:text-4xl">Une droguerie de quartier à Guéliz.</h2>
            <p className="mt-4 text-white/80 text-pretty">
              Depuis {BUSINESS.since}, la Droguerie Quincaillerie Hanaf sert les particuliers et les artisans de Marrakech, rue Tarik
              Bnou Ziad. Outils de peinture, plomberie, sanitaire, produits d&apos;entretien : on vous aide à trouver la bonne
              référence et la bonne quantité, sans détour.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" aria-labelledby="contact-h" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:py-24">
        <h2 id="contact-h" data-reveal className="font-display text-4xl font-bold leading-none sm:text-5xl">Passez nous voir.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div data-reveal className="space-y-6 rounded-2xl bg-surface p-6">
            <div>
              <h3 className="text-sm font-semibold text-blue">Adresse</h3>
              <address className="mt-1 text-lg font-semibold not-italic">{ADDRESS}</address>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue">Téléphone</h3>
              {BUSINESS.phone ? (
                <a href={`tel:${BUSINESS.phone}`} className="mt-1 block text-lg font-semibold">{BUSINESS.phone}</a>
              ) : (
                <p className="mt-1 text-lg font-semibold">Numéro à confirmer</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue">Horaires</h3>
              <ul className="mt-1">
                {BUSINESS.hours.map((h) => (
                  <li key={h.days} className="flex justify-between gap-4 border-b border-line py-2 last:border-0">
                    <span>{h.days}</span>
                    <span className="font-medium tabular-nums">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3">
              {BUSINESS.whatsapp && (
                <a href={`https://wa.me/${BUSINESS.whatsapp}`} className="press rounded-full bg-[#1f7a4d] px-5 py-3 font-semibold text-white">WhatsApp</a>
              )}
              <a href={`https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`} target="_blank" rel="noopener" className="press rounded-full bg-blue px-5 py-3 font-semibold text-white">
                Itinéraire
              </a>
            </div>
          </div>
          <iframe
            data-reveal
            title={`Carte : ${ADDRESS}`}
            loading="lazy"
            className="min-h-80 w-full rounded-2xl"
            src={`https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`}
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </ScrollFX>
  );
}
