import { NextResponse } from "next/server";

import { and, asc, eq, isNull, sql } from "drizzle-orm";

import { db } from "@/db";
import { processingCategories } from "@/db/schema/processing_categories";
import { processingPrices } from "@/db/schema/processing_prices";
import { requireAdminApi } from "@/lib/api-auth";
import { translateAndSaveProcessingPrice } from "@/lib/translate/entity-translators";
import {
  createProcessingPriceBatchSchema,
  createProcessingPriceSchema,
} from "@/lib/validations/processing-prices";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const rows = await db
      .select({
        processingPricesId: processingPrices.processingPricesId,
        categoryId: processingPrices.categoryId,
        thickness: processingPrices.thickness,
        minThickness: processingPrices.minThickness,
        maxThickness: processingPrices.maxThickness,
        serviceName: processingPrices.serviceName,
        unit: processingPrices.unit,
        price: processingPrices.price,
        categoryName: processingCategories.categoryName,
      })
      .from(processingPrices)
      .innerJoin(
        processingCategories,
        eq(processingPrices.categoryId, processingCategories.processingCategoryId)
      )
      .orderBy(
        asc(processingCategories.categoryName),
        asc(
          sql`coalesce(${processingPrices.minThickness}, ${processingPrices.thickness})`
        ),
        asc(processingPrices.serviceName)
      );

    return NextResponse.json(rows);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data pricelist tambahan" },
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

    if (body != null && typeof body === "object" && "rows" in body) {
      const parsed = createProcessingPriceBatchSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Validasi gagal", details: parsed.error.flatten() },
          { status: 400 }
        );
      }

      const serviceName = parsed.data.serviceName.trim();

      for (const row of parsed.data.rows) {
        const duplicate = await db.query.processingPrices.findFirst({
          where: and(
            eq(processingPrices.categoryId, parsed.data.categoryId),
            eq(processingPrices.serviceName, serviceName),
            eq(processingPrices.unit, parsed.data.unit),
            row.mode === "single"
              ? and(
                  eq(processingPrices.thickness, row.thickness!),
                  isNull(processingPrices.minThickness),
                  isNull(processingPrices.maxThickness)
                )
              : and(
                  eq(processingPrices.minThickness, row.minThickness!),
                  eq(processingPrices.maxThickness, row.maxThickness!),
                  isNull(processingPrices.thickness)
                )
          ),
        });
        if (duplicate) {
          return NextResponse.json(
            {
              error:
                "Entri dengan kategori, layanan, dan ketebalan (range/tunggal) yang sama sudah ada",
            },
            { status: 409 }
          );
        }
      }

      const inserted = await db
        .insert(processingPrices)
        .values(
          parsed.data.rows.map((row) => ({
            categoryId: parsed.data.categoryId,
            serviceName,
            unit: parsed.data.unit,
            price: row.price,
            thickness: row.mode === "single" ? row.thickness : null,
            minThickness: row.mode === "range" ? row.minThickness : null,
            maxThickness: row.mode === "range" ? row.maxThickness : null,
          }))
        )
        .returning();

      for (const ins of inserted) {
        translateAndSaveProcessingPrice({
          processingPricesId: ins.processingPricesId,
          serviceName: ins.serviceName,
        }).catch((err) => console.error("Translation failed:", err));
      }

      return NextResponse.json({ created: inserted.length, items: inserted });
    }

    const parsed = createProcessingPriceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const serviceName = parsed.data.serviceName.trim();

    const duplicate = await db.query.processingPrices.findFirst({
      where: and(
        eq(processingPrices.categoryId, parsed.data.categoryId),
        eq(processingPrices.serviceName, serviceName),
        eq(processingPrices.unit, parsed.data.unit),
        parsed.data.mode === "single"
          ? and(
              eq(processingPrices.thickness, parsed.data.thickness!),
              isNull(processingPrices.minThickness),
              isNull(processingPrices.maxThickness)
            )
          : and(
              eq(processingPrices.minThickness, parsed.data.minThickness!),
              eq(processingPrices.maxThickness, parsed.data.maxThickness!),
              isNull(processingPrices.thickness)
            )
      ),
    });
    if (duplicate) {
      return NextResponse.json(
        {
          error:
            "Entri dengan kategori, layanan, dan ketebalan (range/tunggal) yang sama sudah ada",
        },
        { status: 409 }
      );
    }

    const [inserted] = await db
      .insert(processingPrices)
      .values({
        categoryId: parsed.data.categoryId,
        serviceName,
        unit: parsed.data.unit,
        price: parsed.data.price,
        thickness: parsed.data.mode === "single" ? parsed.data.thickness : null,
        minThickness:
          parsed.data.mode === "range" ? parsed.data.minThickness : null,
        maxThickness:
          parsed.data.mode === "range" ? parsed.data.maxThickness : null,
      })
      .returning();

    translateAndSaveProcessingPrice({
      processingPricesId: inserted.processingPricesId,
      serviceName: inserted.serviceName,
    }).catch((err) => console.error("Translation failed:", err));

    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat pricelist tambahan" },
      { status: 500 }
    );
  }
}
