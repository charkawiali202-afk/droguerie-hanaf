import Link from "next/link";
import Featured from "@/components/Featured";
import Reveal from "@/components/Reveal";
import { ADDRESS, BUSINESS, MAPS_QUERY } from "@/lib/business";
import { SEED } from "@/lib/seed";

export default function Home() {
  const stats = [
    [`${BUSINESS.since}`, "au service de Guéliz depuis"],
    [`${SEED.categories.length}`, "rayons"],
    ["MAD", "prix affichés"],
    ["Comptoir", "conseil sur place"],
  ];
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 pt-12 pb-16 md:grid-cols-[1.4fr_1fr] md:pt-20">
        <Reveal>
          <p className="mb-4 text-sm font-medium text-muted">Guéliz, Marrakech · depuis {BUSINESS.since}</p>
          <h1 className="font-display text-[clamp(2.4rem,7vw,4.5rem)] font-extrabold leading-[0.95] tracking-tight text-balance">
            Tout pour peindre, réparer et construire<span className="text-accent">.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted text-pretty">
            Peinture, outillage, plomberie, sanitaire et produits d&apos;entretien. Le bon conseil et la bonne pièce, au comptoir.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/catalogue" className="rounded-lg bg-ink px-5 py-3 font-semibold text-paper transition-transform duration-150 active:scale-[0.97]">
              Voir le catalogue
            </Link>
            <Link href="#contact" className="rounded-lg border border-ink/20 px-5 py-3 font-semibold transition-colors hover:bg-line/50">
              Nous trouver
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="self-end">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
            {stats.map(([k, v]) => (
              <div key={v} className="bg-card p-5">
                <dt className="font-display text-2xl font-extrabold">{k}</dt>
                <dd className="text-sm text-muted">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section aria-labelledby="rayons" className="border-y border-line bg-card">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 id="rayons" className="font-display text-2xl font-extrabold">Nos rayons</h2>
          <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SEED.categories.map((c, i) => (
              <li key={c.id}>
                <Link href={`/catalogue?cat=${c.id}`} className="flex h-full items-baseline gap-3 rounded-lg border border-line px-4 py-4 font-semibold transition-colors hover:border-ink">
                  <span className="font-display text-xs text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="selection" className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 id="selection" className="font-display text-2xl font-extrabold">Sélection du moment</h2>
          <Link href="/catalogue" className="text-sm font-semibold underline underline-offset-4">Tout voir</Link>
        </div>
        <Featured />
      </section>

      <section aria-labelledby="apropos" className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-2">
        <h2 id="apropos" className="font-display text-3xl font-extrabold leading-tight">
          Une droguerie de quartier, depuis {BUSINESS.since}.
        </h2>
        <p className="text-muted text-pretty">
          Située rue Tarik Bnou Ziad à Guéliz, la Droguerie Quincaillerie Hanaf accompagne particuliers et artisans avec des
          outils de peinture, des fournitures de plomberie et de sanitaire, et des produits d&apos;entretien. Passez au
          magasin : on vous aide à trouver la bonne référence.
        </p>
      </section>

      <section id="contact" aria-labelledby="contact-h" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <h2 id="contact-h" className="font-display text-2xl font-extrabold">Contact & horaires</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-6 rounded-xl border border-line bg-card p-6">
            <div>
              <h3 className="text-sm font-medium text-muted">Adresse</h3>
              <address className="font-semibold not-italic">{ADDRESS}</address>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted">Téléphone</h3>
              {BUSINESS.phone ? (
                <a href={`tel:${BUSINESS.phone}`} className="font-semibold">{BUSINESS.phone}</a>
              ) : (
                <p className="font-semibold">Numéro à confirmer</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted">Horaires <span className="text-xs">(à confirmer)</span></h3>
              <ul>
                {BUSINESS.hours.map((h) => (
                  <li key={h.days} className="flex justify-between gap-4 border-b border-line py-1.5 last:border-0">
                    <span>{h.days}</span>
                    <span className="tabular-nums">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3">
              {BUSINESS.whatsapp && (
                <a href={`https://wa.me/${BUSINESS.whatsapp}`} className="rounded-lg bg-[#1f7a4d] px-4 py-2.5 font-semibold text-white">WhatsApp</a>
              )}
              <a href={`https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`} target="_blank" rel="noopener" className="rounded-lg border border-ink/20 px-4 py-2.5 font-semibold">
                Itinéraire
              </a>
            </div>
          </div>
          <iframe
            title={`Carte : ${ADDRESS}`}
            loading="lazy"
            className="min-h-80 w-full rounded-xl border border-line"
            src={`https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`}
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
