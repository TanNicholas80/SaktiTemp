import { NextResponse } from "next/server";

import { and, eq, ne } from "drizzle-orm";

import { revalidateContentCache } from "@/lib/cache/revalidate";
import { db } from "@/db";
import { certification } from "@/db/schema/certification";
import { requireAdminApi } from "@/lib/api-auth";
import { updateCertificationSchema } from "@/lib/validations/certification";
import { translateAndSaveCertification } from "@/lib/translate/entity-translators";
import {
  promoteStagingUrlOnlyIfNeeded,
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
    const item = await db.query.certification.findFirst({
      where: eq(certification.certificationId, id),
    });

    if (!item) {
      return NextResponse.json(
        { error: "Sertifikasi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data sertifikasi" },
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
    const parsed = updateCertificationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.certification.findFirst({
      where: eq(certification.certificationId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Sertifikasi tidak ditemukan" },
        { status: 404 }
      );
    }

    if (parsed.data.displayOrder !== undefined) {
      const duplicateOrder = await db.query.certification.findFirst({
        where: and(
          eq(certification.displayOrder, parsed.data.displayOrder),
          ne(certification.certificationId, id)
        ),
      });
      if (duplicateOrder) {
        return NextResponse.json(
          {
            error: "Urutan sudah digunakan",
            details: {
              fieldErrors: {
                displayOrder: [
                  "Urutan harus unik, tidak boleh sama dengan sertifikasi lain",
                ],
              },
            },
          },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (parsed.data.name !== undefined)
      updateData.name = parsed.data.name.trim();
    if (parsed.data.image !== undefined) {
      try {
        updateData.image = await promoteStagingUrlOnlyIfNeeded(
          parsed.data.image.trim(),
          "certification"
        );
      } catch (e) {
        if (e instanceof StagingPromoteError) {
          return NextResponse.json({ error: e.message }, { status: 500 });
        }
        throw e;
      }
    }
    if (parsed.data.displayOrder !== undefined)
      updateData.displayOrder = parsed.data.displayOrder;
    if (parsed.data.isPublished !== undefined)
      updateData.isPublished = parsed.data.isPublished;

    const [updated] = await db
      .update(certification)
      .set(updateData)
      .where(eq(certification.certificationId, id))
      .returning();

    translateAndSaveCertification(updated, {
      name: existing.name,
    }).catch((err) => console.error("Translation failed:", err));

    await revalidateContentCache("certification");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui sertifikasi" },
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
    const existing = await db.query.certification.findFirst({
      where: eq(certification.certificationId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Sertifikasi tidak ditemukan" },
        { status: 404 }
      );
    }

    await db
      .delete(certification)
      .where(eq(certification.certificationId, id));

    await revalidateContentCache("certification");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus sertifikasi" },
      { status: 500 }
    );
  }
}
