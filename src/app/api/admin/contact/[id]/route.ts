import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { contact } from "@/db/schema/contact";
import { requireAdminApi } from "@/lib/api-auth";
import { updateContactSchema } from "@/lib/validations/contact";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const item = await db.query.contact.findFirst({
      where: eq(contact.contactId, id),
    });

    if (!item) {
      return NextResponse.json(
        { error: "Kontak tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data kontak" },
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
    const parsed = updateContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.contact.findFirst({
      where: eq(contact.contactId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Kontak tidak ditemukan" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (parsed.data.contactType !== undefined)
      updateData.contactType = parsed.data.contactType;
    if (parsed.data.contactLabel !== undefined)
      updateData.contactLabel = parsed.data.contactLabel.trim();
    if (parsed.data.contactValue !== undefined)
      updateData.contactValue = parsed.data.contactValue.trim();
    if (parsed.data.contactValueExtra !== undefined)
      updateData.contactValueExtra = parsed.data.contactValueExtra?.trim() ?? null;
    if (parsed.data.contactIcon !== undefined)
      updateData.contactIcon = parsed.data.contactIcon.trim();
    if (parsed.data.isPublished !== undefined)
      updateData.isPublished = parsed.data.isPublished;

    const [updated] = await db
      .update(contact)
      .set(updateData)
      .where(eq(contact.contactId, id))
      .returning();

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui kontak" },
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
    const existing = await db.query.contact.findFirst({
      where: eq(contact.contactId, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Kontak tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.delete(contact).where(eq(contact.contactId, id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus kontak" },
      { status: 500 }
    );
  }
}
