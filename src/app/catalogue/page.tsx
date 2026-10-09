import { Suspense } from "react";
import type { Metadata } from "next";
import Catalogue from "./Catalogue";

export const metadata: Metadata = {
  title: "Catalogue",
  description: "Catalogue de la Droguerie Quincaillerie Hanaf : peinture, outillage, plomberie, électricité, jardinage.",
  alternates: { canonical: "/catalogue" },
};

export default function Page() {
  return (
    <Suspense>
      <Catalogue />
    </Suspense>
  );
}
