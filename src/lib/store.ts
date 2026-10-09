"use client";
import { useSyncExternalStore } from "react";
import { SEED, type Data } from "./seed";
export type { Category, Product } from "./seed";

const KEY = "hanaf-data-v1";
let cache: { raw: string | null; data: Data } = { raw: null, data: SEED };
const read = (): Data => {
  let raw: string | null = null;
  try { raw = localStorage.getItem(KEY); } catch {}
  if (raw !== cache.raw) {
    try { cache = { raw, data: raw ? JSON.parse(raw) : SEED }; } catch { cache = { raw, data: SEED }; }
  }
  return cache.data;
};
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => { listeners.delete(cb); window.removeEventListener("storage", cb); };
};
const write = (raw: string | null) => {
  try { if (raw === null) localStorage.removeItem(KEY); else localStorage.setItem(KEY, raw); }
  catch { alert("Stockage plein : utilisez une URL d'image plutôt qu'un fichier."); }
  listeners.forEach((l) => l());
};

// ponytail: demo data lives in each browser's localStorage; swap for a DB (e.g. Supabase) when stock must be shared between devices.
export function useStore() {
  const data = useSyncExternalStore(subscribe, read, () => SEED);
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  return { ...data, ready, save: (next: Data) => write(JSON.stringify(next)), reset: () => write(null) };
}

export const formatMAD = (n: number) =>
  new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD", maximumFractionDigits: 2 }).format(n);
export const uid = () => crypto.randomUUID().slice(0, 8);
