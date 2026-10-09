"use client";
import Link from "next/link";
import { formatMAD, type Product } from "@/lib/store";

export function ProductImage({ p, className = "" }: { p: Product; className?: string }) {
  if (p.image) {
    // eslint-disable-next-line @next/next/no-img-element -- arbitrary admin URLs / data URLs
    return <img src={p.image} alt={p.name} loading="lazy" className={`aspect-square w-full object-cover ${className}`} />;
  }
  return (
    <div aria-hidden className={`grid aspect-square w-full place-items-center bg-[repeating-linear-gradient(135deg,var(--line)_0_1px,transparent_1px_12px)] ${className}`}>
      <span className="font-display text-5xl font-extrabold text-ink/15">{p.name.slice(0, 2).toUpperCase()}</span>
    </div>
  );
}

export default function ProductCard({ p, category }: { p: Product; category?: string }) {
  return (
    <Link href={`/produits/${p.id}`} className="group flex flex-col overflow-hidden rounded-xl border border-line bg-card transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgb(0_0_0/0.25)] active:scale-[0.98]">
      <ProductImage p={p} />
      <div className="flex flex-1 flex-col gap-1 p-3">
        {category && <span className="text-[11px] font-medium uppercase tracking-wider text-muted">{category}</span>}
        <h3 className="text-sm font-semibold leading-snug">{p.name}</h3>
        <div className="mt-auto flex flex-wrap items-baseline justify-between gap-x-2 pt-2">
          <span className="font-display font-bold tabular-nums">{formatMAD(p.price)}</span>
          <span className={`whitespace-nowrap text-xs ${p.stock > 0 ? "text-emerald-700" : "text-red-700"}`}>{p.stock > 0 ? "En stock" : "Rupture"}</span>
        </div>
      </div>
    </Link>
  );
}
