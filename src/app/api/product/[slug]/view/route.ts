import { NextResponse } from "next/server";

import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { product } from "@/db/schema/product";

type Params = { params: Promise<{ slug: string }> };

/**
 * POST /api/product/[slug]/view
 * Increment product view count when user visits product detail page.
 * Public endpoint, no auth required.
 */
export async function POST(_request: Request, { params }: Params) {
  const { slug } = await params;

  if (!slug?.trim()) {
    return NextResponse.json(
      { error: "Slug tidak valid" },
      { status: 400 }
    );
  }

  try {
    const result = await db
      .update(product)
      .set({
        productViews: sql`${product.productViews} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(product.productSlug, slug))
      .returning({ productId: product.productId, productViews: product.productViews });

    if (!result.length) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      productViews: result[0]?.productViews ?? 0,
    });
  } catch (err) {
    console.error("[product/view] Error:", err);
    return NextResponse.json(
      { error: "Gagal mencatat view" },
      { status: 500 }
    );
  }
}
