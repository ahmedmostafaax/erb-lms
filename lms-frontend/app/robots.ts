import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://ec2-63-184-39-37.eu-central-1.compute.amazonaws.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/settings", "/checkout/", "/learn/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
