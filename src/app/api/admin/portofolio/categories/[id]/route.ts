import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryPortofolio } from "@/db/schema/category-portofolio";
import { revalidateContentCache } from "@/lib/cache/revalidate";
import { requireAdminApi } from "@/lib/api-auth";
import { slugify } from "@/lib/utils/slug";
import { updateCategoryPortofolioSchema } from "@/lib/validations/category-portofolio";
import { translateAndSaveCategoryPortofolio } from "@/lib/translate/entity-translators";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = updateCategoryPortofolioSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.categoryPortofolio.findFirst({
      where: eq(categoryPortofolio.categoryPortofolioId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    const name =
      parsed.data.categoryPortofolioName ?? existing.categoryPortofolioName;
    const slug =
      parsed.data.categoryPortofolioSlug?.trim() ??
      (parsed.data.categoryPortofolioName
        ? slugify(parsed.data.categoryPortofolioName)
        : existing.categoryPortofolioSlug);

    if (name !== existing.categoryPortofolioName) {
      const existingByName = await db.query.categoryPortofolio.findFirst({
        where: eq(categoryPortofolio.categoryPortofolioName, name),
      });
      if (existingByName) {
        return NextResponse.json(
          { error: "Nama kategori sudah digunakan" },
          { status: 409 }
        );
      }
    }

    if (slug !== existing.categoryPortofolioSlug) {
      const existingBySlug = await db.query.categoryPortofolio.findFirst({
        where: eq(categoryPortofolio.categoryPortofolioSlug, slug),
      });
      if (existingBySlug) {
        return NextResponse.json(
          { error: "Slug sudah digunakan" },
          { status: 409 }
        );
      }
    }

    const updatePayload: Record<string, unknown> = {
      categoryPortofolioName: name,
      categoryPortofolioSlug: slug,
      updatedAt: new Date(),
    };
    if (parsed.data.categoryPortofolioIcon !== undefined)
      updatePayload.categoryPortofolioIcon = parsed.data.categoryPortofolioIcon ?? "";
    if (parsed.data.categoryPortofolioImage !== undefined)
      updatePayload.categoryPortofolioImage = parsed.data.categoryPortofolioImage ?? "";
    if (parsed.data.categoryPortofolioDescription !== undefined)
      updatePayload.categoryPortofolioDescription = parsed.data.categoryPortofolioDescription ?? "";

    const [updated] = await db
      .update(categoryPortofolio)
      .set(updatePayload)
      .where(eq(categoryPortofolio.categoryPortofolioId, id))
      .returning();

    translateAndSaveCategoryPortofolio(updated, {
      categoryPortofolioName: existing.categoryPortofolioName,
      categoryPortofolioDescription: existing.categoryPortofolioDescription,
    }).catch((err) => console.error("Translation failed:", err));

    await revalidateContentCache("portofolio");
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
    const existing = await db.query.categoryPortofolio.findFirst({
      where: eq(categoryPortofolio.categoryPortofolioId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    await db
      .delete(categoryPortofolio)
      .where(eq(categoryPortofolio.categoryPortofolioId, id));

    await revalidateContentCache("portofolio");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus kategori" },
      { status: 500 }
    );
  }
}
