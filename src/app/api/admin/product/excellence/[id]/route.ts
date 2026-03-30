import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { productExellence } from "@/db/schema/product-exellence";
import { revalidateContentCache } from "@/lib/cache/revalidate";
import { translateAndSaveProductExellence } from "@/lib/translate/entity-translators";
import { requireAdminApi } from "@/lib/api-auth";
import { updateProductExcellenceSchema } from "@/lib/validations/product-excellence";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = updateProductExcellenceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.productExellence.findFirst({
      where: eq(productExellence.productExellenceId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Keunggulan tidak ditemukan" },
        { status: 404 }
      );
    }

    const updateData: Partial<typeof productExellence.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (parsed.data.productExellenceDescription !== undefined)
      updateData.productExellenceDescription =
        parsed.data.productExellenceDescription;

    const [updated] = await db
      .update(productExellence)
      .set(updateData)
      .where(eq(productExellence.productExellenceId, id))
      .returning();

    translateAndSaveProductExellence(updated, {
      productExellenceDescription: existing.productExellenceDescription,
    }).catch((err) => console.error("Translation failed:", err));

    await revalidateContentCache("product");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui keunggulan" },
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
    const existing = await db.query.productExellence.findFirst({
      where: eq(productExellence.productExellenceId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Keunggulan tidak ditemukan" },
        { status: 404 }
      );
    }

    await db
      .delete(productExellence)
      .where(eq(productExellence.productExellenceId, id));

    await revalidateContentCache("product");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus keunggulan" },
      { status: 500 }
    );
  }
}
