import { NextResponse } from "next/server";

import { and, eq, ne } from "drizzle-orm";

import { db } from "@/db";
import { companyStat } from "@/db/schema/company-stat";
import { requireAdminApi } from "@/lib/api-auth";
import { updateCompanyStatSchema } from "@/lib/validations/company-stat";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const item = await db.query.companyStat.findFirst({
      where: eq(companyStat.companyStatId, id),
    });

    if (!item) {
      return NextResponse.json(
        { error: "Statistik perusahaan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data statistik perusahaan" },
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
    const parsed = updateCompanyStatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.companyStat.findFirst({
      where: eq(companyStat.companyStatId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Statistik perusahaan tidak ditemukan" },
        { status: 404 }
      );
    }

    if (parsed.data.displayOrder !== undefined) {
      const duplicateOrder = await db.query.companyStat.findFirst({
        where: and(
          eq(companyStat.displayOrder, parsed.data.displayOrder),
          ne(companyStat.companyStatId, id)
        ),
      });
      if (duplicateOrder) {
        return NextResponse.json(
          {
            error: "Urutan sudah digunakan",
            details: {
              fieldErrors: {
                displayOrder: [
                  "Urutan harus unik, tidak boleh sama dengan statistik lain",
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

    if (parsed.data.value !== undefined)
      updateData.value = parsed.data.value.trim();
    if (parsed.data.label !== undefined)
      updateData.label = parsed.data.label.trim();
    if (parsed.data.displayOrder !== undefined)
      updateData.displayOrder = parsed.data.displayOrder;
    if (parsed.data.isPublished !== undefined)
      updateData.isPublished = parsed.data.isPublished;

    const [updated] = await db
      .update(companyStat)
      .set(updateData)
      .where(eq(companyStat.companyStatId, id))
      .returning();

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui statistik perusahaan" },
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
    const existing = await db.query.companyStat.findFirst({
      where: eq(companyStat.companyStatId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Statistik perusahaan tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.delete(companyStat).where(eq(companyStat.companyStatId, id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus statistik perusahaan" },
      { status: 500 }
    );
  }
}
