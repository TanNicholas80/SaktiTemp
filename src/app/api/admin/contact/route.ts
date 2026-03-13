import { NextResponse } from "next/server";

import { asc } from "drizzle-orm";

import { db } from "@/db";
import { contact } from "@/db/schema/contact";
import { requireAdminApi } from "@/lib/api-auth";
import { createContactSchema } from "@/lib/validations/contact";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const items = await db.query.contact.findMany({
      orderBy: (c, { asc: ascFn }) => [ascFn(c.createdAt)],
    });

    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data kontak" },
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
    const parsed = createContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const [inserted] = await db
      .insert(contact)
      .values({
        contactType: parsed.data.contactType,
        contactLabel: parsed.data.contactLabel.trim(),
        contactValue: parsed.data.contactValue.trim(),
        contactValueExtra: parsed.data.contactValueExtra?.trim() ?? null,
        contactIcon: parsed.data.contactIcon.trim(),
        isPublished: parsed.data.isPublished ?? true,
      })
      .returning();

    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat kontak" },
      { status: 500 }
    );
  }
}
