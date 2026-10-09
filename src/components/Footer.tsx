import Link from "next/link";
import { ADDRESS, BUSINESS } from "@/lib/business";
import LogoMark from "./LogoMark";

export default function Footer() {
  return (
    <footer className="mt-24 bg-blue text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-14 pb-[calc(2.5rem+env(safe-area-inset-bottom))] md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="flex items-center gap-4">
          <LogoMark className="h-16 w-auto" shield="#fff" line="var(--blue)" />
          <p className="font-display text-sm font-bold uppercase leading-tight tracking-[0.14em]">
            Droguerie
            <br />
            Quincaillerie
            <br />
            <span className="text-2xl tracking-[0.06em]">Hanaf</span>
          </p>
        </div>
        <div className="text-sm text-white/80">
          <p className="mb-2 font-semibold text-white">Magasin</p>
          <address className="not-italic">{ADDRESS}</address>
          <p className="mt-1">Depuis {BUSINESS.since}</p>
        </div>
        <ul className="space-y-2 text-sm text-white/80">
          <li><Link href="/catalogue" className="hover:text-white">Catalogue</Link></li>
          <li><Link href="/#contact" className="hover:text-white">Contact et horaires</Link></li>
          <li><Link href="/admin" className="hover:text-white">Espace gérant</Link></li>
        </ul>
      </div>
      <p className="border-t border-white/15 px-4 py-4 text-center text-xs text-white/60">
        © {BUSINESS.name} · Paiement à la livraison
      </p>
    </footer>
  );
}
