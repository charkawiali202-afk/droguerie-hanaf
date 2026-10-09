"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import ScrollFX from "@/components/ScrollFX";
import { catName, useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export default function Catalogue() {
  const { products, categories } = useStore();
  const { t } = useLang();
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
    <ScrollFX deps={[cat, needle]}>
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-6">
      <p className="text-sm font-semibold text-blue">{t("cat.kicker")}</p>
      <h1 className="mt-1 font-display text-5xl font-bold leading-none">{t("cat.title")}</h1>
      <label className="mt-6 block">
        <span className="sr-only">{t("cat.search")}</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("cat.searchPh")}
          className="w-full rounded-full border border-line bg-surface px-5 py-3.5 outline-none transition-colors focus:border-blue focus:bg-white"
        />
      </label>
      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2 no-scrollbar" role="group" aria-label={t("cat.filter")}>
        {[{ id: "", name: t("cat.all") }, ...categories].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            aria-pressed={cat === c.id}
            className="press shrink-0 rounded-full border border-line px-4 py-2.5 text-sm font-semibold aria-pressed:border-blue aria-pressed:bg-blue aria-pressed:text-white"
          >
            {c.id ? catName(t, c) : c.name}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted" aria-live="polite">
        {t("cat.count", { n: list.length })}
      </p>
      {list.length ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} p={p} category={(() => { const c = categories.find((c) => c.id === p.categoryId); return c && catName(t, c); })()} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-muted">
          {t("cat.empty")}
        </p>
      )}
    </div>
    </ScrollFX>
  );
}
