"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/lib/store";

export default function Catalogue() {
  const { products, categories } = useStore();
  const params = useSearchParams();
  const router = useRouter();
  const cat = params.get("cat") ?? "";
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const list = products.filter(
    (p) => (!cat || p.categoryId === cat) && (!needle || `${p.name} ${p.description}`.toLowerCase().includes(needle)),
  );
  const setCat = (id: string) => router.replace(id ? `/catalogue?cat=${id}` : "/catalogue", { scroll: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold">Catalogue</h1>
      <label className="mt-6 block">
        <span className="sr-only">Rechercher un produit</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher : rouleau, mitigeur, vis…"
          className="w-full rounded-lg border border-line bg-card px-4 py-3 text-base outline-none focus:border-ink"
        />
      </label>
      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]" role="group" aria-label="Filtrer par rayon">
        {[{ id: "", name: "Tout" }, ...categories].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            aria-pressed={cat === c.id}
            className="shrink-0 rounded-full border border-line px-4 py-2 text-sm font-medium transition-colors aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper"
          >
            {c.name}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted" aria-live="polite">
        {list.length} produit{list.length > 1 ? "s" : ""}
      </p>
      {list.length ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} p={p} category={categories.find((c) => c.id === p.categoryId)?.name} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-muted">
          Aucun produit trouvé. Essayez un autre mot ou passez au magasin : on l&apos;a peut-être en réserve.
        </p>
      )}
    </div>
  );
}
