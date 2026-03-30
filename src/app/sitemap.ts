import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { blog } from "@/db/schema/blog";
import { portofolio } from "@/db/schema/portofolio";
import { product } from "@/db/schema/product";

export const revalidate = 3600;

const BASE_URL = "https://www.saktitemp.com";
const LOCALES = ["id", "en", "zh"] as const;

function localePath(locale: string, path: string) {
  const prefix = locale === "id" ? "" : `/${locale}`;
  return `${BASE_URL}${prefix}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, portofolios, blogs] = await Promise.all([
    db
      .select({ productSlug: product.productSlug, updatedAt: product.updatedAt })
      .from(product)
      .where(eq(product.productIsPublished, true)),
    db
      .select({
        portofolioSlug: portofolio.portofolioSlug,
        updatedAt: portofolio.updatedAt,
      })
      .from(portofolio)
      .where(eq(portofolio.portofolioIsPublished, true)),
    db
      .select({ blogSlug: blog.blogSlug, updatedAt: blog.updatedAt })
      .from(blog)
      .where(eq(blog.blogIsPublished, true)),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/product`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/portofolio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/article`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about/company`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.flatMap((p) =>
    LOCALES.map((locale) => ({
      url: localePath(locale, `/product/${p.productSlug}`),
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }))
  );

  const portofolioRoutes: MetadataRoute.Sitemap = portofolios.flatMap((p) =>
    LOCALES.map((locale) => ({
      url: localePath(locale, `/portofolio/${p.portofolioSlug}`),
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  const blogRoutes: MetadataRoute.Sitemap = blogs.flatMap((b) =>
    LOCALES.map((locale) => ({
      url: localePath(locale, `/article/${b.blogSlug}`),
      lastModified: b.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  return [...staticRoutes, ...productRoutes, ...portofolioRoutes, ...blogRoutes];
}
