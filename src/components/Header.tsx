import Link from "next/link";
import { BUSINESS } from "@/lib/business";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:p-2">Aller au contenu</a>
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3" aria-label="Navigation principale">
        <Link href="/" className="font-display text-lg font-extrabold leading-none tracking-tight">
          Hanaf<span className="text-accent">.</span>
          <span className="block text-[11px] font-medium tracking-normal text-muted">Droguerie · Quincaillerie</span>
        </Link>
        <ul className="flex items-center gap-1 text-sm font-medium">
          <li><Link href="/catalogue" className="rounded-md px-3 py-2 hover:bg-line/50">Catalogue</Link></li>
          <li><Link href="/#contact" className="rounded-md px-3 py-2 hover:bg-line/50">Contact</Link></li>
        </ul>
      </nav>
      <span className="sr-only">{BUSINESS.name}</span>
    </header>
  );
}
