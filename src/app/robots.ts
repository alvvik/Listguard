import type { MetadataRoute } from "next";
import { config } from "../../config";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/whitelist/manage",
    },
    sitemap: `${config.domain}/sitemap.xml`,
  };
}
