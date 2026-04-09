import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryBlog } from "@/db/schema/category-blog";
import { revalidateContentCache } from "@/lib/cache/revalidate";
import { requireBlogCmsApi } from "@/lib/api-auth";
import { slugify } from "@/lib/utils/slug";
import { createCategoryBlogSchema } from "@/lib/validations/category-blog";
import { translateAndSaveCategoryBlog } from "@/lib/translate/entity-translators";

export async function GET() {
  const auth = await requireBlogCmsApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const categories = await db.query.categoryBlog.findMany({
      columns: {
        categoryBlogId: true,
        categoryBlogName: true,
        categoryBlogSlug: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: (c, { desc }) => [desc(c.createdAt)],
    });

    return NextResponse.json(categories);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data kategori" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireBlogCmsApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const parsed = createCategoryBlogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const name = parsed.data.categoryBlogName;
    const slug =
      parsed.data.categoryBlogSlug?.trim() || slugify(name);

    const existingByName = await db.query.categoryBlog.findFirst({
      where: eq(categoryBlog.categoryBlogName, name),
    });
    if (existingByName) {
      return NextResponse.json(
        { error: "Nama kategori sudah digunakan" },
        { status: 409 }
      );
    }

    const existingBySlug = await db.query.categoryBlog.findFirst({
      where: eq(categoryBlog.categoryBlogSlug, slug),
    });
    if (existingBySlug) {
      return NextResponse.json(
        { error: "Slug sudah digunakan" },
        { status: 409 }
      );
    }

    const [inserted] = await db
      .insert(categoryBlog)
      .values({
        categoryBlogName: name,
        categoryBlogSlug: slug,
      })
      .returning();

    translateAndSaveCategoryBlog(inserted).catch((err) => console.error("Translation failed:", err));

    await revalidateContentCache("blog");
    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat kategori" },
      { status: 500 }
    );
  }
}
