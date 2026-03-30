import { NextResponse } from "next/server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { glassPrices } from "@/db/schema/glass_prices";
import { requireAdminApi } from "@/lib/api-auth";
import { translateAndSaveGlassPrice } from "@/lib/translate/entity-translators";
import { updateGlassPriceSchema } from "@/lib/validations/glass-prices";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const existing = await db.query.glassPrices.findFirst({
      where: eq(glassPrices.glassPricesId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Pricelist kaca tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(existing);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data pricelist kaca" },
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
    const parsed = updateGlassPriceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.glassPrices.findFirst({
      where: eq(glassPrices.glassPricesId, id),
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Pricelist kaca tidak ditemukan" },
        { status: 404 }
      );
    }

    const nextGlassTypeId = parsed.data.glassTypeId ?? existing.glassTypeId;
    const nextThicknessId = parsed.data.thicknessId ?? existing.thicknessId;
    const nextVariant = (parsed.data.variant ?? existing.variant).trim();

    const duplicate = await db.query.glassPrices.findFirst({
      where: and(
        eq(glassPrices.glassTypeId, nextGlassTypeId),
        eq(glassPrices.thicknessId, nextThicknessId),
        eq(glassPrices.variant, nextVariant)
      ),
    });
    if (duplicate && duplicate.glassPricesId !== id) {
      return NextResponse.json(
        { error: "Pricelist untuk kombinasi tipe+ketebalan+variant tersebut sudah ada" },
        { status: 409 }
      );
    }

    const updateData: Partial<typeof glassPrices.$inferInsert> = {
      ...(parsed.data.glassTypeId !== undefined && {
        glassTypeId: parsed.data.glassTypeId,
      }),
      ...(parsed.data.thicknessId !== undefined && {
        thicknessId: parsed.data.thicknessId,
      }),
      ...(parsed.data.variant !== undefined && {
        variant: parsed.data.variant.trim(),
      }),
      ...(parsed.data.variantImageUrl !== undefined && {
        variantImageUrl: parsed.data.variantImageUrl.trim(),
      }),
      ...(parsed.data.variantImagePublicId !== undefined && {
        variantImagePublicId: parsed.data.variantImagePublicId.trim(),
      }),
      ...(parsed.data.composition !== undefined && {
        composition: parsed.data.composition,
      }),
      ...(parsed.data.compositionDetail !== undefined && {
        compositionDetail: parsed.data.compositionDetail,
      }),
      ...(parsed.data.pricePerSqm !== undefined && {
        pricePerSqm: parsed.data.pricePerSqm,
      }),
    };

    const [updated] = await db
      .update(glassPrices)
      .set(updateData)
      .where(eq(glassPrices.glassPricesId, id))
      .returning();

    translateAndSaveGlassPrice(updated, {
      variant: existing.variant,
    }).catch((err) => console.error("Translation failed:", err));

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui pricelist kaca" },
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
    const existing = await db.query.glassPrices.findFirst({
      where: eq(glassPrices.glassPricesId, id),
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Pricelist kaca tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.delete(glassPrices).where(eq(glassPrices.glassPricesId, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus pricelist kaca" },
      { status: 500 }
    );
  }
}

