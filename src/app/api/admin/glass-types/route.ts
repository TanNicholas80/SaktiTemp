import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { glassTypes } from "@/db/schema/glass_types";
import { requireAdminApi } from "@/lib/api-auth";
import { translateAndSaveGlassType } from "@/lib/translate/entity-translators";
import { createGlassTypeSchema } from "@/lib/validations/glass-types";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const list = await db.query.glassTypes.findMany({
      columns: {
        glassTypeId: true,
        glassTypeName: true,
        glassTypeImageUrl: true,
        glassTypeImagePublicId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: (t, { asc }) => [asc(t.glassTypeName)],
    });

    return NextResponse.json(list);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data tipe kaca" },
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
    const parsed = createGlassTypeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const name = parsed.data.glassTypeName.trim();
    const existing = await db.query.glassTypes.findFirst({
      where: eq(glassTypes.glassTypeName, name),
    });
    if (existing) {
      return NextResponse.json(
        { error: `Tipe kaca "${name}" sudah ada` },
        { status: 409 }
      );
    }

    const [inserted] = await db
      .insert(glassTypes)
      .values({
        glassTypeName: name,
        glassTypeImageUrl: parsed.data.glassTypeImageUrl.trim(),
        glassTypeImagePublicId: parsed.data.glassTypeImagePublicId.trim(),
      })
      .returning();

    translateAndSaveGlassType(inserted).catch((err) =>
      console.error("Translation failed:", err)
    );

    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat tipe kaca" },
      { status: 500 }
    );
  }
}

