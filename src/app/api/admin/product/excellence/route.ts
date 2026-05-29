import { NextResponse } from "next/server";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { product } from "@/db/schema/product";
import { productExellence } from "@/db/schema/product-exellence";
import { revalidateContentCache } from "@/lib/cache/revalidate";
import { translateAndSaveProductExellence } from "@/lib/translate/entity-translators";
import { requireAdminApi } from "@/lib/api-auth";
import { createProductExcellenceSchema } from "@/lib/validations/product-excellence";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const rows = await db
      .select({
        productExellenceId: productExellence.productExellenceId,
        productId: productExellence.productId,
        productExellenceDescription: productExellence.productExellenceDescription,
        createdAt: productExellence.createdAt,
        updatedAt: productExellence.updatedAt,
        productName: product.productName,
      })
      .from(productExellence)
      .leftJoin(product, eq(productExellence.productId, product.productId))
      .orderBy(desc(productExellence.createdAt));

    const list = rows.map((r) => ({
      productExellenceId: r.productExellenceId,
      productId: r.productId,
      productName: r.productName ?? null,
      productExellenceDescription: r.productExellenceDescription,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));

    return NextResponse.json(list);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data keunggulan" },
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
    const parsed = createProductExcellenceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const [inserted] = await db
      .insert(productExellence)
      .values({
        productId: parsed.data.productId,
        productExellenceDescription: parsed.data.productExellenceDescription,
      })
      .returning();

    translateAndSaveProductExellence(inserted).catch((err) =>
      console.error("Translation failed:", err)
    );

    await revalidateContentCache("product");
    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat keunggulan" },
      { status: 500 }
    );
  }
}
