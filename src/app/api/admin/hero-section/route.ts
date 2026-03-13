import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { heroSection } from "@/db/schema/hero-section";
import { requireAdminApi } from "@/lib/api-auth";
import { createHeroSectionSchema } from "@/lib/validations/hero-section";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const items = await db.query.heroSection.findMany();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data hero section" },
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
    const parsed = createHeroSectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.heroSection.findFirst({
      where: eq(heroSection.pageKey, parsed.data.pageKey),
    });
    if (existing) {
      return NextResponse.json(
        {
          error: "Page key sudah digunakan",
          details: {
            fieldErrors: {
              pageKey: ["Page key harus unik"],
            },
          },
        },
        { status: 400 }
      );
    }

    const [inserted] = await db
      .insert(heroSection)
      .values({
        pageKey: parsed.data.pageKey.trim().toLowerCase(),
        preHeading: parsed.data.preHeading?.trim() ?? null,
        mainHeading: parsed.data.mainHeading.trim(),
        subHeading: parsed.data.subHeading.trim(),
        description: parsed.data.description.trim(),
        backgroundImageUrl: parsed.data.backgroundImageUrl.trim(),
        backgroundImagePublicId:
          parsed.data.backgroundImagePublicId?.trim() ?? null,
        breadcrumbItems: parsed.data.breadcrumbItems ?? null,
        scrollIndicatorText:
          parsed.data.scrollIndicatorText?.trim() ?? "SCROLL",
        scrollIndicatorVisible:
          parsed.data.scrollIndicatorVisible ?? true,
        isPublished: parsed.data.isPublished ?? true,
      })
      .returning();

    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat hero section" },
      { status: 500 }
    );
  }
}
