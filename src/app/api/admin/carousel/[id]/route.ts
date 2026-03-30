import { NextResponse } from "next/server";

import { and, eq, ne } from "drizzle-orm";

import { db } from "@/db";
import { carousel } from "@/db/schema/carousel";
import { revalidateContentCache } from "@/lib/cache/revalidate";
import { requireAdminApi } from "@/lib/api-auth";
import { updateCarouselSchema } from "@/lib/validations/carousel";
import { translateAndSaveCarousel } from "@/lib/translate/entity-translators";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const c = await db.query.carousel.findFirst({
      where: eq(carousel.carouselId, id),
    });

    if (!c) {
      return NextResponse.json(
        { error: "Slide carousel tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(c);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data carousel" },
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
    const parsed = updateCarouselSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.carousel.findFirst({
      where: eq(carousel.carouselId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Slide carousel tidak ditemukan" },
        { status: 404 }
      );
    }

    if (parsed.data.carouselOrder !== undefined) {
      const duplicateOrder = await db.query.carousel.findFirst({
        where: and(
          eq(carousel.carouselOrder, parsed.data.carouselOrder),
          ne(carousel.carouselId, id)
        ),
      });
      if (duplicateOrder) {
        return NextResponse.json(
          {
            error: "Urutan sudah digunakan",
            details: {
              fieldErrors: {
                carouselOrder: [
                  "Urutan harus unik, tidak boleh sama dengan slide lain",
                ],
              },
            },
          },
          { status: 400 }
        );
      }
    }

    const updateData: Partial<typeof carousel.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (parsed.data.carouselHeading !== undefined)
      updateData.carouselHeading = parsed.data.carouselHeading.trim();
    if (parsed.data.carouselSubheading !== undefined)
      updateData.carouselSubheading = parsed.data.carouselSubheading.trim();
    if (parsed.data.carouselDescription !== undefined)
      updateData.carouselDescription = parsed.data.carouselDescription.trim();
    if (parsed.data.carouselImageUrl !== undefined)
      updateData.carouselImageUrl = parsed.data.carouselImageUrl.trim();
    if (parsed.data.carouselImagePublicId !== undefined)
      updateData.carouselImagePublicId =
        parsed.data.carouselImagePublicId.trim();
    if (parsed.data.carouselOrder !== undefined)
      updateData.carouselOrder = parsed.data.carouselOrder;
    if (parsed.data.carouselIsPublished !== undefined)
      updateData.carouselIsPublished = parsed.data.carouselIsPublished;

    const [updated] = await db
      .update(carousel)
      .set(updateData)
      .where(eq(carousel.carouselId, id))
      .returning();

    translateAndSaveCarousel(updated, {
      carouselHeading: existing.carouselHeading,
      carouselSubheading: existing.carouselSubheading,
      carouselDescription: existing.carouselDescription,
    }).catch((err) => console.error("Translation failed:", err));

    await revalidateContentCache("carousel");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui carousel" },
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
    const existing = await db.query.carousel.findFirst({
      where: eq(carousel.carouselId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Slide carousel tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.delete(carousel).where(eq(carousel.carouselId, id));

    await revalidateContentCache("carousel");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus carousel" },
      { status: 500 }
    );
  }
}
