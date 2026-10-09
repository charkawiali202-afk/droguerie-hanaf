import Link from "next/link";
import { ADDRESS, BUSINESS } from "@/lib/business";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:justify-between">
        <p>© {BUSINESS.name}, depuis {BUSINESS.since} · {ADDRESS}</p>
        <Link href="/admin" className="hover:text-ink">Espace gérant</Link>
      </div>
    </footer>
  );
}
