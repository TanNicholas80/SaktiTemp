import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { processingCategories } from "@/db/schema/processing_categories";
import { requireAdminApi } from "@/lib/api-auth";
import { translateAndSaveProcessingCategory } from "@/lib/translate/entity-translators";
import { createProcessingCategorySchema } from "@/lib/validations/processing-categories";
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
    const list = await db.query.processingCategories.findMany({
      columns: {
        processingCategoryId: true,
        categoryName: true,
        categoryImageUrl: true,
        categoryImagePublicId: true,
      },
      orderBy: (t, { asc: a }) => [a(t.categoryName)],
    });

    return NextResponse.json(list);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data kategori proses" },
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
    const parsed = createProcessingCategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const categoryName = parsed.data.categoryName.trim();
    const existing = await db.query.processingCategories.findFirst({
      where: eq(processingCategories.categoryName, categoryName),
    });
    if (existing) {
      return NextResponse.json(
        { error: `Kategori "${categoryName}" sudah ada` },
        { status: 409 }
      );
    }

    let categoryImageUrl = parsed.data.categoryImageUrl.trim();
    let categoryImagePublicId = parsed.data.categoryImagePublicId.trim();
    try {
      const promoted = await promoteStagingImageIfNeeded(
        categoryImageUrl,
        categoryImagePublicId,
        "category"
      );
      categoryImageUrl = promoted.url;
      categoryImagePublicId = promoted.publicId;
    } catch (e) {
      if (e instanceof StagingPromoteError) {
        return NextResponse.json({ error: e.message }, { status: 500 });
      }
      throw e;
    }

    const [inserted] = await db
      .insert(processingCategories)
      .values({
        categoryName,
        categoryImageUrl,
        categoryImagePublicId,
      })
      .returning();

    translateAndSaveProcessingCategory({
      processingCategoryId: inserted.processingCategoryId,
      categoryName: inserted.categoryName,
    }).catch((err) => console.error("Translation failed:", err));

    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat kategori proses" },
      { status: 500 }
    );
  }
}
