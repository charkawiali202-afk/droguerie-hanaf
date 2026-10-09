"use client";
import Link from "next/link";
import { useState } from "react";
import ProductCard, { ProductImage } from "@/components/ProductCard";
import ScrollFX from "@/components/ScrollFX";
import { BUSINESS } from "@/lib/business";
import { addToCart, formatMAD, setDrawer, useStore } from "@/lib/store";

export default function ProductView({ id }: { id: string }) {
  const { products, categories, ready } = useStore();
  const [qty, setQty] = useState(1);
  const p = products.find((x) => x.id === id);
  if (!p) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center">
        {ready && (
          <>
            <p className="font-display text-3xl font-bold">Produit introuvable</p>
            <Link href="/catalogue" className="mt-4 inline-block font-semibold text-blue underline underline-offset-4">Retour au catalogue</Link>
          </>
        )}
      </div>
    );
  }
  const cat = categories.find((c) => c.id === p.categoryId);
  const related = products.filter((x) => x.categoryId === p.categoryId && x.id !== p.id).slice(0, 4);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: p.image || undefined,
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "MAD",
      availability: `https://schema.org/${p.stock > 0 ? "InStock" : "OutOfStock"}`,
    },
  };

  return (
    <ScrollFX deps={[id]}>
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-10">
        <title>{`${p.name} · ${BUSINESS.name}`}</title>
        <nav aria-label="Fil d'Ariane" className="mb-6 text-sm text-muted">
          <Link href="/catalogue" className="hover:text-blue">Catalogue</Link>
          {cat && (
            <>
              <span aria-hidden="true"> / </span>
              <Link href={`/catalogue?cat=${cat.id}`} className="hover:text-blue">{cat.name}</Link>
            </>
          )}
        </nav>
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div data-reveal className="overflow-hidden rounded-3xl">
            <ProductImage p={p} eager />
          </div>
          <div data-reveal className="md:pt-6">
            {cat && <p className="text-sm font-semibold uppercase tracking-[0.12em] text-blue">{cat.name}</p>}
            <h1 className="mt-2 font-display text-4xl font-bold leading-[1.02] text-balance">{p.name}</h1>
            <p className="mt-4 font-display text-3xl font-bold tabular-nums">{formatMAD(p.price)}</p>
            <p className={`mt-1 text-sm font-medium ${p.stock > 0 ? "text-emerald-700" : "text-red-700"}`}>
              {p.stock > 0 ? `En stock · ${p.stock} disponibles` : "Rupture de stock"}
            </p>
            <p className="mt-6 text-pretty text-muted">{p.description}</p>

            {p.stock > 0 && (
              <div className="mt-8 flex items-center gap-3">
                <div className="flex items-center rounded-full border border-line">
                  <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="press grid size-12 place-items-center rounded-full text-xl" aria-label="Diminuer la quantité">−</button>
                  <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite">{qty}</span>
                  <button type="button" onClick={() => setQty(Math.min(p.stock, qty + 1))} className="press grid size-12 place-items-center rounded-full text-xl" aria-label="Augmenter la quantité">+</button>
                </div>
                <button
                  type="button"
                  onClick={() => { addToCart(p.id, qty); setQty(1); setDrawer(true); }}
                  className="press flex-1 rounded-full bg-blue py-3.5 font-semibold text-white"
                >
                  Ajouter au panier
                </button>
              </div>
            )}
            <ul className="mt-6 space-y-2 border-t border-line pt-6 text-sm text-muted">
              <li>Paiement en espèces à la livraison</li>
              <li>Commande confirmée par téléphone avant l&apos;envoi</li>
              <li>Retrait possible au magasin, {BUSINESS.street}</li>
            </ul>
          </div>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related" className="mt-20">
            <h2 id="related" data-reveal className="mb-6 font-display text-3xl font-bold">Dans le même rayon</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {related.map((r) => <ProductCard key={r.id} p={r} category={cat?.name} />)}
            </div>
          </section>
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      </div>
    </ScrollFX>
  );
}
