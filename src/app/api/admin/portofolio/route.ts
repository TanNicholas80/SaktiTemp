import { NextResponse } from "next/server";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { portofolio } from "@/db/schema/portofolio";
import { categoryPortofolio } from "@/db/schema/category-portofolio";
import { productApplicationPortofolio } from "@/db/schema/product-application-portofolio";
import { revalidateContentCache } from "@/lib/cache/revalidate";
import { requireAdminApi } from "@/lib/api-auth";
import { createPortofolioSchema } from "@/lib/validations/portofolio";
import { translateAndSavePortofolio } from "@/lib/translate/entity-translators";
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
        portofolioId: portofolio.portofolioId,
        portofolioName: portofolio.portofolioName,
        portofolioSlug: portofolio.portofolioSlug,
        portofolioShortDescription: portofolio.portofolioShortDescription,
        portofolioAbout: portofolio.portofolioAbout,
        portofolioGalleryImages: portofolio.portofolioGalleryImages,
        portofolioLocation: portofolio.portofolioLocation,
        portofolioImageUrl: portofolio.portofolioImageUrl,
        portofolioIsPublishedAt: portofolio.portofolioIsPublishedAt,
        categoryPortofolioName: categoryPortofolio.categoryPortofolioName,
        categoryPortofolioSlug: categoryPortofolio.categoryPortofolioSlug,
      })
      .from(portofolio)
      .leftJoin(
        categoryPortofolio,
        eq(portofolio.categoryPortofolioId, categoryPortofolio.categoryPortofolioId)
      )
      .orderBy(desc(portofolio.portofolioIsPublishedAt));

    const list = rows.map((r) => ({
      portofolioId: r.portofolioId,
      portofolioName: r.portofolioName,
      portofolioSlug: r.portofolioSlug,
      portofolioShortDescription: r.portofolioShortDescription,
      portofolioAbout: r.portofolioAbout,
      portofolioGalleryImages: Array.isArray(r.portofolioGalleryImages)
        ? r.portofolioGalleryImages
        : [],
      portofolioLocation: r.portofolioLocation,
      portofolioImageUrl: r.portofolioImageUrl,
      portofolioIsPublishedAt: r.portofolioIsPublishedAt,
      category: r.categoryPortofolioName
        ? { name: r.categoryPortofolioName, slug: r.categoryPortofolioSlug }
        : null,
    }));

    return NextResponse.json(list);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data portofolio" },
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
    const parsed = createPortofolioSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const slug = parsed.data.portofolioSlug.trim();
    const existingSlug = await db.query.portofolio.findFirst({
      where: eq(portofolio.portofolioSlug, slug),
    });
    if (existingSlug) {
      return NextResponse.json(
        { error: "Slug sudah digunakan" },
        { status: 409 }
      );
    }

    let portofolioImageUrl = parsed.data.portofolioImageUrl.trim();
    let portofolioImagePublicId = parsed.data.portofolioImagePublicId.trim();
    try {
      const promoted = await promoteStagingImageIfNeeded(
        portofolioImageUrl,
        portofolioImagePublicId,
        "portofolio"
      );
      portofolioImageUrl = promoted.url;
      portofolioImagePublicId = promoted.publicId;
    } catch (e) {
      if (e instanceof StagingPromoteError) {
        return NextResponse.json({ error: e.message }, { status: 500 });
      }
      throw e;
    }

    const galleryImages = parsed.data.portofolioGalleryImages ?? [];
    const promotedGalleryImages: { url: string; publicId: string }[] = [];
    for (const img of galleryImages) {
      try {
        const promoted = await promoteStagingImageIfNeeded(
          img.url.trim(),
          img.publicId.trim(),
          "portofolio"
        );
        promotedGalleryImages.push({
          url: promoted.url,
          publicId: promoted.publicId,
        });
      } catch (e) {
        if (e instanceof StagingPromoteError) {
          return NextResponse.json({ error: e.message }, { status: 500 });
        }
        throw e;
      }
    }

    const [inserted] = await db
      .insert(portofolio)
      .values({
        portofolioName: parsed.data.portofolioName,
        portofolioSlug: slug,
        portofolioShortDescription: parsed.data.portofolioShortDescription ?? "",
        portofolioAbout: parsed.data.portofolioAbout ?? "",
        portofolioGalleryImages: promotedGalleryImages,
        portofolioLocation: parsed.data.portofolioLocation,
        portofolioImageUrl,
        portofolioImagePublicId,
        categoryPortofolioId: parsed.data.categoryPortofolioId ?? null,
        portofolioTypeId: parsed.data.portofolioTypeId ?? null,
        portofolioIsPublished: parsed.data.portofolioIsPublished ?? false,
        portofolioIsPublishedAt: parsed.data.portofolioIsPublished
          ? new Date()
          : new Date(),
      })
      .returning();

    if (!inserted) {
      return NextResponse.json(
        { error: "Gagal membuat portofolio" },
        { status: 500 }
      );
    }

    if (parsed.data.productApplicationIds?.length) {
      await db.insert(productApplicationPortofolio).values(
        parsed.data.productApplicationIds.map((productApplicationId) => ({
          productApplicationId,
          portofolioId: inserted.portofolioId,
        }))
      );
    }

    translateAndSavePortofolio(inserted).catch((err) => console.error("Translation failed:", err));

    await revalidateContentCache("portofolio");
    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat portofolio" },
      { status: 500 }
    );
  }
}
