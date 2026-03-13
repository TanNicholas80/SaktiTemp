import { NextResponse } from "next/server";

import { desc, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { product } from "@/db/schema/product";
import { categoryProduct } from "@/db/schema/category-product";
import { productThickness } from "@/db/schema/product-thickness";
import { thickness } from "@/db/schema/thickness";
import { productExellence } from "@/db/schema/product-exellence";
import { requireAdminApi } from "@/lib/api-auth";
import { slugify } from "@/lib/utils/slug";
import { createProductSchema } from "@/lib/validations/product";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const rows = await db
      .select({
        productId: product.productId,
        productName: product.productName,
        productSlug: product.productSlug,
        productShortDescription: product.productShortDescription,
        productDescription: product.productDescription,
        productImageUrl: product.productImageUrl,
        productImagePublicId: product.productImagePublicId,
        productViews: product.productViews,
        productIsPublished: product.productIsPublished,
        productIsPublishedAt: product.productIsPublishedAt,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        categoryProductId: product.categoryProductId,
        categoryProductName: categoryProduct.categoryProductName,
        categoryProductSlug: categoryProduct.categoryProductSlug,
      })
      .from(product)
      .leftJoin(
        categoryProduct,
        eq(product.categoryProductId, categoryProduct.categoryProductId)
      )
      .orderBy(desc(product.productIsPublishedAt));

    const productIds = rows.map((r) => r.productId);

    const thicknessRows =
      productIds.length > 0
        ? await db
            .select({
              productId: productThickness.productId,
              thicknessId: thickness.thicknessId,
              thicknessValue: thickness.thicknessValue,
              thicknessUnit: thickness.thicknessUnit,
            })
            .from(productThickness)
            .innerJoin(thickness, eq(productThickness.thicknessId, thickness.thicknessId))
            .where(inArray(productThickness.productId, productIds))
        : [];

    const excellences =
      productIds.length > 0
        ? await db
            .select()
            .from(productExellence)
            .where(inArray(productExellence.productId, productIds))
        : [];

    const thicknessByProduct = new Map<
      string,
      { thicknessId: string; productThicknessValue: number; productThicknessUnit: string }[]
    >();
    for (const t of thicknessRows) {
      if (t.productId) {
        const arr = thicknessByProduct.get(t.productId) ?? [];
        arr.push({
          thicknessId: t.thicknessId,
          productThicknessValue: t.thicknessValue,
          productThicknessUnit: t.thicknessUnit,
        });
        thicknessByProduct.set(t.productId, arr);
      }
    }

    const excellenceByProduct = new Map<string, typeof excellences>();
    for (const e of excellences) {
      if (e.productId) {
        const arr = excellenceByProduct.get(e.productId) ?? [];
        arr.push(e);
        excellenceByProduct.set(e.productId, arr);
      }
    }

    const list = rows.map((r) => ({
      productId: r.productId,
      productName: r.productName,
      productSlug: r.productSlug,
      productShortDescription: r.productShortDescription,
      productDescription: r.productDescription,
      productImageUrl: r.productImageUrl,
      productImagePublicId: r.productImagePublicId,
      productViews: r.productViews,
      productIsPublished: r.productIsPublished,
      productIsPublishedAt: r.productIsPublishedAt,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      categoryProductId: r.categoryProductId,
      category: r.categoryProductName
        ? { name: r.categoryProductName, slug: r.categoryProductSlug }
        : null,
      thicknesses:
        thicknessByProduct.get(r.productId)?.map((t) => ({
          thicknessId: t.thicknessId,
          productThicknessValue: t.productThicknessValue,
          productThicknessUnit: t.productThicknessUnit,
        })) ?? [],
      excellences:
        excellenceByProduct.get(r.productId)?.map((e) => ({
          productExellenceId: e.productExellenceId,
          productExellenceDescription: e.productExellenceDescription,
        })) ?? [],
    }));

    return NextResponse.json(list);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal mengambil data produk" },
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
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const slug = parsed.data.productSlug.trim();
    const existingSlug = await db.query.product.findFirst({
      where: eq(product.productSlug, slug),
    });
    if (existingSlug) {
      return NextResponse.json(
        { error: "Slug sudah digunakan" },
        { status: 409 }
      );
    }

    const [inserted] = await db
      .insert(product)
      .values({
        productName: parsed.data.productName,
        productSlug: slug,
        productShortDescription: parsed.data.productShortDescription ?? "",
        productDescription: parsed.data.productDescription,
        productImageUrl: parsed.data.productImageUrl,
        productImagePublicId: parsed.data.productImagePublicId,
        categoryProductId: parsed.data.categoryProductId ?? null,
        productIsPublished: parsed.data.productIsPublished ?? false,
        productIsPublishedAt: parsed.data.productIsPublished
          ? new Date()
          : new Date(),
      })
      .returning();

    if (!inserted) {
      return NextResponse.json(
        { error: "Gagal membuat produk" },
        { status: 500 }
      );
    }

    const productId = inserted.productId;

    if (parsed.data.thicknessIds?.length) {
      await db.insert(productThickness).values(
        parsed.data.thicknessIds.map((tid) => ({
          productId,
          thicknessId: tid,
        }))
      );
    }

    if (parsed.data.excellences?.length) {
      await db.insert(productExellence).values(
        parsed.data.excellences.map((e) => ({
          productId,
          productExellenceDescription: e.productExellenceDescription,
        }))
      );
    }

    return NextResponse.json(inserted);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal membuat produk" },
      { status: 500 }
    );
  }
}
