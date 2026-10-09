"use client";
import { useState, useSyncExternalStore } from "react";
import { gallery, LAMPS } from "@/lib/seed";
import { formatMAD, reviews as reviewsStore, orders as ordersStore, uid, useStore, type Order, type OrderStatus, type Product, type Review } from "@/lib/store";

// ponytail: client-side gate, fine for a demo with localStorage data. Real auth needed once data moves to a server DB.
const PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "hanaf2026" // ponytail: demo-only client-side gate, real auth with the database;
const SESSION = "hanaf-admin";
const empty: Product = { id: "", name: "", price: 0, categoryId: "", image: "", description: "", stock: 0, featured: false };
const input = "w-full rounded-lg border border-line bg-white px-3 py-2 text-base outline-none focus:border-ink";

export default function Admin() {
  const stored = useSyncExternalStore(() => () => {}, () => sessionStorage.getItem(SESSION) === "1", () => false);
  const [override, setOk] = useState<boolean | null>(null);
  const ok = override ?? stored;
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  if (!ok) {
    return (
      <form
        className="mx-auto mt-20 max-w-sm space-y-4 px-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (PASSWORD && pw === PASSWORD) { sessionStorage.setItem(SESSION, "1"); setOk(true); }
          else setErr(PASSWORD ? "Mot de passe incorrect." : "Mot de passe non configuré (NEXT_PUBLIC_ADMIN_PASSWORD).");
        }}
      >
        <h1 className="font-display text-2xl font-bold">Espace gérant</h1>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Mot de passe</span>
          <input type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} className={input} />
        </label>
        {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
        <button className="w-full rounded-full bg-blue py-2.5 font-semibold text-white">Entrer</button>
      </form>
    );
  }
  return <Dashboard onLogout={() => { sessionStorage.removeItem(SESSION); setOk(false); }} />;
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { products, categories, save, reset } = useStore();
  const [edit, setEdit] = useState<Product | null>(null);
  const [newCat, setNewCat] = useState("");
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"commandes" | "avis" | "produits" | "rayons">("commandes");
  const pendingReviews = reviewsStore.use().filter((r) => r.status === "pending").length;
  const newOrders = ordersStore.use().filter((o) => o.status === "nouvelle").length;

  const saveProduct = (p: Product) => {
    const next = p.id ? products.map((x) => (x.id === p.id ? p : x)) : [{ ...p, id: uid() }, ...products];
    save({ categories, products: next });
    setEdit(null);
  };
  const delProduct = (p: Product) => confirm(`Supprimer « ${p.name} » ?`) && save({ categories, products: products.filter((x) => x.id !== p.id) });
  const addCat = () => {
    const name = newCat.trim();
    if (!name) return;
    save({ products, categories: [...categories, { id: uid(), name }] });
    setNewCat("");
  };
  const renameCat = (id: string) => {
    const name = prompt("Nouveau nom", categories.find((c) => c.id === id)?.name)?.trim();
    if (name) save({ products, categories: categories.map((c) => (c.id === id ? { ...c, name } : c)) });
  };
  const delCat = (id: string) => {
    const n = products.filter((p) => p.categoryId === id).length;
    if (n) return alert(`Ce rayon contient ${n} produit(s). Déplacez-les ou supprimez-les d'abord.`);
    if (confirm("Supprimer ce rayon ?")) save({ products, categories: categories.filter((c) => c.id !== id) });
  };
  const list = products.filter((p) => p.name.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Tableau de bord</h1>
        <div className="flex gap-2 text-sm">
          <button onClick={() => confirm("Restaurer les données de démonstration ?") && reset()} className="rounded-lg border border-line px-3 py-2">Réinitialiser la démo</button>
          <button onClick={onLogout} className="rounded-lg border border-line px-3 py-2">Déconnexion</button>
        </div>
      </div>
      <p className="rounded-lg border border-line bg-surface p-3 text-sm text-muted">
        Démo : les modifications et les commandes sont enregistrées dans ce navigateur uniquement.
      </p>

      <div role="tablist" aria-label="Sections" className="flex gap-1 rounded-full bg-surface p-1">
        {([["commandes", `Commandes${newOrders ? ` (${newOrders})` : ""}`], ["avis", `Avis${pendingReviews ? ` (${pendingReviews})` : ""}`], ["produits", "Produits"], ["rayons", "Rayons"]] as const).map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
            className="press flex-1 rounded-full px-3 py-2.5 text-sm font-semibold text-muted aria-selected:bg-white aria-selected:text-blue aria-selected:shadow-sm">
            {label}
          </button>
        ))}
      </div>

      {tab === "commandes" && <Orders />}
      {tab === "avis" && <ReviewsAdmin products={products} />}

      {tab === "rayons" && <section aria-labelledby="cats" className="space-y-3">
        <h2 id="cats" className="font-display text-xl font-bold">Rayons</h2>
        <ul className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <li key={c.id} className="flex items-center gap-1 rounded-full border border-line bg-surface py-1 pr-1 pl-3 text-sm">
              {c.name}
              <button onClick={() => renameCat(c.id)} className="rounded-full px-2 py-1 hover:bg-line/60" aria-label={`Renommer ${c.name}`}>✎</button>
              <button onClick={() => delCat(c.id)} className="rounded-full px-2 py-1 hover:bg-line/60" aria-label={`Supprimer ${c.name}`}>×</button>
            </li>
          ))}
        </ul>
        <form className="flex max-w-md gap-2" onSubmit={(e) => { e.preventDefault(); addCat(); }}>
          <label className="flex-1"><span className="sr-only">Nouveau rayon</span>
            <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="Nouveau rayon" className={input} />
          </label>
          <button className="rounded-full bg-blue px-4 font-semibold text-white">Ajouter</button>
        </form>
      </section>}

      {tab === "produits" && <section aria-labelledby="prods" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="prods" className="font-display text-xl font-bold">Produits ({products.length})</h2>
          <button onClick={() => setEdit({ ...empty, categoryId: categories[0]?.id ?? "" })} className="rounded-full bg-blue px-4 py-2 font-semibold text-white">+ Nouveau produit</button>
        </div>
        <label className="block max-w-md"><span className="sr-only">Filtrer les produits</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filtrer…" className={input} />
        </label>
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr><th className="p-3 font-medium">Nom</th><th className="hidden p-3 font-medium sm:table-cell">Rayon</th><th className="p-3 text-right font-medium">Prix</th><th className="p-3 text-right font-medium">Stock</th><th className="p-3"><span className="sr-only">Actions</span></th></tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="p-3 font-medium">{p.name}{p.featured && <span className="ml-2 text-xs text-blue">★</span>}</td>
                  <td className="hidden p-3 text-muted sm:table-cell">{categories.find((c) => c.id === p.categoryId)?.name ?? "—"}</td>
                  <td className="p-3 text-right tabular-nums">{formatMAD(p.price)}</td>
                  <td className={`p-3 text-right tabular-nums ${p.stock === 0 ? "text-red-700" : ""}`}>{p.stock}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => setEdit(p)} className="rounded px-2 py-1 underline-offset-4 hover:underline">Modifier</button>
                    <button onClick={() => delProduct(p)} className="rounded px-2 py-1 text-red-700 underline-offset-4 hover:underline">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>}

      {edit && <ProductForm key={edit.id || "new"} initial={edit} categories={categories} onSave={saveProduct} onClose={() => setEdit(null)} />}
    </div>
  );
}

function readFile(f: File, cb: (url: string) => void) {
  if (f.size > 500_000) { alert(`${f.name} : image trop lourde pour la démo (max 500 Ko). Utilisez plutôt une URL.`); return cb(""); }
  const r = new FileReader();
  r.onload = () => cb(String(r.result));
  r.readAsDataURL(f);
}

/** Ordered product photos. The first one is the card image. */
function ImagesField({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [url, setUrl] = useState("");
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const add = (u: string) => { if (u.trim()) onChange([...value, u.trim()]); };
  const btn = "press grid size-9 place-items-center rounded-lg border border-line text-sm disabled:opacity-30";
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">Photos <span className="font-normal text-muted">(la première sert de vignette)</span></legend>
      {value.length > 0 && (
        <ol className="space-y-2">
          {value.map((src, i) => (
            <li key={src.slice(0, 80) + i} className="flex items-center gap-2 rounded-xl bg-surface p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="size-14 shrink-0 rounded-lg object-cover" />
              <span className="min-w-0 flex-1 truncate text-xs text-muted">{i === 0 ? "Vignette · " : ""}{src.startsWith("data:") ? "fichier téléversé" : src}</span>
              <button type="button" className={btn} onClick={() => move(i, -1)} disabled={i === 0} aria-label="Monter">↑</button>
              <button type="button" className={btn} onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label="Descendre">↓</button>
              <button type="button" className={btn + " text-red-700"} onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label="Retirer">×</button>
            </li>
          ))}
        </ol>
      )}
      <div className="flex gap-2">
        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://… (URL d'une photo)" aria-label="URL d'une photo" className={input}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(url); setUrl(""); } }} />
        <button type="button" onClick={() => { add(url); setUrl(""); }} className="press shrink-0 rounded-lg border border-line px-3 text-sm font-semibold">Ajouter</button>
      </div>
      <input type="file" accept="image/*" multiple aria-label="Téléverser des photos" className="block w-full text-sm"
        onChange={(e) => { const files = [...(e.target.files ?? [])]; const acc = [...value]; let left = files.length; files.forEach((f) => readFile(f, (u) => { if (u) acc.push(u); if (--left === 0) onChange([...acc]); })); e.target.value = ""; }} />
    </fieldset>
  );
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const onFile = (f?: File) => {
    if (!f) return;
    if (f.size > 500_000) return alert("Image trop lourde pour la démo (max 500 Ko). Utilisez plutôt une URL.");
    const r = new FileReader();
    r.onload = () => onChange(String(r.result));
    r.readAsDataURL(f);
  };
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{label}</legend>
      <input type="url" aria-label={`${label} (URL)`} value={value.startsWith("data:") ? "" : value} onChange={(e) => onChange(e.target.value)} placeholder="https://…" className={input} />
      <input type="file" accept="image/*" aria-label={`${label} (fichier)`} onChange={(e) => onFile(e.target.files?.[0])} className="block w-full text-sm" />
      {value && (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Aperçu" className="size-16 rounded-lg border border-line object-cover" />
          <button type="button" onClick={() => onChange("")} className="text-sm underline">Retirer</button>
        </div>
      )}
    </fieldset>
  );
}

function ProductForm({ initial, categories, onSave, onClose }: {
  initial: Product; categories: { id: string; name: string }[]; onSave: (p: Product) => void; onClose: () => void;
}) {
  const [p, setP] = useState<Product>({ ...initial, images: gallery(initial) });
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((x) => ({ ...x, [k]: v }));

  return (
    <dialog open className="fixed inset-0 z-50 m-0 flex h-full max-h-none w-full max-w-none items-end justify-center bg-ink/40 p-0 sm:items-center" aria-labelledby="pf-title"
      onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <form
        className="max-h-[92dvh] w-full max-w-lg space-y-3 overflow-y-auto rounded-t-2xl bg-white p-5 sm:rounded-2xl"
        onSubmit={(e) => { e.preventDefault(); onSave({ ...p, name: p.name.trim() }); }}
      >
        <h2 id="pf-title" className="font-display text-xl font-bold">{initial.id ? "Modifier le produit" : "Nouveau produit"}</h2>
        <label className="block space-y-1"><span className="text-sm font-medium">Nom</span>
          <input required autoFocus value={p.name} onChange={(e) => set("name", e.target.value)} className={input} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-1"><span className="text-sm font-medium">Prix (MAD)</span>
            <input required type="number" min={0} step="0.01" inputMode="decimal" value={p.price} onChange={(e) => set("price", Number(e.target.value))} className={input} />
          </label>
          <label className="block space-y-1"><span className="text-sm font-medium">Stock</span>
            <input required type="number" min={0} step="1" inputMode="numeric" value={p.stock} onChange={(e) => set("stock", Math.max(0, Math.floor(Number(e.target.value))))} className={input} />
          </label>
        </div>
        <label className="block space-y-1"><span className="text-sm font-medium">Rayon</span>
          <select required value={p.categoryId} onChange={(e) => set("categoryId", e.target.value)} className={input}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <ImagesField value={p.images ?? []} onChange={(v) => setP((x) => ({ ...x, images: v, image: v[0] ?? "" }))} />
        {p.categoryId === LAMPS && (
          <div className="space-y-3 rounded-xl bg-surface p-3">
            <p className="text-sm text-muted">Luminaire : photo éteinte et photo allumée pour la page Luminaires. Sans photo éteinte, la photo allumée est assombrie automatiquement.</p>
            <ImageField label="Photo éteinte" value={p.imageOff ?? ""} onChange={(v) => set("imageOff", v)} />
            <ImageField label="Photo allumée" value={p.imageOn ?? ""} onChange={(v) => set("imageOn", v)} />
          </div>
        )}
        <label className="block space-y-1"><span className="text-sm font-medium">Description</span>
          <textarea rows={3} value={p.description} onChange={(e) => set("description", e.target.value)} className={input} />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!p.featured} onChange={(e) => set("featured", e.target.checked)} className="size-4 accent-(--blue)" />
          Mettre en avant sur l&apos;accueil
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-line px-4 py-2">Annuler</button>
          <button className="rounded-full bg-blue px-4 py-2 font-semibold text-white">Enregistrer</button>
        </div>
      </form>
    </dialog>
  );
}

const STATUSES: OrderStatus[] = ["nouvelle", "confirmée", "livrée", "annulée"];
const STATUS_STYLE: Record<OrderStatus, string> = {
  nouvelle: "bg-blue text-white",
  confirmée: "bg-blue-soft text-blue",
  livrée: "bg-emerald-100 text-emerald-800",
  annulée: "bg-surface text-muted line-through",
};

function Orders() {
  const list = ordersStore.use();
  const [filter, setFilter] = useState<OrderStatus | "">("");
  const setStatus = (o: Order, status: OrderStatus) =>
    ordersStore.set(ordersStore.get().map((x) => (x.id === o.id ? { ...x, status } : x)));
  const shown = list.filter((o) => !filter || o.status === filter);

  return (
    <section aria-labelledby="orders" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="orders" className="font-display text-xl font-bold">Commandes ({list.length})</h2>
        <label className="text-sm"><span className="sr-only">Filtrer par statut</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value as OrderStatus | "")} className={input + " w-auto"}>
            <option value="">Tous les statuts</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>
      {!shown.length && <p className="rounded-2xl bg-surface p-8 text-center text-muted">Aucune commande pour le moment. Les commandes passées sur le site apparaissent ici.</p>}
      <ul className="space-y-3">
        {shown.map((o) => (
          <li key={o.id} className="rounded-2xl p-4 ring-1 ring-line sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-bold">n° {o.id.toUpperCase()} · {formatMAD(o.total)}</p>
                <p className="text-sm text-muted">{new Date(o.createdAt).toLocaleString("fr-MA", { dateStyle: "medium", timeStyle: "short" })}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[o.status]}`}>{o.status}</span>
            </div>
            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="font-semibold">{o.customer.name}</p>
                <a href={`tel:${o.customer.phone}`} className="text-blue underline underline-offset-4">{o.customer.phone}</a>
                <p className="text-muted">{o.customer.address}, {o.customer.city}</p>
                {o.customer.notes && <p className="mt-1 italic text-muted">« {o.customer.notes} »</p>}
              </div>
              <ul className="text-muted">
                {o.items.map((i) => <li key={i.id}>{i.qty} × {i.name}</li>)}
              </ul>
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm font-medium">Statut
              <select value={o.status} onChange={(e) => setStatus(o, e.target.value as OrderStatus)} className={input + " w-auto"}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ReviewsAdmin({ products }: { products: Product[] }) {
  const list = [...reviewsStore.use()].sort((a, b) => (a.status === b.status ? b.createdAt.localeCompare(a.createdAt) : a.status === "pending" ? -1 : 1));
  const update = (r: Review, status: Review["status"]) => reviewsStore.set(reviewsStore.get().map((x) => (x.id === r.id ? { ...x, status } : x)));
  const remove = (r: Review) => confirm("Supprimer cet avis ?") && reviewsStore.set(reviewsStore.get().filter((x) => x.id !== r.id));
  return (
    <section aria-labelledby="avis" className="space-y-4">
      <h2 id="avis" className="font-display text-xl font-bold">Avis ({list.length})</h2>
      <p className="text-sm text-muted">Les avis n&apos;apparaissent sur le site qu&apos;après approbation.</p>
      {!list.length && <p className="rounded-2xl bg-surface p-8 text-center text-muted">Aucun avis pour le moment.</p>}
      <ul className="space-y-3">
        {list.map((r) => (
          <li key={r.id} className="rounded-2xl p-4 ring-1 ring-line">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{r.name} · <span className="text-blue">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span></p>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${r.status === "pending" ? "bg-blue text-white" : "bg-emerald-100 text-emerald-800"}`}>
                {r.status === "pending" ? "en attente" : "publié"}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">
              {r.productId ? products.find((p) => p.id === r.productId)?.name ?? "Produit supprimé" : "Avis sur le magasin"} ·{" "}
              {new Date(r.createdAt).toLocaleString("fr-MA", { dateStyle: "medium", timeStyle: "short" })}
            </p>
            <p className="mt-2 text-muted">{r.comment}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {r.status === "pending"
                ? <button onClick={() => update(r, "approved")} className="press rounded-full bg-blue px-4 py-2 font-semibold text-white">Approuver</button>
                : <button onClick={() => update(r, "pending")} className="press rounded-full border border-line px-4 py-2">Masquer</button>}
              <button onClick={() => remove(r)} className="press rounded-full px-4 py-2 text-red-700">Supprimer</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
