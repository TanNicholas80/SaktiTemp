import { NextResponse } from "next/server";

import { and, eq, ne } from "drizzle-orm";

import { revalidateContentCache } from "@/lib/cache/revalidate";
import { db } from "@/db";
import { heroSection } from "@/db/schema/hero-section";
import { requireAdminApi } from "@/lib/api-auth";
import { updateHeroSectionSchema } from "@/lib/validations/hero-section";
import { translateAndSaveHeroSection } from "@/lib/translate/entity-translators";
import {
  promoteStagingImageIfNeeded,
  StagingPromoteError,
} from "@/lib/server/staging-image";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const item = await db.query.heroSection.findFirst({
      where: eq(heroSection.heroSectionId, id),
    });

    if (!item) {
      return NextResponse.json(
        { error: "Hero section tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data hero section" },
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
    const parsed = updateHeroSectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.heroSection.findFirst({
      where: eq(heroSection.heroSectionId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Hero section tidak ditemukan" },
        { status: 404 }
      );
    }

    if (
      parsed.data.pageKey !== undefined &&
      parsed.data.pageKey !== existing.pageKey
    ) {
      const duplicatePageKey = await db.query.heroSection.findFirst({
        where: and(
          eq(heroSection.pageKey, parsed.data.pageKey),
          ne(heroSection.heroSectionId, id)
        ),
      });
      if (duplicatePageKey) {
        return NextResponse.json(
          {
            error: "Page key sudah digunakan",
            details: {
              fieldErrors: { pageKey: ["Page key harus unik"] },
            },
          },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (parsed.data.pageKey !== undefined)
      updateData.pageKey = parsed.data.pageKey.trim().toLowerCase();
    if (parsed.data.preHeading !== undefined)
      updateData.preHeading = parsed.data.preHeading?.trim() ?? null;
    if (parsed.data.mainHeading !== undefined)
      updateData.mainHeading = parsed.data.mainHeading.trim();
    if (parsed.data.subHeading !== undefined)
      updateData.subHeading = parsed.data.subHeading.trim();
    if (parsed.data.description !== undefined)
      updateData.description = parsed.data.description.trim();
    if (
      parsed.data.backgroundImageUrl !== undefined &&
      parsed.data.backgroundImagePublicId !== undefined
    ) {
      try {
        const promoted = await promoteStagingImageIfNeeded(
          parsed.data.backgroundImageUrl.trim(),
          parsed.data.backgroundImagePublicId.trim(),
          "hero"
        );
        updateData.backgroundImageUrl = promoted.url;
        updateData.backgroundImagePublicId = promoted.publicId;
      } catch (e) {
        if (e instanceof StagingPromoteError) {
          return NextResponse.json({ error: e.message }, { status: 500 });
        }
        throw e;
      }
    } else {
      if (parsed.data.backgroundImageUrl !== undefined)
        updateData.backgroundImageUrl = parsed.data.backgroundImageUrl.trim();
      if (parsed.data.backgroundImagePublicId !== undefined)
        updateData.backgroundImagePublicId =
          parsed.data.backgroundImagePublicId?.trim() ?? null;
    }
    if (parsed.data.breadcrumbItems !== undefined)
      updateData.breadcrumbItems = parsed.data.breadcrumbItems;
    if (parsed.data.scrollIndicatorText !== undefined)
      updateData.scrollIndicatorText =
        parsed.data.scrollIndicatorText?.trim() ?? "SCROLL";
    if (parsed.data.scrollIndicatorVisible !== undefined)
      updateData.scrollIndicatorVisible = parsed.data.scrollIndicatorVisible;
    if (parsed.data.isPublished !== undefined)
      updateData.isPublished = parsed.data.isPublished;

    const [updated] = await db
      .update(heroSection)
      .set(updateData)
      .where(eq(heroSection.heroSectionId, id))
      .returning();

    translateAndSaveHeroSection(updated, {
      preHeading: existing.preHeading,
      mainHeading: existing.mainHeading,
      subHeading: existing.subHeading,
      description: existing.description,
      scrollIndicatorText: existing.scrollIndicatorText,
      breadcrumbItems: existing.breadcrumbItems,
    }).catch((err) => console.error("Translation failed:", err));

    await revalidateContentCache("hero");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui hero section" },
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
    const existing = await db.query.heroSection.findFirst({
      where: eq(heroSection.heroSectionId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Hero section tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.delete(heroSection).where(eq(heroSection.heroSectionId, id));

    await revalidateContentCache("hero");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus hero section" },
      { status: 500 }
    );
  }
}
