import { NextResponse } from "next/server";

import { asc } from "drizzle-orm";

import { db } from "@/db";
import { socialMedia } from "@/db/schema/social-media";
import { requireAdminApi } from "@/lib/api-auth";
import { createSocialMediaSchema } from "@/lib/validations/social-media";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const items = await db.query.socialMedia.findMany({
      orderBy: (sm, { asc: ascFn }) => [ascFn(sm.createdAt)],
    });

    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data media sosial" },
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
    const parsed = createSocialMediaSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const [inserted] = await db
      .insert(socialMedia)
      .values({
        platformName: parsed.data.platformName.trim(),
        profileUrl: parsed.data.profileUrl.trim(),
        iconName: parsed.data.iconName.trim(),
        isPublished: parsed.data.isPublished ?? true,
      })
      .returning();

    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat media sosial" },
      { status: 500 }
    );
  }
}
