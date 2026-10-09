"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";
import { cart, formatMAD, setDrawer, setQty, useDrawer, useStore } from "@/lib/store";

export function useCartLines() {
  const lines = cart.use();
  const { products } = useStore();
  const items = lines.flatMap((l) => {
    const p = products.find((x) => x.id === l.id);
    return p ? [{ ...p, qty: l.qty }] : [];
  });
  return { items, total: items.reduce((s, i) => s + i.price * i.qty, 0) };
}

export function QtyControl({ id, qty, max }: { id: string; qty: number; max?: number }) {
  const { t } = useLang();
  return (
    <div className="flex items-center rounded-full border border-line">
      <button type="button" onClick={() => setQty(id, qty - 1)} className="press grid size-9 place-items-center rounded-full text-lg" aria-label={t("p.less")}>−</button>
      <span className="w-7 text-center text-sm font-semibold tabular-nums" aria-live="polite">{qty}</span>
      <button type="button" onClick={() => setQty(id, max ? Math.min(max, qty + 1) : qty + 1)} className="press grid size-9 place-items-center rounded-full text-lg" aria-label={t("p.more")}>+</button>
    </div>
  );
}

export default function CartDrawer() {
  const open = useDrawer();
  const { t } = useLang();
  const { items, total } = useCartLines();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open} inert={!open}>
      <div
        onClick={() => setDrawer(false)}
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        tabIndex={-1}
        className={`absolute end-0 top-0 flex h-dvh w-full max-w-md flex-col bg-white shadow-2xl outline-none transition-transform duration-[400ms] ease-(--ease-drawer) ${open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 pt-[calc(1rem+env(safe-area-inset-top))] pb-4">
          <h2 id="cart-title" className="font-display text-xl font-bold">{t("cart.title")}</h2>
          <button type="button" onClick={() => setDrawer(false)} className="press grid size-10 place-items-center rounded-full hover:bg-surface" aria-label={t("cart.close")}>
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        {items.length ? (
          <ul className="flex-1 divide-y divide-line overflow-y-auto overscroll-contain px-5">
            {items.map((i) => (
              <li key={i.id} className="flex gap-3 py-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.image} alt="" className="size-20 shrink-0 rounded-xl bg-surface object-cover" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link href={`/produits/${i.id}`} onClick={() => setDrawer(false)} className="text-sm font-semibold leading-snug">{i.name}</Link>
                  <span className="text-sm text-muted tabular-nums">{formatMAD(i.price)}</span>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <QtyControl id={i.id} qty={i.qty} max={i.stock} />
                    <button type="button" onClick={() => setQty(i.id, 0)} className="text-xs font-medium text-muted underline underline-offset-4">{t("cart.remove")}</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="text-muted">{t("cart.empty")}</p>
            <Link href="/catalogue" onClick={() => setDrawer(false)} className="press rounded-full bg-blue px-5 py-3 font-semibold text-white">{t("cart.browse")}</Link>
          </div>
        )}

        {items.length > 0 && (
          <div className="border-t border-line px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="flex items-baseline justify-between">
              <span className="text-muted">{t("cart.total")}</span>
              <span className="font-display text-2xl font-bold tabular-nums">{formatMAD(total)}</span>
            </div>
            <p className="mt-1 text-xs text-muted">{t("cart.note")}</p>
            <Link href="/commande" onClick={() => setDrawer(false)} className="press mt-4 block rounded-full bg-blue py-3.5 text-center font-semibold text-white">
              {t("cart.order")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
