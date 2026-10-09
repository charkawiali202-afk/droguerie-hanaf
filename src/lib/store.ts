"use client";
import { useSyncExternalStore } from "react";
import { SEED, type Data, type Order, type Review } from "./seed";
export type { Category, Product, Order, OrderStatus, Review } from "./seed";

// ponytail: all demo data lives in each browser's localStorage; swap for a DB (e.g. Supabase)
// when stock and orders must be shared between devices.
function localStore<T>(key: string, fallback: T) {
  let cache: { raw: string | null; value: T } = { raw: null, value: fallback };
  const listeners = new Set<() => void>();
  const get = (): T => {
    let raw: string | null = null;
    try { raw = localStorage.getItem(key); } catch {}
    if (raw !== cache.raw) {
      try { cache = { raw, value: raw ? JSON.parse(raw) : fallback }; } catch { cache = { raw, value: fallback }; }
    }
    return cache.value;
  };
  const subscribe = (cb: () => void) => {
    listeners.add(cb);
    const onStorage = (e: StorageEvent) => e.key === key && cb();
    window.addEventListener("storage", onStorage);
    return () => { listeners.delete(cb); window.removeEventListener("storage", onStorage); };
  };
  const set = (value: T | null) => {
    try { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(value)); }
    catch { alert("Stockage du navigateur plein : utilisez une URL d'image plutôt qu'un fichier."); }
    listeners.forEach((l) => l());
  };
  const use = () => useSyncExternalStore(subscribe, get, () => fallback);
  return { get, set, use };
}

const catalog = localStore<Data>("hanaf-data-v3", SEED);
export type CartLine = { id: string; qty: number };
export const cart = localStore<CartLine[]>("hanaf-cart", []);
export const orders = localStore<Order[]>("hanaf-orders", []);
export const reviews = localStore<Review[]>("hanaf-reviews", []);

const noop = () => () => {};
export const useHydrated = () => useSyncExternalStore(noop, () => true, () => false);

export function useStore() {
  const data = catalog.use();
  return { ...data, ready: useHydrated(), save: (next: Data) => catalog.set(next), reset: () => catalog.set(null) };
}

export function addToCart(id: string, qty = 1) {
  const lines = cart.get();
  const found = lines.find((l) => l.id === id);
  cart.set(found ? lines.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l)) : [...lines, { id, qty }]);
}
export function setQty(id: string, qty: number) {
  cart.set(qty <= 0 ? cart.get().filter((l) => l.id !== id) : cart.get().map((l) => (l.id === id ? { ...l, qty } : l)));
}

// Cart drawer open state (memory only).
let drawerOpen = false;
const drawerListeners = new Set<() => void>();
export const setDrawer = (open: boolean) => { drawerOpen = open; drawerListeners.forEach((l) => l()); };
export const useDrawer = () =>
  useSyncExternalStore((cb) => { drawerListeners.add(cb); return () => drawerListeners.delete(cb); }, () => drawerOpen, () => false);

export const formatMAD = (n: number) =>
  new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD", maximumFractionDigits: 2 }).format(n);
export const uid = () => crypto.randomUUID().slice(0, 8);
