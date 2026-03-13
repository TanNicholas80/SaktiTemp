import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { socialMedia } from "@/db/schema/social-media";
import { requireAdminApi } from "@/lib/api-auth";
import { updateSocialMediaSchema } from "@/lib/validations/social-media";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const item = await db.query.socialMedia.findFirst({
      where: eq(socialMedia.socialMediaId, id),
    });

    if (!item) {
      return NextResponse.json(
        { error: "Media sosial tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data media sosial" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = updateSocialMediaSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.socialMedia.findFirst({
      where: eq(socialMedia.socialMediaId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Media sosial tidak ditemukan" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (parsed.data.platformName !== undefined)
      updateData.platformName = parsed.data.platformName.trim();
    if (parsed.data.profileUrl !== undefined)
      updateData.profileUrl = parsed.data.profileUrl.trim();
    if (parsed.data.iconName !== undefined)
      updateData.iconName = parsed.data.iconName.trim();
    if (parsed.data.isPublished !== undefined)
      updateData.isPublished = parsed.data.isPublished;

    const [updated] = await db
      .update(socialMedia)
      .set(updateData)
      .where(eq(socialMedia.socialMediaId, id))
      .returning();

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui media sosial" },
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
    const existing = await db.query.socialMedia.findFirst({
      where: eq(socialMedia.socialMediaId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Media sosial tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.delete(socialMedia).where(eq(socialMedia.socialMediaId, id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus media sosial" },
      { status: 500 }
    );
  }
}
