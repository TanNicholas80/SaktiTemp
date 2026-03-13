import { NextResponse } from "next/server";

import { desc } from "drizzle-orm";

import { db } from "@/db";
import { blog } from "@/db/schema/blog";
import { product } from "@/db/schema/product";
import { portofolio } from "@/db/schema/portofolio";
import { contact } from "@/db/schema/contact";
import { requireAdminApi } from "@/lib/api-auth";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const [blogs, products, portofolios, contacts, topBlogs, topProducts, topPortofolios, recentBlogs, recentProducts, recentPortofolios] =
      await Promise.all([
        db.select({ blogViews: blog.blogViews }).from(blog),
        db.select({ productViews: product.productViews }).from(product),
        db.select({ portofolioViews: portofolio.portofolioViews }).from(portofolio),
        db.select({ contactId: contact.contactId }).from(contact),
        db
          .select({
            blogId: blog.blogId,
            blogTitle: blog.blogTitle,
            blogSlug: blog.blogSlug,
            blogViews: blog.blogViews,
          })
          .from(blog)
          .orderBy(desc(blog.blogViews))
          .limit(5),
        db
          .select({
            productId: product.productId,
            productName: product.productName,
            productSlug: product.productSlug,
            productViews: product.productViews,
          })
          .from(product)
          .orderBy(desc(product.productViews))
          .limit(5),
        db
          .select({
            portofolioId: portofolio.portofolioId,
            portofolioName: portofolio.portofolioName,
            portofolioSlug: portofolio.portofolioSlug,
            portofolioViews: portofolio.portofolioViews,
          })
          .from(portofolio)
          .orderBy(desc(portofolio.portofolioViews))
          .limit(5),
        db
          .select({
            blogId: blog.blogId,
            blogTitle: blog.blogTitle,
            blogSlug: blog.blogSlug,
            blogIsPublishedAt: blog.blogIsPublishedAt,
          })
          .from(blog)
          .orderBy(desc(blog.blogIsPublishedAt))
          .limit(5),
        db
          .select({
            productId: product.productId,
            productName: product.productName,
            productSlug: product.productSlug,
            productIsPublishedAt: product.productIsPublishedAt,
          })
          .from(product)
          .orderBy(desc(product.productIsPublishedAt))
          .limit(5),
        db
          .select({
            portofolioId: portofolio.portofolioId,
            portofolioName: portofolio.portofolioName,
            portofolioSlug: portofolio.portofolioSlug,
            portofolioIsPublishedAt: portofolio.portofolioIsPublishedAt,
          })
          .from(portofolio)
          .orderBy(desc(portofolio.portofolioIsPublishedAt))
          .limit(5),
      ]);

    const totalViews =
      blogs.reduce((s, b) => s + (b.blogViews ?? 0), 0) +
      products.reduce((s, p) => s + (p.productViews ?? 0), 0) +
      portofolios.reduce((s, p) => s + (p.portofolioViews ?? 0), 0);

    return NextResponse.json({
      counts: {
        blog: blogs.length,
        product: products.length,
        portofolio: portofolios.length,
        contact: contacts.length,
      },
      totalViews,
      topBlogs,
      topProducts,
      topPortofolios,
      recentBlogs: recentBlogs.map((r) => ({
        ...r,
        blogIsPublishedAt: r.blogIsPublishedAt?.toISOString() ?? null,
      })),
      recentProducts: recentProducts.map((r) => ({
        ...r,
        productIsPublishedAt: r.productIsPublishedAt?.toISOString() ?? null,
      })),
      recentPortofolios: recentPortofolios.map((r) => ({
        ...r,
        portofolioIsPublishedAt: r.portofolioIsPublishedAt?.toISOString() ?? null,
      })),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal mengambil data dashboard" },
      { status: 500 }
    );
  }
}
