import { NextResponse } from "next/server";

import { revalidateContentCache } from "@/lib/cache/revalidate";
import { db } from "@/db";
import { thickness } from "@/db/schema/thickness";
import { requireAdminApi } from "@/lib/api-auth";
import { updateThicknessSchema } from "@/lib/validations/thickness";
import { translateAndSaveThickness } from "@/lib/translate/entity-translators";
import { and, eq } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = updateThicknessSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.thickness.findFirst({
      where: eq(thickness.thicknessId, id),
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Ketebalan tidak ditemukan" },
        { status: 404 }
      );
    }

    if (
      parsed.data.thicknessValue !== undefined &&
      parsed.data.thicknessUnit !== undefined
    ) {
      const duplicate = await db.query.thickness.findFirst({
        where: and(
          eq(thickness.thicknessValue, parsed.data.thicknessValue),
          eq(thickness.thicknessUnit, parsed.data.thicknessUnit)
        ),
      });
      if (duplicate && duplicate.thicknessId !== id) {
        return NextResponse.json(
          {
            error: `Ketebalan ${parsed.data.thicknessValue} ${parsed.data.thicknessUnit} sudah ada`,
          },
          { status: 409 }
        );
      }
    }

    const [updated] = await db
      .update(thickness)
      .set({
        ...(parsed.data.thicknessValue !== undefined && {
          thicknessValue: parsed.data.thicknessValue,
        }),
        ...(parsed.data.thicknessUnit !== undefined && {
          thicknessUnit: parsed.data.thicknessUnit,
        }),
        updatedAt: new Date(),
      })
      .where(eq(thickness.thicknessId, id))
      .returning();

    translateAndSaveThickness(updated, {
      thicknessUnit: existing.thicknessUnit,
    }).catch((err) => console.error("Translation failed:", err));

    await revalidateContentCache("product");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui ketebalan" },
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
    const existing = await db.query.thickness.findFirst({
      where: eq(thickness.thicknessId, id),
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Ketebalan tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.delete(thickness).where(eq(thickness.thicknessId, id));

    await revalidateContentCache("product");
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus ketebalan" },
      { status: 500 }
    );
  }
}
