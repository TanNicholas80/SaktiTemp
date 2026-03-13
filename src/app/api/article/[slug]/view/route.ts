import { NextResponse } from "next/server";

import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { blog } from "@/db/schema/blog";

type Params = { params: Promise<{ slug: string }> };

/**
 * POST /api/article/[slug]/view
 * Increment blog view count when user visits detail page.
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
      .update(blog)
      .set({
        blogViews: sql`${blog.blogViews} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(blog.blogSlug, slug))
      .returning({
        blogId: blog.blogId,
        blogViews: blog.blogViews,
      });

    if (!result.length) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      blogViews: result[0]?.blogViews ?? 0,
    });
  } catch (err) {
    console.error("[article/view] Error:", err);
    return NextResponse.json(
      { error: "Gagal mencatat view" },
      { status: 500 }
    );
  }
}
