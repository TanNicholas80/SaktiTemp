import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { service } from "@/db/schema/service";
import { requireAdminApi } from "@/lib/api-auth";
import { updateServiceSchema } from "@/lib/validations/service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const svc = await db.query.service.findFirst({
      where: eq(service.serviceId, id),
    });

    if (!svc) {
      return NextResponse.json(
        { error: "Layanan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(svc);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data layanan" },
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
    const parsed = updateServiceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.service.findFirst({
      where: eq(service.serviceId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Layanan tidak ditemukan" },
        { status: 404 }
      );
    }

    const updateData: Partial<typeof service.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (parsed.data.serviceName !== undefined)
      updateData.serviceName = parsed.data.serviceName.trim();
    if (parsed.data.serviceDescription !== undefined)
      updateData.serviceDescription = parsed.data.serviceDescription.trim();
    if (parsed.data.serviceIcon !== undefined)
      updateData.serviceIcon = parsed.data.serviceIcon.trim();
    if (parsed.data.serviceIsPublished !== undefined)
      updateData.serviceIsPublished = parsed.data.serviceIsPublished;
    if (parsed.data.servicePoints !== undefined)
      updateData.servicePoints = parsed.data.servicePoints;
    if (parsed.data.serviceBtnText !== undefined)
      updateData.serviceBtnText = parsed.data.serviceBtnText.trim();
    if (parsed.data.serviceBtnLink !== undefined)
      updateData.serviceBtnLink = parsed.data.serviceBtnLink.trim();

    const [updated] = await db
      .update(service)
      .set(updateData)
      .where(eq(service.serviceId, id))
      .returning();

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui layanan" },
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
    const existing = await db.query.service.findFirst({
      where: eq(service.serviceId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Layanan tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.delete(service).where(eq(service.serviceId, id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus layanan" },
      { status: 500 }
    );
  }
}
