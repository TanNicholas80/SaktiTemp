import { NextResponse } from "next/server";

import { desc } from "drizzle-orm";

import { db } from "@/db";
import { location } from "@/db/schema/location";
import { requireAdminApi } from "@/lib/api-auth";
import { createLocationSchema } from "@/lib/validations/location";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const locations = await db.query.location.findMany({
      columns: {
        locationId: true,
        locationCity: true,
        locationType: true,
        locationAddress: true,
        locationMapUrl: true,
        locationMapEmbedUrl: true,
        locationIsPublished: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: (l, { desc: descFn }) => [descFn(l.createdAt)],
    });

    return NextResponse.json(locations);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data lokasi" },
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
    const parsed = createLocationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const [inserted] = await db
      .insert(location)
      .values({
        locationCity: parsed.data.locationCity.trim(),
        locationType: parsed.data.locationType,
        locationAddress: parsed.data.locationAddress.trim(),
        locationMapUrl: parsed.data.locationMapUrl.trim(),
        locationMapEmbedUrl: parsed.data.locationMapEmbedUrl.trim(),
        locationIsPublished: parsed.data.locationIsPublished ?? false,
      })
      .returning();

    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat lokasi" },
      { status: 500 }
    );
  }
}
