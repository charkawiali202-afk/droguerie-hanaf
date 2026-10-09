"use client";
import { useState, useSyncExternalStore } from "react";
import { formatMAD, orders as ordersStore, uid, useStore, type Order, type OrderStatus, type Product } from "@/lib/store";

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
  const [tab, setTab] = useState<"commandes" | "produits" | "rayons">("commandes");
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
        {([["commandes", `Commandes${newOrders ? ` (${newOrders})` : ""}`], ["produits", "Produits"], ["rayons", "Rayons"]] as const).map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
            className="press flex-1 rounded-full px-3 py-2.5 text-sm font-semibold text-muted aria-selected:bg-white aria-selected:text-blue aria-selected:shadow-sm">
            {label}
          </button>
        ))}
      </div>

      {tab === "commandes" && <Orders />}

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

function ProductForm({ initial, categories, onSave, onClose }: {
  initial: Product; categories: { id: string; name: string }[]; onSave: (p: Product) => void; onClose: () => void;
}) {
  const [p, setP] = useState(initial);
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((x) => ({ ...x, [k]: v }));
  const onFile = (f?: File) => {
    if (!f) return;
    if (f.size > 500_000) return alert("Image trop lourde pour la démo (max 500 Ko). Utilisez plutôt une URL.");
    const r = new FileReader();
    r.onload = () => set("image", String(r.result));
    r.readAsDataURL(f);
  };

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
        <label className="block space-y-1"><span className="text-sm font-medium">Image (URL)</span>
          <input type="url" value={p.image.startsWith("data:") ? "" : p.image} onChange={(e) => set("image", e.target.value)} placeholder="https://…" className={input} />
        </label>
        <label className="block space-y-1"><span className="text-sm font-medium">ou téléverser un fichier</span>
          <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} className="block w-full text-sm" />
        </label>
        {p.image && (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt="Aperçu" className="size-16 rounded-lg border border-line object-cover" />
            <button type="button" onClick={() => set("image", "")} className="text-sm underline">Retirer l&apos;image</button>
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
