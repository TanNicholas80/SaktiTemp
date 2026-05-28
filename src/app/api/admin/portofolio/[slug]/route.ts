import { NextResponse } from "next/server";

import { eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { deletePortofolioImageFile } from "@/lib/utils/portofolio-image";
import { portofolio } from "@/db/schema/portofolio";
import { categoryPortofolio } from "@/db/schema/category-portofolio";
import { portofolioType } from "@/db/schema/portofolio-type";
import { productApplicationPortofolio } from "@/db/schema/product-application-portofolio";
import { productApplication } from "@/db/schema/product-application";
import { product } from "@/db/schema/product";
import { productThickness } from "@/db/schema/product-thickness";
import { thickness } from "@/db/schema/thickness";
import { revalidateContentCache } from "@/lib/cache/revalidate";
import { requireAdminApi } from "@/lib/api-auth";
import { updatePortofolioSchema } from "@/lib/validations/portofolio";
import { translateAndSavePortofolio } from "@/lib/translate/entity-translators";
import {
  promoteStagingImageIfNeeded,
  StagingPromoteError,
} from "@/lib/server/staging-image";

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
        portofolioId: portofolio.portofolioId,
        portofolioName: portofolio.portofolioName,
        portofolioSlug: portofolio.portofolioSlug,
        portofolioShortDescription: portofolio.portofolioShortDescription,
        portofolioAbout: portofolio.portofolioAbout,
        portofolioLocation: portofolio.portofolioLocation,
        portofolioImageUrl: portofolio.portofolioImageUrl,
        portofolioImagePublicId: portofolio.portofolioImagePublicId,
        portofolioViews: portofolio.portofolioViews,
        portofolioIsPublished: portofolio.portofolioIsPublished,
        portofolioIsPublishedAt: portofolio.portofolioIsPublishedAt,
        createdAt: portofolio.createdAt,
        updatedAt: portofolio.updatedAt,
        categoryPortofolioId: portofolio.categoryPortofolioId,
        categoryPortofolioName: categoryPortofolio.categoryPortofolioName,
        categoryPortofolioSlug: categoryPortofolio.categoryPortofolioSlug,
        portofolioTypeId: portofolio.portofolioTypeId,
        portofolioTypeName: portofolioType.portofolioTypeName,
        portofolioTypeSlug: portofolioType.portofolioTypeSlug,
      })
      .from(portofolio)
      .leftJoin(
        categoryPortofolio,
        eq(portofolio.categoryPortofolioId, categoryPortofolio.categoryPortofolioId)
      )
      .leftJoin(
        portofolioType,
        eq(portofolio.portofolioTypeId, portofolioType.portofolioTypeId)
      )
      .where(eq(portofolio.portofolioSlug, slug))
      .limit(1);

    const row = rows[0];
    if (!row) {
      return NextResponse.json(
        { error: "Portofolio tidak ditemukan" },
        { status: 404 }
      );
    }

    const papLinks = await db
      .select({ productApplicationId: productApplicationPortofolio.productApplicationId })
      .from(productApplicationPortofolio)
      .where(eq(productApplicationPortofolio.portofolioId, row.portofolioId));

    const productApplicationIds = papLinks
      .map((p) => p.productApplicationId)
      .filter((id): id is string => id != null);

    let productApplications: {
      productApplicationId: string;
      productApplicationName: string;
      productApplicationDescription: string;
      productApplicationImageUrl: string;
      product: {
        productId: string;
        productName: string;
        productSlug: string;
        thicknesses: { productThicknessValue: number; productThicknessUnit: string }[];
      };
    }[] = [];

    if (productApplicationIds.length > 0) {
      const paRows = await db
        .select({
          productApplicationId: productApplication.productApplicationId,
          productApplicationName: productApplication.productApplicationName,
          productApplicationDescription: productApplication.productApplicationDescription,
          productApplicationImageUrl: productApplication.productApplicationImageUrl,
          productId: productApplication.productId,
          productName: product.productName,
          productSlug: product.productSlug,
        })
        .from(productApplication)
        .leftJoin(product, eq(productApplication.productId, product.productId))
        .where(inArray(productApplication.productApplicationId, productApplicationIds));

      const productIds = paRows
        .map((r) => r.productId)
        .filter((id): id is string => id != null);
      const uniqueProductIds = [...new Set(productIds)];

      const thicknessRows =
        uniqueProductIds.length > 0
          ? await db
              .select({
                productId: productThickness.productId,
                thicknessValue: thickness.thicknessValue,
                thicknessUnit: thickness.thicknessUnit,
              })
              .from(productThickness)
              .innerJoin(thickness, eq(productThickness.thicknessId, thickness.thicknessId))
              .where(inArray(productThickness.productId, uniqueProductIds))
          : [];

      const thicknessByProduct = new Map<
        string,
        { productThicknessValue: number; productThicknessUnit: string }[]
      >();
      for (const t of thicknessRows) {
        if (t.productId) {
          const arr = thicknessByProduct.get(t.productId) ?? [];
          arr.push({
            productThicknessValue: t.thicknessValue,
            productThicknessUnit: t.thicknessUnit,
          });
          thicknessByProduct.set(t.productId, arr);
        }
      }

      productApplications = paRows.map((r) => ({
        productApplicationId: r.productApplicationId,
        productApplicationName: r.productApplicationName,
        productApplicationDescription: r.productApplicationDescription,
        productApplicationImageUrl: r.productApplicationImageUrl,
        product: {
          productId: r.productId ?? "",
          productName: r.productName ?? "-",
          productSlug: r.productSlug ?? "",
          thicknesses: r.productId
            ? thicknessByProduct.get(r.productId) ?? []
            : [],
        },
      }));
    }

    return NextResponse.json({
      ...row,
      category: row.categoryPortofolioName
        ? {
            name: row.categoryPortofolioName,
            slug: row.categoryPortofolioSlug,
          }
        : null,
      productApplications,
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data portofolio" },
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
    const parsed = updatePortofolioSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.portofolio.findFirst({
      where: eq(portofolio.portofolioSlug, slug),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Portofolio tidak ditemukan" },
        { status: 404 }
      );
    }

    const newSlug = parsed.data.portofolioSlug?.trim();
    if (newSlug && newSlug !== slug) {
      const existingSlug = await db.query.portofolio.findFirst({
        where: eq(portofolio.portofolioSlug, newSlug),
      });
      if (existingSlug) {
        return NextResponse.json(
          { error: "Slug sudah digunakan" },
          { status: 409 }
        );
      }
    }

    const updateData: Partial<typeof portofolio.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (parsed.data.portofolioName !== undefined)
      updateData.portofolioName = parsed.data.portofolioName;
    if (parsed.data.portofolioSlug !== undefined)
      updateData.portofolioSlug = parsed.data.portofolioSlug.trim();
    if (parsed.data.portofolioShortDescription !== undefined)
      updateData.portofolioShortDescription = parsed.data.portofolioShortDescription ?? "";
    if (parsed.data.portofolioAbout !== undefined)
      updateData.portofolioAbout = parsed.data.portofolioAbout;
    if (parsed.data.portofolioLocation !== undefined)
      updateData.portofolioLocation = parsed.data.portofolioLocation;
    if (
      parsed.data.portofolioImageUrl !== undefined &&
      parsed.data.portofolioImagePublicId !== undefined
    ) {
      try {
        const promoted = await promoteStagingImageIfNeeded(
          parsed.data.portofolioImageUrl.trim(),
          parsed.data.portofolioImagePublicId.trim(),
          "portofolio"
        );
        updateData.portofolioImageUrl = promoted.url;
        updateData.portofolioImagePublicId = promoted.publicId;
      } catch (e) {
        if (e instanceof StagingPromoteError) {
          return NextResponse.json({ error: e.message }, { status: 500 });
        }
        throw e;
      }
    } else {
      if (parsed.data.portofolioImageUrl !== undefined)
        updateData.portofolioImageUrl = parsed.data.portofolioImageUrl.trim();
      if (parsed.data.portofolioImagePublicId !== undefined)
        updateData.portofolioImagePublicId =
          parsed.data.portofolioImagePublicId.trim();
    }
    if (parsed.data.categoryPortofolioId !== undefined)
      updateData.categoryPortofolioId = parsed.data.categoryPortofolioId;
    if (parsed.data.portofolioTypeId !== undefined)
      updateData.portofolioTypeId = parsed.data.portofolioTypeId;
    if (parsed.data.portofolioIsPublished !== undefined) {
      updateData.portofolioIsPublished = parsed.data.portofolioIsPublished;
      if (parsed.data.portofolioIsPublished) {
        updateData.portofolioIsPublishedAt = new Date();
      }
    }

    const newPublicId = parsed.data.portofolioImagePublicId;
    const oldPublicId = existing.portofolioImagePublicId;
    const imageChanged =
      newPublicId !== undefined && oldPublicId && newPublicId !== oldPublicId;

    const [updated] = await db
      .update(portofolio)
      .set(updateData)
      .where(eq(portofolio.portofolioId, existing.portofolioId))
      .returning();

    if (parsed.data.productApplicationIds !== undefined) {
      await db
        .delete(productApplicationPortofolio)
        .where(eq(productApplicationPortofolio.portofolioId, existing.portofolioId));
      if (parsed.data.productApplicationIds.length > 0) {
        await db.insert(productApplicationPortofolio).values(
          parsed.data.productApplicationIds.map((productApplicationId) => ({
            productApplicationId,
            portofolioId: existing.portofolioId,
          }))
        );
      }
    }

    if (imageChanged && updated) {
      await deletePortofolioImageFile(oldPublicId);
    }

    translateAndSavePortofolio(updated, {
      portofolioName: existing.portofolioName,
      portofolioShortDescription: existing.portofolioShortDescription,
      portofolioAbout: existing.portofolioAbout,
      portofolioLocation: existing.portofolioLocation,
    }).catch((err) => console.error("Translation failed:", err));

    await revalidateContentCache("portofolio");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui portofolio" },
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
    const existing = await db.query.portofolio.findFirst({
      where: eq(portofolio.portofolioSlug, slug),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Portofolio tidak ditemukan" },
        { status: 404 }
      );
    }

    if (existing.portofolioImagePublicId) {
      await deletePortofolioImageFile(existing.portofolioImagePublicId);
    }

    await db
      .delete(portofolio)
      .where(eq(portofolio.portofolioId, existing.portofolioId));

    await revalidateContentCache("portofolio");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus portofolio" },
      { status: 500 }
    );
  }
}
