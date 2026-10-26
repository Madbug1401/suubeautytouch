import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { NAV } from "@/components/site/nav";

export default function sitemap(): MetadataRoute.Sitemap {
  return NAV.map(({ href }) => ({ url: `${SITE.url}${href === "/" ? "" : href}`, changeFrequency: "weekly" }));
}
