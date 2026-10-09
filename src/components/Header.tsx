"use client";
import Image from "next/image";
import Link from "next/link";
import { cart, setDrawer } from "@/lib/store";
import logo from "../../public/logo.webp";

export default function Header() {
  const count = cart.use().reduce((n, l) => n + l.qty, 0);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:rounded focus:bg-white focus:p-2">
        Aller au contenu
      </a>
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4" aria-label="Navigation principale">
        <Link href="/" className="shrink-0" aria-label="Droguerie Quincaillerie Hanaf, accueil">
          <Image src={logo} alt="Droguerie Quincaillerie Hanaf" priority className="h-10 w-auto sm:h-11" sizes="160px" />
        </Link>
        <div className="flex items-center gap-1 text-[15px] font-semibold">
          <Link href="/catalogue" className="press rounded-full px-3 py-2 hover:bg-surface">Catalogue</Link>
          <Link href="/#contact" className="press hidden rounded-full px-3 py-2 hover:bg-surface sm:block">Contact</Link>
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="press relative ml-1 flex size-11 items-center justify-center rounded-full bg-blue text-white"
            aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 7h12l-1 13H7L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full border-2 border-white bg-ink px-1 text-[11px] font-bold tabular-nums">
                {count}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
