import { NextResponse } from "next/server";

import { asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { carousel } from "@/db/schema/carousel";
import { requireAdminApi } from "@/lib/api-auth";
import { createCarouselSchema } from "@/lib/validations/carousel";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const carousels = await db.query.carousel.findMany({
      columns: {
        carouselId: true,
        carouselHeading: true,
        carouselSubheading: true,
        carouselDescription: true,
        carouselImageUrl: true,
        carouselImagePublicId: true,
        carouselOrder: true,
        carouselIsPublished: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: (c, { asc: ascFn }) => [ascFn(c.carouselOrder)],
    });

    return NextResponse.json(carousels);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data carousel" },
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
    const parsed = createCarouselSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existingWithOrder = await db.query.carousel.findFirst({
      where: eq(carousel.carouselOrder, parsed.data.carouselOrder),
    });
    if (existingWithOrder) {
      return NextResponse.json(
        {
          error: "Urutan sudah digunakan",
          details: {
            fieldErrors: {
              carouselOrder: ["Urutan harus unik, tidak boleh sama dengan slide lain"],
            },
          },
        },
        { status: 400 }
      );
    }

    const [inserted] = await db
      .insert(carousel)
      .values({
        carouselHeading: parsed.data.carouselHeading.trim(),
        carouselSubheading: parsed.data.carouselSubheading.trim(),
        carouselDescription: parsed.data.carouselDescription.trim(),
        carouselImageUrl: parsed.data.carouselImageUrl.trim(),
        carouselImagePublicId: parsed.data.carouselImagePublicId.trim(),
        carouselOrder: parsed.data.carouselOrder,
        carouselIsPublished: parsed.data.carouselIsPublished ?? false,
      })
      .returning();

    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat slide carousel" },
      { status: 500 }
    );
  }
}
