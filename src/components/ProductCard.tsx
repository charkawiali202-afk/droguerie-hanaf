"use client";
import Link from "next/link";
import { addToCart, formatMAD, setDrawer, type Product } from "@/lib/store";

export function ProductImage({ p, className = "", eager = false }: { p: Product; className?: string; eager?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- admin can set any URL or data URL
    <img
      src={p.image || "/logo.webp"}
      alt={p.name}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`aspect-square w-full bg-surface ${p.image ? "object-cover" : "object-contain p-8"} ${className}`}
    />
  );
}

export default function ProductCard({ p, category }: { p: Product; category?: string }) {
  return (
    <article data-card className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-line">
      <div className="overflow-hidden">
        <ProductImage p={p} className="transition-transform duration-500 ease-(--ease-out) group-hover:scale-[1.04]" />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        {category && <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue">{category}</span>}
        <h3 className="text-sm font-semibold leading-snug text-pretty sm:text-[15px]">
          <Link href={`/produits/${p.id}`} className="after:absolute after:inset-0">{p.name}</Link>
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            <span className="block font-display text-lg font-bold leading-none tabular-nums">{formatMAD(p.price)}</span>
            <span className={`text-xs ${p.stock > 0 ? "text-muted" : "text-red-700"}`}>{p.stock > 0 ? "En stock" : "Rupture"}</span>
          </div>
          <button
            type="button"
            disabled={p.stock <= 0}
            onClick={() => { addToCart(p.id); setDrawer(true); }}
            className="press relative z-10 grid size-10 shrink-0 place-items-center rounded-full bg-blue text-white disabled:bg-line disabled:text-muted"
            aria-label={`Ajouter ${p.name} au panier`}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
          </button>
        </div>
      </div>
    </article>
  );
}
