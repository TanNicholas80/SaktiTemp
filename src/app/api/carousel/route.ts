import { NextResponse } from "next/server";

import { asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { carousel } from "@/db/schema/carousel";

export async function GET() {
  try {
    const carousels = await db.query.carousel.findMany({
      columns: {
        carouselId: true,
        carouselHeading: true,
        carouselSubheading: true,
        carouselDescription: true,
        carouselImageUrl: true,
        carouselOrder: true,
      },
      where: eq(carousel.carouselIsPublished, true),
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
