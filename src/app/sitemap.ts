import type { MetadataRoute } from "next";
import { BUSINESS } from "@/lib/business";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/catalogue", "/luminaires", "/a-propos"].map((p) => ({ url: `${BUSINESS.url}${p}` }));
}
