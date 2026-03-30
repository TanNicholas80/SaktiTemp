import { NextResponse } from "next/server";

import { asc, eq } from "drizzle-orm";

import { revalidateContentCache } from "@/lib/cache/revalidate";
import { db } from "@/db";
import { companyStat } from "@/db/schema/company-stat";
import { requireAdminApi } from "@/lib/api-auth";
import { createCompanyStatSchema } from "@/lib/validations/company-stat";
import { translateAndSaveCompanyStat } from "@/lib/translate/entity-translators";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const items = await db.query.companyStat.findMany({
      orderBy: (cs, { asc: ascFn }) => [ascFn(cs.displayOrder)],
    });

    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data statistik perusahaan" },
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
    const parsed = createCompanyStatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existingWithOrder = await db.query.companyStat.findFirst({
      where: eq(companyStat.displayOrder, parsed.data.displayOrder),
    });
    if (existingWithOrder) {
      return NextResponse.json(
        {
          error: "Urutan sudah digunakan",
          details: {
            fieldErrors: {
              displayOrder: [
                "Urutan harus unik, tidak boleh sama dengan statistik lain",
              ],
            },
          },
        },
        { status: 400 }
      );
    }

    const [inserted] = await db
      .insert(companyStat)
      .values({
        value: parsed.data.value.trim(),
        label: parsed.data.label.trim(),
        displayOrder: parsed.data.displayOrder,
        isPublished: parsed.data.isPublished ?? true,
      })
      .returning();

    translateAndSaveCompanyStat(inserted).catch((err) => console.error("Translation failed:", err));

    await revalidateContentCache("company-stat");
    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat statistik perusahaan" },
      { status: 500 }
    );
  }
}
