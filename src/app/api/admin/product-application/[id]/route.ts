import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { productApplication } from "@/db/schema/product-application";
import { product } from "@/db/schema/product";
import { revalidateContentCache } from "@/lib/cache/revalidate";
import { translateAndSaveProductApplication } from "@/lib/translate/entity-translators";
import { deleteProductImageFile } from "@/lib/utils/product-image";
import { requireAdminApi } from "@/lib/api-auth";
import { slugify } from "@/lib/utils/slug";
import { updateProductApplicationSchema } from "@/lib/validations/product-application";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const rows = await db
      .select({
        productApplicationId: productApplication.productApplicationId,
        productApplicationName: productApplication.productApplicationName,
        productApplicationSlug: productApplication.productApplicationSlug,
        productApplicationDescription: productApplication.productApplicationDescription,
        productApplicationImageUrl: productApplication.productApplicationImageUrl,
        productApplicationImagePublicId: productApplication.productApplicationImagePublicId,
        productApplicationIsPublished: productApplication.productApplicationIsPublished,
        productId: productApplication.productId,
        productName: product.productName,
        productSlug: product.productSlug,
      })
      .from(productApplication)
      .leftJoin(product, eq(productApplication.productId, product.productId))
      .where(eq(productApplication.productApplicationId, id))
      .limit(1);

    const row = rows[0];
    if (!row) {
      return NextResponse.json(
        { error: "Aplikasi produk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...row,
      product: row.productName
        ? { productId: row.productId, productName: row.productName, productSlug: row.productSlug }
        : null,
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data aplikasi produk" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = updateProductApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.productApplication.findFirst({
      where: eq(productApplication.productApplicationId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Aplikasi produk tidak ditemukan" },
        { status: 404 }
      );
    }

    const newName = parsed.data.productApplicationName ?? existing.productApplicationName;
    const newSlug = slugify(newName);
    if (newSlug !== existing.productApplicationSlug) {
      const existingSlug = await db.query.productApplication.findFirst({
        where: eq(productApplication.productApplicationSlug, newSlug),
      });
      if (existingSlug) {
        return NextResponse.json(
          { error: "Slug sudah digunakan (nama aplikasi mungkin duplikat)" },
          { status: 409 }
        );
      }
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (parsed.data.productApplicationName !== undefined) {
      updateData.productApplicationName = parsed.data.productApplicationName.trim();
      updateData.productApplicationSlug = slugify(parsed.data.productApplicationName);
    }
    if (parsed.data.productApplicationDescription !== undefined)
      updateData.productApplicationDescription = parsed.data.productApplicationDescription;
    if (parsed.data.productApplicationImageUrl !== undefined)
      updateData.productApplicationImageUrl = parsed.data.productApplicationImageUrl;
    if (parsed.data.productApplicationImagePublicId !== undefined)
      updateData.productApplicationImagePublicId =
        parsed.data.productApplicationImagePublicId;
    if (parsed.data.productId !== undefined)
      updateData.productId = parsed.data.productId ?? null;
    if (parsed.data.productApplicationIsPublished !== undefined)
      updateData.productApplicationIsPublished =
        parsed.data.productApplicationIsPublished;

    const newPublicId = parsed.data.productApplicationImagePublicId;
    const oldPublicId = existing.productApplicationImagePublicId;
    const imageChanged =
      newPublicId !== undefined && oldPublicId && newPublicId !== oldPublicId;

    const [updated] = await db
      .update(productApplication)
      .set(updateData)
      .where(eq(productApplication.productApplicationId, id))
      .returning();

    if (imageChanged && updated?.productApplicationImagePublicId && oldPublicId) {
      await deleteProductImageFile(oldPublicId);
    }

    translateAndSaveProductApplication(updated, {
      productApplicationName: existing.productApplicationName,
      productApplicationDescription: existing.productApplicationDescription,
    }).catch((err) => console.error("Translation failed:", err));

    await revalidateContentCache("product");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui aplikasi produk" },
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
    const existing = await db.query.productApplication.findFirst({
      where: eq(productApplication.productApplicationId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Aplikasi produk tidak ditemukan" },
        { status: 404 }
      );
    }

    if (existing.productApplicationImagePublicId) {
      await deleteProductImageFile(existing.productApplicationImagePublicId);
    }

    await db
      .delete(productApplication)
      .where(eq(productApplication.productApplicationId, id));

    await revalidateContentCache("product");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus aplikasi produk" },
      { status: 500 }
    );
  }
}
