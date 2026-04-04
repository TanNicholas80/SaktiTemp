import { NextResponse } from "next/server";

import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import { processingPrices } from "@/db/schema/processing_prices";
import { requireAdminApi } from "@/lib/api-auth";
import { translateAndSaveProcessingPrice } from "@/lib/translate/entity-translators";
import { updateProcessingPriceSchema } from "@/lib/validations/processing-prices";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const existing = await db.query.processingPrices.findFirst({
      where: eq(processingPrices.processingPricesId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Pricelist tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(existing);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data pricelist" },
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
    const parsed = updateProcessingPriceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.processingPrices.findFirst({
      where: eq(processingPrices.processingPricesId, id),
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Pricelist tidak ditemukan" },
        { status: 404 }
      );
    }

    const nextMode =
      parsed.data.mode ??
      (existing.thickness != null ? "single" : "range");

    const nextCategoryId = parsed.data.categoryId ?? existing.categoryId;
    const nextThickness = parsed.data.thickness ?? existing.thickness;
    const nextMin = parsed.data.minThickness ?? existing.minThickness;
    const nextMax = parsed.data.maxThickness ?? existing.maxThickness;
    const nextService = (
      parsed.data.serviceName ?? existing.serviceName
    ).trim();
    const nextUnit = parsed.data.unit ?? existing.unit;

    if (nextMode === "single" && typeof nextThickness !== "number") {
      return NextResponse.json(
        { error: "Ketebalan tunggal tidak valid" },
        { status: 400 }
      );
    }
    if (
      nextMode === "range" &&
      (typeof nextMin !== "number" || typeof nextMax !== "number")
    ) {
      return NextResponse.json(
        { error: "Range ketebalan tidak valid" },
        { status: 400 }
      );
    }

    const duplicate = await db.query.processingPrices.findFirst({
      where: and(
        eq(processingPrices.categoryId, nextCategoryId),
        eq(processingPrices.serviceName, nextService),
        eq(processingPrices.unit, nextUnit),
        nextMode === "single"
          ? and(
              eq(processingPrices.thickness, nextThickness!),
              isNull(processingPrices.minThickness),
              isNull(processingPrices.maxThickness)
            )
          : and(
              eq(processingPrices.minThickness, nextMin!),
              eq(processingPrices.maxThickness, nextMax!),
              isNull(processingPrices.thickness)
            )
      ),
    });
    if (duplicate && duplicate.processingPricesId !== id) {
      return NextResponse.json(
        {
          error:
            "Entri dengan kategori, layanan, range ketebalan, dan satuan yang sama sudah ada",
        },
        { status: 409 }
      );
    }

    const updateData: Partial<typeof processingPrices.$inferInsert> = {};
    if (parsed.data.categoryId !== undefined) {
      updateData.categoryId = parsed.data.categoryId;
    }
    if (parsed.data.serviceName !== undefined) {
      updateData.serviceName = nextService;
    }
    if (parsed.data.unit !== undefined) {
      updateData.unit = parsed.data.unit;
    }
    if (parsed.data.price !== undefined) {
      updateData.price = parsed.data.price;
    }

    // Set kolom ketebalan sesuai mode yang dipakai
    updateData.thickness = nextMode === "single" ? nextThickness : null;
    updateData.minThickness = nextMode === "range" ? nextMin : null;
    updateData.maxThickness = nextMode === "range" ? nextMax : null;

    const [updated] = await db
      .update(processingPrices)
      .set(updateData)
      .where(eq(processingPrices.processingPricesId, id))
      .returning();

    translateAndSaveProcessingPrice(
      {
        processingPricesId: updated.processingPricesId,
        serviceName: updated.serviceName,
      },
      { serviceName: existing.serviceName }
    ).catch((err) => console.error("Translation failed:", err));

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui pricelist" },
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
    const existing = await db.query.processingPrices.findFirst({
      where: eq(processingPrices.processingPricesId, id),
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Pricelist tidak ditemukan" },
        { status: 404 }
      );
    }

    await db
      .delete(processingPrices)
      .where(eq(processingPrices.processingPricesId, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus pricelist" },
      { status: 500 }
    );
  }
}
