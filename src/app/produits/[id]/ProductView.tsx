"use client";
import Link from "next/link";
import { ProductImage } from "@/components/ProductCard";
import { BUSINESS } from "@/lib/business";
import { formatMAD, useStore } from "@/lib/store";

export default function ProductView({ id }: { id: string }) {
  const { products, categories, ready } = useStore();
  const p = products.find((x) => x.id === id);
  if (!p) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        {ready && (
          <>
            Produit introuvable. <Link href="/catalogue" className="underline">Retour au catalogue</Link>
          </>
        )}
      </div>
    );
  }
  const cat = categories.find((c) => c.id === p.categoryId);
  const msg = encodeURIComponent(`Bonjour, est-ce que "${p.name}" est disponible ?`);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "MAD",
      availability: `https://schema.org/${p.stock > 0 ? "InStock" : "OutOfStock"}`,
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <title>{`${p.name} · ${BUSINESS.name}`}</title>
      <nav aria-label="Fil d'Ariane" className="mb-6 text-sm text-muted">
        <Link href="/catalogue" className="hover:text-ink">Catalogue</Link>
        {cat && (
          <>
            {" / "}
            <Link href={`/catalogue?cat=${cat.id}`} className="hover:text-ink">{cat.name}</Link>
          </>
        )}
      </nav>
      <div className="grid gap-8 md:grid-cols-2">
        <ProductImage p={p} className="rounded-xl border border-line" />
        <div>
          <h1 className="font-display text-3xl font-extrabold leading-tight text-balance">{p.name}</h1>
          <p className="mt-3 font-display text-2xl font-bold tabular-nums">{formatMAD(p.price)}</p>
          <p className={`mt-1 text-sm ${p.stock > 0 ? "text-emerald-700" : "text-red-700"}`}>
            {p.stock > 0 ? `En stock (${p.stock})` : "Rupture de stock"}
          </p>
          <p className="mt-6 text-pretty text-muted">{p.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {BUSINESS.whatsapp ? (
              <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${msg}`} className="rounded-lg bg-[#1f7a4d] px-5 py-3 font-semibold text-white">
                Demander sur WhatsApp
              </a>
            ) : (
              <Link href="/#contact" className="rounded-lg bg-ink px-5 py-3 font-semibold text-paper">Nous contacter</Link>
            )}
          </div>
          <p className="mt-4 text-xs text-muted">Prix indicatifs, vente au magasin.</p>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
    </div>
  );
}
