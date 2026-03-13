import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryProduct } from "@/db/schema/category-product";
import { requireAdminApi } from "@/lib/api-auth";
import { slugify } from "@/lib/utils/slug";
import { updateCategoryProductSchema } from "@/lib/validations/category-product";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = updateCategoryProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.categoryProduct.findFirst({
      where: eq(categoryProduct.categoryProductId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    const name =
      parsed.data.categoryProductName ?? existing.categoryProductName;
    const slug =
      parsed.data.categoryProductSlug?.trim() ??
      (parsed.data.categoryProductName
        ? slugify(parsed.data.categoryProductName)
        : existing.categoryProductSlug);

    if (name !== existing.categoryProductName) {
      const existingByName = await db.query.categoryProduct.findFirst({
        where: eq(categoryProduct.categoryProductName, name),
      });
      if (existingByName) {
        return NextResponse.json(
          { error: "Nama kategori sudah digunakan" },
          { status: 409 }
        );
      }
    }

    if (slug !== existing.categoryProductSlug) {
      const existingBySlug = await db.query.categoryProduct.findFirst({
        where: eq(categoryProduct.categoryProductSlug, slug),
      });
      if (existingBySlug) {
        return NextResponse.json(
          { error: "Slug sudah digunakan" },
          { status: 409 }
        );
      }
    }

    const [updated] = await db
      .update(categoryProduct)
      .set({
        categoryProductName: name,
        categoryProductSlug: slug,
        updatedAt: new Date(),
      })
      .where(eq(categoryProduct.categoryProductId, id))
      .returning();

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
    const existing = await db.query.categoryProduct.findFirst({
      where: eq(categoryProduct.categoryProductId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    await db
      .delete(categoryProduct)
      .where(eq(categoryProduct.categoryProductId, id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus kategori" },
      { status: 500 }
    );
  }
}
