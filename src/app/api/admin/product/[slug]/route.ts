import { NextResponse } from "next/server";

import { eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { deleteProductImageFile } from "@/lib/utils/product-image";
import { product } from "@/db/schema/product";
import { categoryProduct } from "@/db/schema/category-product";
import { productThickness } from "@/db/schema/product-thickness";
import { thickness } from "@/db/schema/thickness";
import { productExellence } from "@/db/schema/product-exellence";
import { productApplication } from "@/db/schema/product-application";
import { productApplicationPortofolio } from "@/db/schema/product-application-portofolio";
import { portofolio } from "@/db/schema/portofolio";
import { portofolioType } from "@/db/schema/portofolio-type";
import { requireAdminApi } from "@/lib/api-auth";
import { updateProductSchema } from "@/lib/validations/product";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { slug } = await params;

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
      .where(eq(product.productSlug, slug))
      .limit(1);

    const row = rows[0];
    if (!row) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    const thicknessRows = await db
      .select({
        thicknessId: thickness.thicknessId,
        thicknessValue: thickness.thicknessValue,
        thicknessUnit: thickness.thicknessUnit,
      })
      .from(productThickness)
      .innerJoin(thickness, eq(productThickness.thicknessId, thickness.thicknessId))
      .where(eq(productThickness.productId, row.productId));

    const excellences = await db
      .select()
      .from(productExellence)
      .where(eq(productExellence.productId, row.productId));

    const productApplications = await db
      .select({
        productApplicationId: productApplication.productApplicationId,
        productApplicationName: productApplication.productApplicationName,
      })
      .from(productApplication)
      .where(eq(productApplication.productId, row.productId));

    const productApplicationIds = productApplications
      .map((a) => a.productApplicationId)
      .filter((id): id is string => id != null);

    const portofolioIds =
      productApplicationIds.length > 0
        ? [
            ...new Set(
              (
                await db
                  .select({
                    portofolioId: productApplicationPortofolio.portofolioId,
                  })
                  .from(productApplicationPortofolio)
                  .where(
                    inArray(
                      productApplicationPortofolio.productApplicationId,
                      productApplicationIds
                    )
                  )
              )
                .map((p) => p.portofolioId)
                .filter((id): id is string => id != null)
            ),
          ]
        : [];

    const filteredPortofolios =
      portofolioIds.length > 0
        ? await db
            .select({
              portofolioId: portofolio.portofolioId,
              portofolioName: portofolio.portofolioName,
              portofolioSlug: portofolio.portofolioSlug,
              portofolioLocation: portofolio.portofolioLocation,
              portofolioImageUrl: portofolio.portofolioImageUrl,
              portofolioTypeId: portofolio.portofolioTypeId,
              portofolioTypeName: portofolioType.portofolioTypeName,
              portofolioTypeSlug: portofolioType.portofolioTypeSlug,
            })
            .from(portofolio)
            .leftJoin(
              portofolioType,
              eq(portofolio.portofolioTypeId, portofolioType.portofolioTypeId)
            )
            .where(inArray(portofolio.portofolioId, portofolioIds))
        : [];

    const portofolioTypesMap = new Map<
      string,
      { portofolioTypeId: string; portofolioTypeName: string }
    >();
    for (const p of filteredPortofolios) {
      if (
        p.portofolioTypeId &&
        p.portofolioTypeName &&
        !portofolioTypesMap.has(p.portofolioTypeId)
      ) {
        portofolioTypesMap.set(p.portofolioTypeId, {
          portofolioTypeId: p.portofolioTypeId,
          portofolioTypeName: p.portofolioTypeName,
        });
      }
    }
    const portofolioTypes = Array.from(portofolioTypesMap.values());

    const portofoliosForResponse = filteredPortofolios.map((p) => ({
      portofolioId: p.portofolioId,
      portofolioName: p.portofolioName,
      portofolioSlug: p.portofolioSlug,
      portofolioLocation: p.portofolioLocation,
      portofolioImageUrl: p.portofolioImageUrl,
    }));

    return NextResponse.json({
      ...row,
      category: row.categoryProductName
        ? { name: row.categoryProductName, slug: row.categoryProductSlug }
        : null,
      thicknesses: thicknessRows.map((t) => ({
        thicknessId: t.thicknessId,
        productThicknessValue: t.thicknessValue,
        productThicknessUnit: t.thicknessUnit,
      })),
      excellences: excellences.map((e) => ({
        productExellenceId: e.productExellenceId,
        productExellenceDescription: e.productExellenceDescription,
      })),
      productApplications: productApplications.map((a) => ({
        productApplicationId: a.productApplicationId,
        productApplicationName: a.productApplicationName,
      })),
      portofolioTypes,
      portofolios: portofoliosForResponse,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal mengambil data produk" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { slug } = await params;

  try {
    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.product.findFirst({
      where: eq(product.productSlug, slug),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    const newSlug = parsed.data.productSlug?.trim();
    if (newSlug && newSlug !== slug) {
      const existingSlug = await db.query.product.findFirst({
        where: eq(product.productSlug, newSlug),
      });
      if (existingSlug) {
        return NextResponse.json(
          { error: "Slug sudah digunakan" },
          { status: 409 }
        );
      }
    }

    const updateData: Partial<typeof product.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (parsed.data.productName !== undefined)
      updateData.productName = parsed.data.productName;
    if (parsed.data.productSlug !== undefined)
      updateData.productSlug = parsed.data.productSlug.trim();
    if (parsed.data.productShortDescription !== undefined)
      updateData.productShortDescription = parsed.data.productShortDescription ?? "";
    if (parsed.data.productDescription !== undefined)
      updateData.productDescription = parsed.data.productDescription;
    if (parsed.data.productImageUrl !== undefined)
      updateData.productImageUrl = parsed.data.productImageUrl;
    if (parsed.data.productImagePublicId !== undefined)
      updateData.productImagePublicId = parsed.data.productImagePublicId;
    if (parsed.data.categoryProductId !== undefined)
      updateData.categoryProductId = parsed.data.categoryProductId;
    if (parsed.data.productIsPublished !== undefined) {
      updateData.productIsPublished = parsed.data.productIsPublished;
      if (parsed.data.productIsPublished) {
        updateData.productIsPublishedAt = new Date();
      }
    }

    const newPublicId = parsed.data.productImagePublicId;
    const oldPublicId = existing.productImagePublicId;
    const imageChanged =
      newPublicId !== undefined && oldPublicId && newPublicId !== oldPublicId;

    const [updated] = await db
      .update(product)
      .set(updateData)
      .where(eq(product.productId, existing.productId))
      .returning();

    if (parsed.data.thicknessIds !== undefined) {
      await db
        .delete(productThickness)
        .where(eq(productThickness.productId, existing.productId));
      if (parsed.data.thicknessIds.length > 0) {
        await db.insert(productThickness).values(
          parsed.data.thicknessIds.map((tid) => ({
            productId: existing.productId,
            thicknessId: tid,
          }))
        );
      }
    }

    if (parsed.data.excellences !== undefined) {
      await db
        .delete(productExellence)
        .where(eq(productExellence.productId, existing.productId));
      if (parsed.data.excellences.length > 0) {
        await db.insert(productExellence).values(
          parsed.data.excellences.map((e) => ({
            productId: existing.productId,
            productExellenceDescription: e.productExellenceDescription,
          }))
        );
      }
    }

    if (imageChanged && updated) {
      await deleteProductImageFile(oldPublicId);
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal memperbarui produk" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { slug } = await params;

  try {
    const existing = await db.query.product.findFirst({
      where: eq(product.productSlug, slug),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    if (existing.productImagePublicId) {
      await deleteProductImageFile(existing.productImagePublicId);
    }

    await db
      .delete(productThickness)
      .where(eq(productThickness.productId, existing.productId));
    await db
      .delete(productExellence)
      .where(eq(productExellence.productId, existing.productId));
    await db.delete(product).where(eq(product.productId, existing.productId));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal menghapus produk" },
      { status: 500 }
    );
  }
}
