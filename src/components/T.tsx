"use client";
import { useLang, type Key } from "@/lib/i18n";

/** Translated text, usable from server components. */
export default function T({ k, v }: { k: Key; v?: Record<string, string | number> }) {
  return <>{useLang().t(k, v)}</>;
}
