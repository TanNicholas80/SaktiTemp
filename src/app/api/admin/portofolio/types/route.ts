import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { portofolioType } from "@/db/schema/portofolio-type";
import { requireAdminApi } from "@/lib/api-auth";
import { slugify } from "@/lib/utils/slug";
import { createPortofolioTypeSchema } from "@/lib/validations/portofolio-type";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const types = await db.query.portofolioType.findMany({
      columns: {
        portofolioTypeId: true,
        portofolioTypeName: true,
        portofolioTypeSlug: true,
      },
      orderBy: (t, { asc }) => [asc(t.portofolioTypeName)],
    });

    return NextResponse.json(types);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data tipe portofolio" },
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
    const parsed = createPortofolioTypeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const name = parsed.data.portofolioTypeName;
    const slug = slugify(name);

    const existingByName = await db.query.portofolioType.findFirst({
      where: eq(portofolioType.portofolioTypeName, name),
    });
    if (existingByName) {
      return NextResponse.json(
        { error: "Nama tipe sudah digunakan" },
        { status: 409 }
      );
    }

    const existingBySlug = await db.query.portofolioType.findFirst({
      where: eq(portofolioType.portofolioTypeSlug, slug),
    });
    if (existingBySlug) {
      return NextResponse.json(
        { error: "Slug sudah digunakan" },
        { status: 409 }
      );
    }

    const [inserted] = await db
      .insert(portofolioType)
      .values({
        portofolioTypeName: name,
        portofolioTypeSlug: slug,
      })
      .returning();

    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat tipe portofolio" },
      { status: 500 }
    );
  }
}
