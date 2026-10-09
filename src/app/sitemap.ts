import type { MetadataRoute } from "next";
import { BUSINESS } from "@/lib/business";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/catalogue"].map((p) => ({ url: `${BUSINESS.url}${p}` }));
}
