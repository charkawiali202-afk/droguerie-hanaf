import type { Metadata } from "next";
export const metadata: Metadata = { title: "Admin", robots: { index: false } };
export default function L({ children }: { children: React.ReactNode }) {
  return <div dir="ltr" lang="fr">{children}</div>; // admin stays in French
}
