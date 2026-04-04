import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryPortofolio } from "@/db/schema/category-portofolio";
import { revalidateContentCache } from "@/lib/cache/revalidate";
import { requireAdminApi } from "@/lib/api-auth";
import { slugify } from "@/lib/utils/slug";
import { createCategoryPortofolioSchema } from "@/lib/validations/category-portofolio";
import { translateAndSaveCategoryPortofolio } from "@/lib/translate/entity-translators";
import {
  promoteStagingUrlOnlyIfNeeded,
  StagingPromoteError,
} from "@/lib/server/staging-image";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const categories = await db.query.categoryPortofolio.findMany({
      columns: {
        categoryPortofolioId: true,
        categoryPortofolioName: true,
        categoryPortofolioSlug: true,
        categoryPortofolioIcon: true,
        categoryPortofolioImage: true,
        categoryPortofolioDescription: true,
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
    const parsed = createCategoryPortofolioSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const name = parsed.data.categoryPortofolioName;
    const slug =
      parsed.data.categoryPortofolioSlug?.trim() || slugify(name);

    const existingByName = await db.query.categoryPortofolio.findFirst({
      where: eq(categoryPortofolio.categoryPortofolioName, name),
    });
    if (existingByName) {
      return NextResponse.json(
        { error: "Nama kategori sudah digunakan" },
        { status: 409 }
      );
    }

    const existingBySlug = await db.query.categoryPortofolio.findFirst({
      where: eq(categoryPortofolio.categoryPortofolioSlug, slug),
    });
    if (existingBySlug) {
      return NextResponse.json(
        { error: "Slug sudah digunakan" },
        { status: 409 }
      );
    }

    let categoryPortofolioImage = parsed.data.categoryPortofolioImage ?? "";
    if (categoryPortofolioImage) {
      try {
        categoryPortofolioImage = await promoteStagingUrlOnlyIfNeeded(
          categoryPortofolioImage.trim(),
          "category"
        );
      } catch (e) {
        if (e instanceof StagingPromoteError) {
          return NextResponse.json({ error: e.message }, { status: 500 });
        }
        throw e;
      }
    }

    const [inserted] = await db
      .insert(categoryPortofolio)
      .values({
        categoryPortofolioName: name,
        categoryPortofolioSlug: slug,
        categoryPortofolioIcon: parsed.data.categoryPortofolioIcon ?? "",
        categoryPortofolioImage,
        categoryPortofolioDescription: parsed.data.categoryPortofolioDescription ?? "",
      })
      .returning();

    translateAndSaveCategoryPortofolio(inserted).catch((err) => console.error("Translation failed:", err));

    await revalidateContentCache("portofolio");
    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat kategori" },
      { status: 500 }
    );
  }
}
