import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { revalidateContentCache } from "@/lib/cache/revalidate";
import { db } from "@/db";
import { location } from "@/db/schema/location";
import { requireAdminApi } from "@/lib/api-auth";
import { updateLocationSchema } from "@/lib/validations/location";
import { translateAndSaveLocation } from "@/lib/translate/entity-translators";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const loc = await db.query.location.findFirst({
      where: eq(location.locationId, id),
    });

    if (!loc) {
      return NextResponse.json(
        { error: "Lokasi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(loc);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data lokasi" },
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
    const parsed = updateLocationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.location.findFirst({
      where: eq(location.locationId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Lokasi tidak ditemukan" },
        { status: 404 }
      );
    }

    const updateData: Partial<typeof location.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (parsed.data.locationCity !== undefined)
      updateData.locationCity = parsed.data.locationCity.trim();
    if (parsed.data.locationType !== undefined)
      updateData.locationType = parsed.data.locationType;
    if (parsed.data.locationAddress !== undefined)
      updateData.locationAddress = parsed.data.locationAddress.trim();
    if (parsed.data.locationMapUrl !== undefined)
      updateData.locationMapUrl = parsed.data.locationMapUrl.trim();
    if (parsed.data.locationMapEmbedUrl !== undefined)
      updateData.locationMapEmbedUrl = parsed.data.locationMapEmbedUrl.trim();
    if (parsed.data.locationIsPublished !== undefined)
      updateData.locationIsPublished = parsed.data.locationIsPublished;

    const [updated] = await db
      .update(location)
      .set(updateData)
      .where(eq(location.locationId, id))
      .returning();

    translateAndSaveLocation(updated, {
      locationCity: existing.locationCity,
      locationAddress: existing.locationAddress,
    }).catch((err) => console.error("Translation failed:", err));

    await revalidateContentCache("location");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui lokasi" },
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
    const existing = await db.query.location.findFirst({
      where: eq(location.locationId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Lokasi tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.delete(location).where(eq(location.locationId, id));

    await revalidateContentCache("location");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus lokasi" },
      { status: 500 }
    );
  }
}
