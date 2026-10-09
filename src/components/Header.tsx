"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LANGS, setLang, useLang } from "@/lib/i18n";
import { cart, setDrawer } from "@/lib/store";
import logo from "../../public/logo.webp";

const LINKS = [
  ["/catalogue", "nav.catalogue"],
  ["/luminaires", "nav.lamps"],
  ["/a-propos", "nav.about"],
  ["/#contact", "nav.contact"],
] as const;

function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, t } = useLang();
  return (
    <div role="group" aria-label={t("nav.lang")} className={`flex rounded-full bg-surface p-0.5 ${className}`}>
      {LANGS.map((l) => (
        <button
          key={l.id}
          type="button"
          lang={l.id}
          aria-pressed={lang === l.id}
          aria-label={l.label}
          onClick={() => setLang(l.id)}
          className="press min-w-9 rounded-full px-2 py-1.5 text-xs font-bold text-muted aria-pressed:bg-white aria-pressed:text-blue aria-pressed:shadow-sm"
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}

export default function Header() {
  const { t } = useLang();
  const count = cart.use().reduce((n, l) => n + l.qty, 0);
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-2 focus:top-2 focus:rounded focus:bg-white focus:p-2">
        {t("skip")}
      </a>
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4" aria-label={t("nav.menu")}>
        <Link href="/" className="shrink-0" aria-label={`Droguerie Quincaillerie Hanaf, ${t("nav.home")}`}>
          <Image src={logo} alt="Droguerie Quincaillerie Hanaf" priority className="h-10 w-auto sm:h-11" sizes="160px" />
        </Link>
        <div className="flex items-center gap-1 text-[15px] font-semibold">
          {LINKS.map(([href, k]) => (
            <Link key={href} href={href}
              className="press hidden rounded-full px-3 py-2 hover:bg-surface lg:block">
              {t(k)}
            </Link>
          ))}
          <LangSwitch className="ms-1 hidden lg:flex" />
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="press relative ms-1 flex size-11 items-center justify-center rounded-full bg-blue text-white"
            aria-label={t("nav.cart", { n: count })}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 7h12l-1 13H7L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -end-1 -top-1 grid min-w-5 place-items-center rounded-full border-2 border-white bg-ink px-1 text-[11px] font-bold tabular-nums">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("nav.close") : t("nav.menu")}
            className="press grid size-11 place-items-center rounded-full hover:bg-surface lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu: grid-rows trick animates height without measuring. */}
      <div id="mobile-menu" className={`grid transition-[grid-template-rows] duration-300 ease-(--ease-out) lg:hidden ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`} inert={!open}>
        <div className="overflow-hidden">
          <ul className="space-y-1 px-4 pt-2 pb-5">
            {LINKS.map(([href, k]) => (
              <li key={href}>
                <Link href={href} onClick={() => setOpen(false)} className="press block rounded-xl px-3 py-3 font-display text-2xl font-bold hover:bg-surface">
                  {t(k)}
                </Link>
              </li>
            ))}
            <li className="pt-3"><LangSwitch className="w-fit" /></li>
          </ul>
        </div>
      </div>
    </header>
  );
}
