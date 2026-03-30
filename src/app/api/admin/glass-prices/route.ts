import { NextResponse } from "next/server";

import { and, asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { glassPrices } from "@/db/schema/glass_prices";
import { glassTypes } from "@/db/schema/glass_types";
import { thickness } from "@/db/schema/thickness";
import { requireAdminApi } from "@/lib/api-auth";
import { translateAndSaveGlassPrice } from "@/lib/translate/entity-translators";
import {
  createGlassPriceBatchSchema,
  createGlassPriceSchema,
} from "@/lib/validations/glass-prices";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const rows = await db
      .select({
        glassPricesId: glassPrices.glassPricesId,
        glassTypeId: glassPrices.glassTypeId,
        thicknessId: glassPrices.thicknessId,
        variant: glassPrices.variant,
        variantImageUrl: glassPrices.variantImageUrl,
        variantImagePublicId: glassPrices.variantImagePublicId,
        composition: glassPrices.composition,
        compositionDetail: glassPrices.compositionDetail,
        pricePerSqm: glassPrices.pricePerSqm,
        glassTypeName: glassTypes.glassTypeName,
        thicknessValue: thickness.thicknessValue,
        thicknessUnit: thickness.thicknessUnit,
      })
      .from(glassPrices)
      .innerJoin(glassTypes, eq(glassPrices.glassTypeId, glassTypes.glassTypeId))
      .innerJoin(thickness, eq(glassPrices.thicknessId, thickness.thicknessId))
      .orderBy(asc(glassTypes.glassTypeName), asc(thickness.thicknessValue), asc(glassPrices.variant));

    return NextResponse.json(rows);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data pricelist kaca" },
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
      const parsed = createGlassPriceBatchSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Validasi gagal", details: parsed.error.flatten() },
          { status: 400 }
        );
      }

      const variant = parsed.data.variant.trim();
      const vUrl = parsed.data.variantImageUrl.trim();
      const vPid = parsed.data.variantImagePublicId.trim();

      for (const row of parsed.data.rows) {
        const duplicate = await db.query.glassPrices.findFirst({
          where: and(
            eq(glassPrices.glassTypeId, parsed.data.glassTypeId),
            eq(glassPrices.thicknessId, row.thicknessId),
            eq(glassPrices.variant, variant)
          ),
        });
        if (duplicate) {
          return NextResponse.json(
            {
              error:
                "Pricelist untuk kombinasi tipe+ketebalan+variant tersebut sudah ada",
            },
            { status: 409 }
          );
        }
      }

      const inserted = await db
        .insert(glassPrices)
        .values(
          parsed.data.rows.map((row) => ({
            glassTypeId: parsed.data.glassTypeId,
            thicknessId: row.thicknessId,
            variant,
            variantImageUrl: vUrl,
            variantImagePublicId: vPid,
            composition: row.composition,
            compositionDetail: row.compositionDetail,
            pricePerSqm: row.pricePerSqm,
          }))
        )
        .returning();

      for (const ins of inserted) {
        translateAndSaveGlassPrice(ins).catch((err) =>
          console.error("Translation failed:", err)
        );
      }

      return NextResponse.json({ created: inserted.length, items: inserted });
    }

    const parsed = createGlassPriceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const variant = parsed.data.variant.trim();

    const duplicate = await db.query.glassPrices.findFirst({
      where: and(
        eq(glassPrices.glassTypeId, parsed.data.glassTypeId),
        eq(glassPrices.thicknessId, parsed.data.thicknessId),
        eq(glassPrices.variant, variant)
      ),
    });
    if (duplicate) {
      return NextResponse.json(
        {
          error:
            "Pricelist untuk kombinasi tipe+ketebalan+variant tersebut sudah ada",
        },
        { status: 409 }
      );
    }

    const [inserted] = await db
      .insert(glassPrices)
      .values({
        glassTypeId: parsed.data.glassTypeId,
        thicknessId: parsed.data.thicknessId,
        variant,
        variantImageUrl: parsed.data.variantImageUrl.trim(),
        variantImagePublicId: parsed.data.variantImagePublicId.trim(),
        composition: parsed.data.composition,
        compositionDetail: parsed.data.compositionDetail,
        pricePerSqm: parsed.data.pricePerSqm,
      })
      .returning();

    translateAndSaveGlassPrice(inserted).catch((err) =>
      console.error("Translation failed:", err)
    );

    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat pricelist kaca" },
      { status: 500 }
    );
  }
}
