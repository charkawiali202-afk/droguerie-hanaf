"use client";
import { useId, useState } from "react";
import { useLang } from "@/lib/i18n";
import { reviews, uid } from "@/lib/store";

const Star = ({ on, size }: { on: boolean; size: string }) => (
  <svg viewBox="0 0 20 20" className={size} fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.7L10 14.8l-5.1 2.7 1-5.7-4.1-4 5.7-.8z" strokeLinejoin="round" />
  </svg>
);
const Stars = ({ value, size = "size-4" }: { value: number; size?: string }) => (
  <span className="flex text-blue" dir="ltr">{[1, 2, 3, 4, 5].map((n) => <Star key={n} on={n <= value} size={size} />)}</span>
);

/** Customer reviews. Only approved reviews show; new ones wait for approval in /admin (Avis). */
export default function Reviews({ productId }: { productId: string | null }) {
  const { t, lang } = useLang();
  const all = reviews.use();
  const shown = all.filter((r) => r.status === "approved" && r.productId === productId);
  const avg = shown.length ? shown.reduce((s, r) => s + r.rating, 0) / shown.length : 0;
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const gid = useId();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!rating) return setErr(t("rev.pickRating"));
    const f = new FormData(e.currentTarget);
    reviews.set([
      ...reviews.get(),
      {
        id: uid(), productId, rating, status: "pending", createdAt: new Date().toISOString(),
        name: String(f.get("name")).trim().slice(0, 60), comment: String(f.get("comment")).trim().slice(0, 1000),
      },
    ]);
    setSent(true); setOpen(false); setRating(0); setErr("");
  };

  return (
    <div data-reveal>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="reviews" className="font-display text-3xl font-bold sm:text-4xl">{t("rev.title")}</h2>
          {shown.length > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted">
              <Stars value={Math.round(avg)} />
              {t("rev.avg", { avg: avg.toLocaleString(lang === "ar" ? "ar-MA" : lang, { maximumFractionDigits: 1 }), n: shown.length })}
            </div>
          )}
        </div>
        {!open && !sent && (
          <button type="button" onClick={() => setOpen(true)} className="press rounded-full bg-blue px-5 py-3 font-semibold text-white">{t("rev.write")}</button>
        )}
      </div>

      {sent && <p role="status" className="mt-6 rounded-2xl bg-blue-soft p-4 font-medium text-blue">{t("rev.thanks")}</p>}

      {open && (
        <form onSubmit={submit} className="mt-6 max-w-xl space-y-4 rounded-2xl p-5 ring-1 ring-line">
          <fieldset>
            <legend className="text-sm font-semibold">{t("rev.rating")}</legend>
            <div className="mt-2 flex gap-1" dir="ltr">
              {[1, 2, 3, 4, 5].map((n) => (
                <label key={n} className="press cursor-pointer rounded-lg p-1 has-focus-visible:outline-2 has-focus-visible:outline-blue">
                  <input type="radio" name={`${gid}-rating`} value={n} checked={rating === n} onChange={() => { setRating(n); setErr(""); }} className="sr-only" />
                  <span className="sr-only">{t("rev.star", { n })}</span>
                  <span className="text-blue"><Star on={rating >= n} size="size-8" /></span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="block space-y-1.5"><span className="text-sm font-semibold">{t("rev.name")}</span>
            <input name="name" required maxLength={60} autoComplete="given-name" className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-blue" />
          </label>
          <label className="block space-y-1.5"><span className="text-sm font-semibold">{t("rev.comment")}</span>
            <textarea name="comment" required minLength={5} maxLength={1000} rows={3} placeholder={t("rev.commentPh")} className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-blue" />
          </label>
          {err && <p role="alert" className="text-sm font-medium text-red-700">{err}</p>}
          <button className="press rounded-full bg-blue px-6 py-3 font-semibold text-white">{t("rev.send")}</button>
        </form>
      )}

      {shown.length ? (
        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {shown.map((r) => (
            <li key={r.id} className="rounded-2xl bg-surface p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold">{r.name}</span>
                <span role="img" aria-label={t("rev.star", { n: r.rating })}><Stars value={r.rating} /></span>
              </div>
              <p className="mt-2 text-muted text-pretty">{r.comment}</p>
            </li>
          ))}
        </ul>
      ) : (
        !open && !sent && (
          <div className="mt-6 rounded-2xl border border-dashed border-line p-8 text-center">
            <p className="font-display text-xl font-bold">{t("rev.empty")}</p>
            <p className="mt-1 text-muted">{t("rev.emptySub")}</p>
          </div>
        )
      )}
    </div>
  );
}
