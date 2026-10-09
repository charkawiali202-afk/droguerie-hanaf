"use client";
import Link from "next/link";
import { useState } from "react";
import { QtyControl, useCartLines } from "@/components/CartDrawer";
import { useLang } from "@/lib/i18n";
import { cart, formatMAD, orders, uid, useHydrated, type Order } from "@/lib/store";

const field = "w-full rounded-xl border border-line bg-white px-4 py-3 outline-none transition-colors focus:border-blue";
const PHONE = /^(?:\+212|00212|0)[5-7]\d{8}$/;

export default function Checkout() {
  const { items, total } = useCartLines();
  const hydrated = useHydrated();
  const [placed, setPlaced] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const { t } = useLang();

  if (placed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-blue text-white">
          <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5L19 7" /></svg>
        </div>
        <h1 className="mt-6 font-display text-4xl font-bold leading-tight">{t("co.thanks", { name: placed.customer.name.split(" ")[0] })}</h1>
        <p className="mt-3 text-muted">
          {t("co.done", { id: placed.id.toUpperCase(), phone: placed.customer.phone })}
        </p>
        <div className="mt-8 rounded-2xl bg-surface p-5 text-left">
          <ul className="space-y-2 text-sm">
            {placed.items.map((i) => (
              <li key={i.id} className="flex justify-between gap-4"><span>{i.qty} × {i.name}</span><span className="tabular-nums">{formatMAD(i.price * i.qty)}</span></li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-line pt-4 font-semibold">
            <span>{t("co.toPay")}</span><span className="tabular-nums">{formatMAD(placed.total)}</span>
          </div>
        </div>
        <Link href="/catalogue" className="press mt-8 inline-block rounded-full bg-blue px-6 py-3.5 font-semibold text-white">{t("co.continue")}</Link>
      </div>
    );
  }

  if (hydrated && !items.length) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl font-bold">{t("co.emptyTitle")}</h1>
        <Link href="/catalogue" className="press mt-6 inline-block rounded-full bg-blue px-6 py-3.5 font-semibold text-white">{t("cart.browse")}</Link>
      </div>
    );
  }

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const phone = get("phone").replace(/[\s.-]/g, "");
    if (!PHONE.test(phone)) return setError(t("co.badPhone"));
    const order: Order = {
      id: uid(),
      createdAt: new Date().toISOString(),
      status: "nouvelle",
      total,
      customer: { name: get("name"), phone, city: get("city"), address: get("address"), notes: get("notes") },
      items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
    };
    orders.set([order, ...orders.get()]);
    cart.set([]);
    setPlaced(order);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-5xl font-bold leading-none">{t("co.title")}</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        <form onSubmit={submit} className="space-y-4">
          <h2 className="font-display text-2xl font-bold">{t("co.delivery")}</h2>
          <label className="block space-y-1.5"><span className="text-sm font-semibold">{t("co.name")}</span>
            <input name="name" required autoComplete="name" className={field} />
          </label>
          <label className="block space-y-1.5"><span className="text-sm font-semibold">{t("co.phone")}</span>
            <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder="06 12 34 56 78" dir="ltr" className={field} onChange={() => setError("")} />
          </label>
          <label className="block space-y-1.5"><span className="text-sm font-semibold">{t("co.city")}</span>
            <input name="city" required autoComplete="address-level2" defaultValue="Marrakech" className={field} />
          </label>
          <label className="block space-y-1.5"><span className="text-sm font-semibold">{t("co.address")}</span>
            <textarea name="address" required rows={2} autoComplete="street-address" placeholder={t("co.addressPh")} className={field} />
          </label>
          <label className="block space-y-1.5"><span className="text-sm font-semibold">{t("co.notes")} <span className="font-normal text-muted">{t("co.optional")}</span></span>
            <textarea name="notes" rows={2} placeholder={t("co.notesPh")} className={field} />
          </label>

          <fieldset className="space-y-2 pt-2">
            <legend className="font-display text-2xl font-bold">{t("co.payment")}</legend>
            <label className="flex items-center gap-3 rounded-xl border-2 border-blue bg-blue-soft p-4">
              <input type="radio" name="payment" value="cod" defaultChecked className="size-5 accent-(--blue)" />
              <span>
                <span className="block font-semibold">{t("co.cod")}</span>
                <span className="text-sm text-muted">{t("co.codSub")}</span>
              </span>
            </label>
          </fieldset>

          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-800">{error}</p>}
          <button className="press w-full rounded-full bg-blue py-4 text-lg font-semibold text-white">
            {t("co.confirm", { total: formatMAD(total) })}
          </button>
          <p className="text-center text-xs text-muted">{t("co.fine")}</p>
        </form>

        <aside aria-labelledby="recap" className="h-fit rounded-2xl bg-surface p-5 lg:sticky lg:top-24">
          <h2 id="recap" className="font-display text-2xl font-bold">{t("co.recap")}</h2>
          <ul className="mt-4 divide-y divide-line">
            {items.map((i) => (
              <li key={i.id} className="flex gap-3 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.image} alt="" className="size-16 shrink-0 rounded-lg bg-white object-cover" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <span className="text-sm font-semibold leading-snug">{i.name}</span>
                  <div className="flex items-center justify-between">
                    <QtyControl id={i.id} qty={i.qty} max={i.stock} />
                    <span className="text-sm font-semibold tabular-nums">{formatMAD(i.price * i.qty)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex justify-between border-t border-line pt-4 font-display text-xl font-bold">
            <span>{t("cart.total")}</span><span className="tabular-nums">{formatMAD(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
