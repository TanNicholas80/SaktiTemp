import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryProduct } from "@/db/schema/category-product";
import { revalidateContentCache } from "@/lib/cache/revalidate";
import { translateAndSaveCategoryProduct } from "@/lib/translate/entity-translators";
import { requireAdminApi } from "@/lib/api-auth";
import { slugify } from "@/lib/utils/slug";
import { createCategoryProductSchema } from "@/lib/validations/category-product";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const categories = await db.query.categoryProduct.findMany({
      columns: {
        categoryProductId: true,
        categoryProductName: true,
        categoryProductSlug: true,
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
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const parsed = createCategoryProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const name = parsed.data.categoryProductName;
    const slug =
      parsed.data.categoryProductSlug?.trim() || slugify(name);

    const existingByName = await db.query.categoryProduct.findFirst({
      where: eq(categoryProduct.categoryProductName, name),
    });
    if (existingByName) {
      return NextResponse.json(
        { error: "Nama kategori sudah digunakan" },
        { status: 409 }
      );
    }

    const existingBySlug = await db.query.categoryProduct.findFirst({
      where: eq(categoryProduct.categoryProductSlug, slug),
    });
    if (existingBySlug) {
      return NextResponse.json(
        { error: "Slug sudah digunakan" },
        { status: 409 }
      );
    }

    const [inserted] = await db
      .insert(categoryProduct)
      .values({
        categoryProductName: name,
        categoryProductSlug: slug,
      })
      .returning();

    translateAndSaveCategoryProduct(inserted).catch((err) =>
      console.error("Translation failed:", err)
    );

    await revalidateContentCache("product");
    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat kategori" },
      { status: 500 }
    );
  }
}
