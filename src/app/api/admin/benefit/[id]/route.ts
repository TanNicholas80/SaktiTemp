import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { revalidateContentCache } from "@/lib/cache/revalidate";
import { db } from "@/db";
import { benefit } from "@/db/schema/benefit";
import { requireAdminApi } from "@/lib/api-auth";
import { updateBenefitSchema } from "@/lib/validations/benefit";
import { translateAndSaveBenefit } from "@/lib/translate/entity-translators";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const b = await db.query.benefit.findFirst({
      where: eq(benefit.benefitId, id),
    });

    if (!b) {
      return NextResponse.json(
        { error: "Keunggulan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(b);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data keunggulan" },
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
    const parsed = updateBenefitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.benefit.findFirst({
      where: eq(benefit.benefitId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Keunggulan tidak ditemukan" },
        { status: 404 }
      );
    }

    const updateData: Partial<typeof benefit.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (parsed.data.benefitName !== undefined)
      updateData.benefitName = parsed.data.benefitName.trim();
    if (parsed.data.benefitDescription !== undefined)
      updateData.benefitDescription = parsed.data.benefitDescription.trim();
    if (parsed.data.benefitIcon !== undefined)
      updateData.benefitIcon = parsed.data.benefitIcon.trim();
    if (parsed.data.benefitIsPublished !== undefined)
      updateData.benefitIsPublished = parsed.data.benefitIsPublished;

    const [updated] = await db
      .update(benefit)
      .set(updateData)
      .where(eq(benefit.benefitId, id))
      .returning();

    translateAndSaveBenefit(updated, {
      benefitName: existing.benefitName,
      benefitDescription: existing.benefitDescription,
    }).catch((err) => console.error("Translation failed:", err));

    await revalidateContentCache("benefit");
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
    const existing = await db.query.benefit.findFirst({
      where: eq(benefit.benefitId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Keunggulan tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.delete(benefit).where(eq(benefit.benefitId, id));

    await revalidateContentCache("benefit");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus keunggulan" },
      { status: 500 }
    );
  }
}
