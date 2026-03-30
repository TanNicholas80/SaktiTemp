import { NextResponse } from "next/server";

import { revalidateContentCache } from "@/lib/cache/revalidate";
import { db } from "@/db";
import { thickness } from "@/db/schema/thickness";
import { requireAdminApi } from "@/lib/api-auth";
import { createThicknessSchema } from "@/lib/validations/thickness";
import { translateAndSaveThickness } from "@/lib/translate/entity-translators";
import { and, eq } from "drizzle-orm";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const list = await db.query.thickness.findMany({
      columns: {
        thicknessId: true,
        thicknessValue: true,
        thicknessUnit: true,
      },
      orderBy: (t, { asc }) => [asc(t.thicknessValue)],
    });

    return NextResponse.json(list);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data ketebalan" },
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
    const parsed = createThicknessSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.thickness.findFirst({
      where: and(
        eq(thickness.thicknessValue, parsed.data.thicknessValue),
        eq(thickness.thicknessUnit, parsed.data.thicknessUnit)
      ),
    });
    if (existing) {
      return NextResponse.json(
        { error: `Ketebalan ${parsed.data.thicknessValue} ${parsed.data.thicknessUnit} sudah ada` },
        { status: 409 }
      );
    }

    const [inserted] = await db
      .insert(thickness)
      .values({
        thicknessValue: parsed.data.thicknessValue,
        thicknessUnit: parsed.data.thicknessUnit,
      })
      .returning();

    translateAndSaveThickness(inserted).catch((err) => console.error("Translation failed:", err));

    await revalidateContentCache("product");
    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat ketebalan" },
      { status: 500 }
    );
  }
}
