import { NextResponse } from "next/server";

import { asc, eq } from "drizzle-orm";

import { revalidateContentCache } from "@/lib/cache/revalidate";
import { db } from "@/db";
import { certification } from "@/db/schema/certification";
import { requireAdminApi } from "@/lib/api-auth";
import { createCertificationSchema } from "@/lib/validations/certification";
import { translateAndSaveCertification } from "@/lib/translate/entity-translators";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const items = await db.query.certification.findMany({
      orderBy: (c, { asc: ascFn }) => [ascFn(c.displayOrder)],
    });

    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data sertifikasi" },
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
    const parsed = createCertificationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existingWithOrder = await db.query.certification.findFirst({
      where: eq(certification.displayOrder, parsed.data.displayOrder),
    });
    if (existingWithOrder) {
      return NextResponse.json(
        {
          error: "Urutan sudah digunakan",
          details: {
            fieldErrors: {
              displayOrder: [
                "Urutan harus unik, tidak boleh sama dengan sertifikasi lain",
              ],
            },
          },
        },
        { status: 400 }
      );
    }

    const [inserted] = await db
      .insert(certification)
      .values({
        name: parsed.data.name.trim(),
        image: parsed.data.image.trim(),
        displayOrder: parsed.data.displayOrder,
        isPublished: parsed.data.isPublished ?? true,
      })
      .returning();

    translateAndSaveCertification(inserted).catch((err) => console.error("Translation failed:", err));

    await revalidateContentCache("certification");
    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat sertifikasi" },
      { status: 500 }
    );
  }
}
