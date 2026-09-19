import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Only the home page for now. Car, brand and news URLs are added once the
// listing and detail pages read from the API.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE.url, changeFrequency: "weekly", priority: 1 }];
}
