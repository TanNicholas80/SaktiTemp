import { NextResponse } from "next/server";

import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { portofolio } from "@/db/schema/portofolio";

type Params = { params: Promise<{ slug: string }> };

/**
 * POST /api/portofolio/[slug]/view
 * Increment portfolio view count when user visits detail page.
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
      .update(portofolio)
      .set({
        portofolioViews: sql`${portofolio.portofolioViews} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(portofolio.portofolioSlug, slug))
      .returning({
        portofolioId: portofolio.portofolioId,
        portofolioViews: portofolio.portofolioViews,
      });

    if (!result.length) {
      return NextResponse.json(
        { error: "Portofolio tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      portofolioViews: result[0]?.portofolioViews ?? 0,
    });
  } catch (err) {
    console.error("[portofolio/view] Error:", err);
    return NextResponse.json(
      { error: "Gagal mencatat view" },
      { status: 500 }
    );
  }
}
