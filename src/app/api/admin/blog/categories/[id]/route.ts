import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryBlog } from "@/db/schema/category-blog";
import { revalidateContentCache } from "@/lib/cache/revalidate";
import { requireAdminApi } from "@/lib/api-auth";
import { slugify } from "@/lib/utils/slug";
import { updateCategoryBlogSchema } from "@/lib/validations/category-blog";
import { translateAndSaveCategoryBlog } from "@/lib/translate/entity-translators";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = updateCategoryBlogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.categoryBlog.findFirst({
      where: eq(categoryBlog.categoryBlogId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    const name = parsed.data.categoryBlogName ?? existing.categoryBlogName;
    const slug =
      parsed.data.categoryBlogSlug?.trim() ??
      (parsed.data.categoryBlogName ? slugify(parsed.data.categoryBlogName) : existing.categoryBlogSlug);

    if (name !== existing.categoryBlogName) {
      const existingByName = await db.query.categoryBlog.findFirst({
        where: eq(categoryBlog.categoryBlogName, name),
      });
      if (existingByName) {
        return NextResponse.json(
          { error: "Nama kategori sudah digunakan" },
          { status: 409 }
        );
      }
    }

    if (slug !== existing.categoryBlogSlug) {
      const existingBySlug = await db.query.categoryBlog.findFirst({
        where: eq(categoryBlog.categoryBlogSlug, slug),
      });
      if (existingBySlug) {
        return NextResponse.json(
          { error: "Slug sudah digunakan" },
          { status: 409 }
        );
      }
    }

    const [updated] = await db
      .update(categoryBlog)
      .set({
        categoryBlogName: name,
        categoryBlogSlug: slug,
        updatedAt: new Date(),
      })
      .where(eq(categoryBlog.categoryBlogId, id))
      .returning();

    translateAndSaveCategoryBlog(updated, {
      categoryBlogName: existing.categoryBlogName,
    }).catch((err) => console.error("Translation failed:", err));

    await revalidateContentCache("blog");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui kategori" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const existing = await db.query.categoryBlog.findFirst({
      where: eq(categoryBlog.categoryBlogId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.delete(categoryBlog).where(eq(categoryBlog.categoryBlogId, id));

    await revalidateContentCache("blog");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus kategori" },
      { status: 500 }
    );
  }
}
