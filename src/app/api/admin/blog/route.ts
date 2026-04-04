import { NextResponse } from "next/server";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { blog } from "@/db/schema/blog";
import { categoryBlog } from "@/db/schema/category-blog";
import { revalidateContentCache } from "@/lib/cache/revalidate";
import { requireAdminApi } from "@/lib/api-auth";
import { slugify } from "@/lib/utils/slug";
import { createBlogSchema } from "@/lib/validations/blog";
import { translateAndSaveBlog } from "@/lib/translate/entity-translators";
import {
  promoteStagingImageIfNeeded,
  StagingPromoteError,
} from "@/lib/server/staging-image";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const rows = await db
      .select({
        blogId: blog.blogId,
        blogTitle: blog.blogTitle,
        blogSlug: blog.blogSlug,
        blogExcerpt: blog.blogExcerpt,
        blogContent: blog.blogContent,
        blogImageUrl: blog.blogImageUrl,
        blogImagePublicId: blog.blogImagePublicId,
        blogViews: blog.blogViews,
        blogIsPublished: blog.blogIsPublished,
        blogIsPublishedAt: blog.blogIsPublishedAt,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        categoryBlogId: blog.categoryBlogId,
        categoryBlogName: categoryBlog.categoryBlogName,
        categoryBlogSlug: categoryBlog.categoryBlogSlug,
      })
      .from(blog)
      .leftJoin(categoryBlog, eq(blog.categoryBlogId, categoryBlog.categoryBlogId))
      .orderBy(desc(blog.blogIsPublishedAt));

    const list = rows.map((r) => ({
      blogId: r.blogId,
      blogTitle: r.blogTitle,
      blogSlug: r.blogSlug,
      blogExcerpt: r.blogExcerpt,
      blogContent: r.blogContent,
      blogImageUrl: r.blogImageUrl,
      blogImagePublicId: r.blogImagePublicId,
      blogViews: r.blogViews,
      blogIsPublished: r.blogIsPublished,
      blogIsPublishedAt: r.blogIsPublishedAt,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      categoryBlogId: r.categoryBlogId,
      category: r.categoryBlogName
        ? { name: r.categoryBlogName, slug: r.categoryBlogSlug }
        : null,
    }));

    return NextResponse.json(list);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data blog" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const parsed = createBlogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const slug = parsed.data.blogSlug.trim();
    const existingSlug = await db.query.blog.findFirst({
      where: eq(blog.blogSlug, slug),
    });
    if (existingSlug) {
      return NextResponse.json(
        { error: "Slug sudah digunakan" },
        { status: 409 }
      );
    }

    let blogImageUrl = parsed.data.blogImageUrl.trim();
    let blogImagePublicId = parsed.data.blogImagePublicId.trim();
    try {
      const promoted = await promoteStagingImageIfNeeded(
        blogImageUrl,
        blogImagePublicId,
        "blog"
      );
      blogImageUrl = promoted.url;
      blogImagePublicId = promoted.publicId;
    } catch (e) {
      if (e instanceof StagingPromoteError) {
        return NextResponse.json({ error: e.message }, { status: 500 });
      }
      throw e;
    }

    const [inserted] = await db
      .insert(blog)
      .values({
        blogTitle: parsed.data.blogTitle,
        blogSlug: slug,
        blogExcerpt: parsed.data.blogExcerpt ?? "",
        blogContent: parsed.data.blogContent,
        blogImageUrl,
        blogImagePublicId,
        categoryBlogId: parsed.data.categoryBlogId ?? null,
        blogIsPublished: parsed.data.blogIsPublished ?? false,
        blogIsPublishedAt: parsed.data.blogIsPublished
          ? new Date()
          : new Date(),
      })
      .returning();

    translateAndSaveBlog(inserted).catch((err) => console.error("Translation failed:", err));

    await revalidateContentCache("blog");
    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat blog" },
      { status: 500 }
    );
  }
}
