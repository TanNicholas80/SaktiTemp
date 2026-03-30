import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { revalidateContentCache } from "@/lib/cache/revalidate";
import { translateAndSaveProductApplication } from "@/lib/translate/entity-translators";
import { db } from "@/db";
import { productApplication } from "@/db/schema/product-application";
import { product } from "@/db/schema/product";
import { requireAdminApi } from "@/lib/api-auth";
import { slugify } from "@/lib/utils/slug";
import { createProductApplicationSchema } from "@/lib/validations/product-application";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const rows = await db
      .select({
        productApplicationId: productApplication.productApplicationId,
        productApplicationName: productApplication.productApplicationName,
        productApplicationSlug: productApplication.productApplicationSlug,
        productApplicationIsPublished: productApplication.productApplicationIsPublished,
        productId: productApplication.productId,
        productName: product.productName,
      })
      .from(productApplication)
      .leftJoin(product, eq(productApplication.productId, product.productId))
      .orderBy(productApplication.productApplicationName);

    const list = rows.map((r) => ({
      productApplicationId: r.productApplicationId,
      productApplicationName: r.productApplicationName,
      productApplicationSlug: r.productApplicationSlug,
      productApplicationIsPublished: r.productApplicationIsPublished,
      productId: r.productId,
      productName: r.productName ?? null,
    }));

    return NextResponse.json(list);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data aplikasi produk" },
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
    const parsed = createProductApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const slug = slugify(parsed.data.productApplicationName);
    const existingSlug = await db.query.productApplication.findFirst({
      where: eq(productApplication.productApplicationSlug, slug),
    });
    if (existingSlug) {
      return NextResponse.json(
        { error: "Slug sudah digunakan" },
        { status: 409 }
      );
    }

    const [inserted] = await db
      .insert(productApplication)
      .values({
        productApplicationName: parsed.data.productApplicationName.trim(),
        productApplicationSlug: slug,
        productApplicationDescription: parsed.data.productApplicationDescription,
        productApplicationImageUrl: parsed.data.productApplicationImageUrl,
        productApplicationImagePublicId: parsed.data.productApplicationImagePublicId,
        productId: parsed.data.productId ?? null,
        productApplicationIsPublished:
          parsed.data.productApplicationIsPublished ?? false,
      })
      .returning();

    if (!inserted) {
      return NextResponse.json(
        { error: "Gagal membuat aplikasi produk" },
        { status: 500 }
      );
    }

    translateAndSaveProductApplication(inserted).catch((err) =>
      console.error("Translation failed:", err)
    );

    await revalidateContentCache("product");
    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat aplikasi produk" },
      { status: 500 }
    );
  }
}
