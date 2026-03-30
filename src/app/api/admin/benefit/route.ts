import { NextResponse } from "next/server";

import { desc } from "drizzle-orm";

import { revalidateContentCache } from "@/lib/cache/revalidate";
import { db } from "@/db";
import { benefit } from "@/db/schema/benefit";
import { requireAdminApi } from "@/lib/api-auth";
import { createBenefitSchema } from "@/lib/validations/benefit";
import { translateAndSaveBenefit } from "@/lib/translate/entity-translators";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const benefits = await db.query.benefit.findMany({
      columns: {
        benefitId: true,
        benefitName: true,
        benefitDescription: true,
        benefitIcon: true,
        benefitIsPublished: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: (b, { desc: descFn }) => [descFn(b.createdAt)],
    });

    return NextResponse.json(benefits);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data keunggulan" },
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
    const parsed = createBenefitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const [inserted] = await db
      .insert(benefit)
      .values({
        benefitName: parsed.data.benefitName.trim(),
        benefitDescription: parsed.data.benefitDescription.trim(),
        benefitIcon: parsed.data.benefitIcon.trim(),
        benefitIsPublished: parsed.data.benefitIsPublished ?? false,
      })
      .returning();

    translateAndSaveBenefit(inserted).catch((err) => console.error("Translation failed:", err));

    await revalidateContentCache("benefit");
    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat keunggulan" },
      { status: 500 }
    );
  }
}
