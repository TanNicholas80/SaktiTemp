import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { glassTypes } from "@/db/schema/glass_types";
import { requireAdminApi } from "@/lib/api-auth";
import { translateAndSaveGlassType } from "@/lib/translate/entity-translators";
import { updateGlassTypeSchema } from "@/lib/validations/glass-types";
import {
  promoteStagingImageIfNeeded,
  StagingPromoteError,
} from "@/lib/server/staging-image";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const existing = await db.query.glassTypes.findFirst({
      where: eq(glassTypes.glassTypeId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Tipe kaca tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(existing);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data tipe kaca" },
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
    const parsed = updateGlassTypeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.glassTypes.findFirst({
      where: eq(glassTypes.glassTypeId, id),
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Tipe kaca tidak ditemukan" },
        { status: 404 }
      );
    }

    const updateData: Partial<typeof glassTypes.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (parsed.data.glassTypeName !== undefined) {
      updateData.glassTypeName = parsed.data.glassTypeName.trim();
    }
    if (
      parsed.data.glassTypeImageUrl !== undefined &&
      parsed.data.glassTypeImagePublicId !== undefined
    ) {
      try {
        const promoted = await promoteStagingImageIfNeeded(
          parsed.data.glassTypeImageUrl.trim(),
          parsed.data.glassTypeImagePublicId.trim(),
          "category"
        );
        updateData.glassTypeImageUrl = promoted.url;
        updateData.glassTypeImagePublicId = promoted.publicId;
      } catch (e) {
        if (e instanceof StagingPromoteError) {
          return NextResponse.json({ error: e.message }, { status: 500 });
        }
        throw e;
      }
    } else {
      if (parsed.data.glassTypeImageUrl !== undefined) {
        updateData.glassTypeImageUrl = parsed.data.glassTypeImageUrl.trim();
      }
      if (parsed.data.glassTypeImagePublicId !== undefined) {
        updateData.glassTypeImagePublicId =
          parsed.data.glassTypeImagePublicId.trim();
      }
    }

    const [updated] = await db
      .update(glassTypes)
      .set(updateData)
      .where(eq(glassTypes.glassTypeId, id))
      .returning();

    translateAndSaveGlassType(updated, {
      glassTypeName: existing.glassTypeName,
    }).catch((err) => console.error("Translation failed:", err));

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui tipe kaca" },
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
    const existing = await db.query.glassTypes.findFirst({
      where: eq(glassTypes.glassTypeId, id),
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Tipe kaca tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.delete(glassTypes).where(eq(glassTypes.glassTypeId, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus tipe kaca" },
      { status: 500 }
    );
  }
}

