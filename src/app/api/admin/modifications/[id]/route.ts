import { NextResponse } from "next/server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { modification } from "@/db/schema/modification";
import { requireAdminApi } from "@/lib/api-auth";
import { translateAndSaveModification } from "@/lib/translate/entity-translators";
import { updateModificationSchema } from "@/lib/validations/modification";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const existing = await db.query.modification.findFirst({
      where: eq(modification.modificationId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Modifikasi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(existing);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data modifikasi" },
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
    const parsed = updateModificationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.modification.findFirst({
      where: eq(modification.modificationId, id),
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Modifikasi tidak ditemukan" },
        { status: 404 }
      );
    }

    const nextName = (parsed.data.name ?? existing.name).trim();
    const nextThicknessId =
      parsed.data.thicknessId ?? existing.thicknessId;

    const dup = await db.query.modification.findFirst({
      where: and(
        eq(modification.name, nextName),
        eq(modification.thicknessId, nextThicknessId)
      ),
    });
    if (dup && dup.modificationId !== id) {
      return NextResponse.json(
        {
          error:
            "Modifikasi dengan nama dan ketebalan yang sama sudah ada",
        },
        { status: 409 }
      );
    }

    const updateData: Partial<typeof modification.$inferInsert> = {};
    if (parsed.data.name !== undefined) updateData.name = nextName;
    if (parsed.data.thicknessId !== undefined) {
      updateData.thicknessId = parsed.data.thicknessId;
    }
    if (parsed.data.modificationImageUrl !== undefined) {
      updateData.modificationImageUrl =
        parsed.data.modificationImageUrl.trim();
    }
    if (parsed.data.modificationImagePublicId !== undefined) {
      updateData.modificationImagePublicId =
        parsed.data.modificationImagePublicId.trim();
    }
    if (parsed.data.pricePerSide !== undefined) {
      updateData.pricePerSide = parsed.data.pricePerSide;
    }

    const [updated] = await db
      .update(modification)
      .set(updateData)
      .where(eq(modification.modificationId, id))
      .returning();

    translateAndSaveModification(
      {
        modificationId: updated.modificationId,
        name: updated.name,
      },
      { name: existing.name }
    ).catch((err) => console.error("Translation failed:", err));

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui modifikasi" },
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
    const existing = await db.query.modification.findFirst({
      where: eq(modification.modificationId, id),
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Modifikasi tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.delete(modification).where(eq(modification.modificationId, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus modifikasi" },
      { status: 500 }
    );
  }
}
