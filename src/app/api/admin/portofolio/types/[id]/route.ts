import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { portofolioType } from "@/db/schema/portofolio-type";
import { requireAdminApi } from "@/lib/api-auth";
import { slugify } from "@/lib/utils/slug";
import { updatePortofolioTypeSchema } from "@/lib/validations/portofolio-type";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = updatePortofolioTypeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.portofolioType.findFirst({
      where: eq(portofolioType.portofolioTypeId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Tipe portofolio tidak ditemukan" },
        { status: 404 }
      );
    }

    const name =
      parsed.data.portofolioTypeName ?? existing.portofolioTypeName;
    const slug = slugify(name);

    if (name !== existing.portofolioTypeName) {
      const existingByName = await db.query.portofolioType.findFirst({
        where: eq(portofolioType.portofolioTypeName, name),
      });
      if (existingByName) {
        return NextResponse.json(
          { error: "Nama tipe sudah digunakan" },
          { status: 409 }
        );
      }
    }

    if (slug !== existing.portofolioTypeSlug) {
      const existingBySlug = await db.query.portofolioType.findFirst({
        where: eq(portofolioType.portofolioTypeSlug, slug),
      });
      if (existingBySlug) {
        return NextResponse.json(
          { error: "Slug sudah digunakan" },
          { status: 409 }
        );
      }
    }

    const [updated] = await db
      .update(portofolioType)
      .set({
        portofolioTypeName: name,
        portofolioTypeSlug: slug,
        updatedAt: new Date(),
      })
      .where(eq(portofolioType.portofolioTypeId, id))
      .returning();

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui tipe portofolio" },
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
    const existing = await db.query.portofolioType.findFirst({
      where: eq(portofolioType.portofolioTypeId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Tipe portofolio tidak ditemukan" },
        { status: 404 }
      );
    }

    await db
      .delete(portofolioType)
      .where(eq(portofolioType.portofolioTypeId, id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus tipe portofolio" },
      { status: 500 }
    );
  }
}
