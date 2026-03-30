import { NextResponse } from "next/server";

import { desc } from "drizzle-orm";

import { revalidateContentCache } from "@/lib/cache/revalidate";
import { db } from "@/db";
import { service } from "@/db/schema/service";
import { requireAdminApi } from "@/lib/api-auth";
import { createServiceSchema } from "@/lib/validations/service";
import { translateAndSaveService } from "@/lib/translate/entity-translators";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const services = await db.query.service.findMany({
      columns: {
        serviceId: true,
        serviceName: true,
        serviceDescription: true,
        serviceIcon: true,
        serviceIsPublished: true,
        servicePoints: true,
        serviceBtnText: true,
        serviceBtnLink: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: (s, { desc: descFn }) => [descFn(s.createdAt)],
    });

    return NextResponse.json(services);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data layanan" },
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
    const parsed = createServiceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const [inserted] = await db
      .insert(service)
      .values({
        serviceName: parsed.data.serviceName.trim(),
        serviceDescription: parsed.data.serviceDescription.trim(),
        serviceIcon: parsed.data.serviceIcon.trim(),
        serviceIsPublished: parsed.data.serviceIsPublished ?? false,
        servicePoints: parsed.data.servicePoints ?? [],
        serviceBtnText: parsed.data.serviceBtnText.trim(),
        serviceBtnLink: parsed.data.serviceBtnLink.trim(),
      })
      .returning();

    translateAndSaveService(inserted).catch((err) => console.error("Translation failed:", err));

    await revalidateContentCache("service");
    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat layanan" },
      { status: 500 }
    );
  }
}
