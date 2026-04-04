import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { processingCategories } from "@/db/schema/processing_categories";
import { processingPrices } from "@/db/schema/processing_prices";
import { requireAdminApi } from "@/lib/api-auth";
import { translateAndSaveProcessingCategory } from "@/lib/translate/entity-translators";
import { updateProcessingCategorySchema } from "@/lib/validations/processing-categories";
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
    const existing = await db.query.processingCategories.findFirst({
      where: eq(processingCategories.processingCategoryId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(existing);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data kategori" },
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
    const parsed = updateProcessingCategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.processingCategories.findFirst({
      where: eq(processingCategories.processingCategoryId, id),
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    if (parsed.data.categoryName !== undefined) {
      const nextName = parsed.data.categoryName.trim();
      const dup = await db.query.processingCategories.findFirst({
        where: eq(processingCategories.categoryName, nextName),
      });
      if (dup && dup.processingCategoryId !== id) {
        return NextResponse.json(
          { error: `Kategori "${nextName}" sudah ada` },
          { status: 409 }
        );
      }
    }

    const updateData: Partial<typeof processingCategories.$inferInsert> = {};
    if (parsed.data.categoryName !== undefined) {
      updateData.categoryName = parsed.data.categoryName.trim();
    }
    if (
      parsed.data.categoryImageUrl !== undefined &&
      parsed.data.categoryImagePublicId !== undefined
    ) {
      try {
        const promoted = await promoteStagingImageIfNeeded(
          parsed.data.categoryImageUrl.trim(),
          parsed.data.categoryImagePublicId.trim(),
          "category"
        );
        updateData.categoryImageUrl = promoted.url;
        updateData.categoryImagePublicId = promoted.publicId;
      } catch (e) {
        if (e instanceof StagingPromoteError) {
          return NextResponse.json({ error: e.message }, { status: 500 });
        }
        throw e;
      }
    } else {
      if (parsed.data.categoryImageUrl !== undefined) {
        updateData.categoryImageUrl = parsed.data.categoryImageUrl.trim();
      }
      if (parsed.data.categoryImagePublicId !== undefined) {
        updateData.categoryImagePublicId =
          parsed.data.categoryImagePublicId.trim();
      }
    }

    const [updated] = await db
      .update(processingCategories)
      .set(updateData)
      .where(eq(processingCategories.processingCategoryId, id))
      .returning();

    translateAndSaveProcessingCategory(
      {
        processingCategoryId: updated.processingCategoryId,
        categoryName: updated.categoryName,
      },
      { categoryName: existing.categoryName }
    ).catch((err) => console.error("Translation failed:", err));

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
    const existing = await db.query.processingCategories.findFirst({
      where: eq(processingCategories.processingCategoryId, id),
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    const child = await db.query.processingPrices.findFirst({
      where: eq(processingPrices.categoryId, id),
    });
    if (child) {
      return NextResponse.json(
        {
          error:
            "Hapus atau pindahkan dulu pricelist tambahan yang memakai kategori ini",
        },
        { status: 409 }
      );
    }

    await db
      .delete(processingCategories)
      .where(eq(processingCategories.processingCategoryId, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus kategori" },
      { status: 500 }
    );
  }
}
