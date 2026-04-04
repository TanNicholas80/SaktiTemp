import { NextResponse } from "next/server";

import { and, asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { modification } from "@/db/schema/modification";
import { thickness } from "@/db/schema/thickness";
import { requireAdminApi } from "@/lib/api-auth";
import { translateAndSaveModification } from "@/lib/translate/entity-translators";
import {
  createModificationBatchSchema,
  createModificationSchema,
} from "@/lib/validations/modification";
import {
  promoteStagingImageIfNeeded,
  StagingPromoteError,
} from "@/lib/server/staging-image";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const rows = await db
      .select({
        modificationId: modification.modificationId,
        name: modification.name,
        thicknessId: modification.thicknessId,
        modificationImageUrl: modification.modificationImageUrl,
        modificationImagePublicId: modification.modificationImagePublicId,
        pricePerSide: modification.pricePerSide,
        thicknessValue: thickness.thicknessValue,
        thicknessUnit: thickness.thicknessUnit,
      })
      .from(modification)
      .innerJoin(
        thickness,
        eq(modification.thicknessId, thickness.thicknessId)
      )
      .orderBy(asc(modification.name), asc(thickness.thicknessValue));

    return NextResponse.json(rows);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data modifikasi" },
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

    if (body != null && typeof body === "object" && "rows" in body) {
      const parsed = createModificationBatchSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Validasi gagal", details: parsed.error.flatten() },
          { status: 400 }
        );
      }

      const name = parsed.data.name.trim();
      let imgUrl = parsed.data.modificationImageUrl.trim();
      let imgPid = parsed.data.modificationImagePublicId.trim();
      try {
        const promoted = await promoteStagingImageIfNeeded(
          imgUrl,
          imgPid,
          "category"
        );
        imgUrl = promoted.url;
        imgPid = promoted.publicId;
      } catch (e) {
        if (e instanceof StagingPromoteError) {
          return NextResponse.json({ error: e.message }, { status: 500 });
        }
        throw e;
      }

      for (const row of parsed.data.rows) {
        const duplicate = await db.query.modification.findFirst({
          where: and(
            eq(modification.name, name),
            eq(modification.thicknessId, row.thicknessId)
          ),
        });
        if (duplicate) {
          return NextResponse.json(
            {
              error:
                "Modifikasi dengan nama dan ketebalan yang sama sudah ada",
            },
            { status: 409 }
          );
        }
      }

      const inserted = await db
        .insert(modification)
        .values(
          parsed.data.rows.map((row) => ({
            name,
            thicknessId: row.thicknessId,
            modificationImageUrl: imgUrl,
            modificationImagePublicId: imgPid,
            pricePerSide: row.pricePerSide,
          }))
        )
        .returning();

      for (const ins of inserted) {
        translateAndSaveModification({
          modificationId: ins.modificationId,
          name: ins.name,
        }).catch((err) => console.error("Translation failed:", err));
      }

      return NextResponse.json({ created: inserted.length, items: inserted });
    }

    const parsed = createModificationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const name = parsed.data.name.trim();

    const duplicate = await db.query.modification.findFirst({
      where: and(
        eq(modification.name, name),
        eq(modification.thicknessId, parsed.data.thicknessId)
      ),
    });
    if (duplicate) {
      return NextResponse.json(
        {
          error:
            "Modifikasi dengan nama dan ketebalan yang sama sudah ada",
        },
        { status: 409 }
      );
    }

    let modificationImageUrl = parsed.data.modificationImageUrl.trim();
    let modificationImagePublicId =
      parsed.data.modificationImagePublicId.trim();
    try {
      const promoted = await promoteStagingImageIfNeeded(
        modificationImageUrl,
        modificationImagePublicId,
        "category"
      );
      modificationImageUrl = promoted.url;
      modificationImagePublicId = promoted.publicId;
    } catch (e) {
      if (e instanceof StagingPromoteError) {
        return NextResponse.json({ error: e.message }, { status: 500 });
      }
      throw e;
    }

    const [inserted] = await db
      .insert(modification)
      .values({
        name,
        thicknessId: parsed.data.thicknessId,
        modificationImageUrl,
        modificationImagePublicId,
        pricePerSide: parsed.data.pricePerSide,
      })
      .returning();

    translateAndSaveModification({
      modificationId: inserted.modificationId,
      name: inserted.name,
    }).catch((err) => console.error("Translation failed:", err));

    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat modifikasi" },
      { status: 500 }
    );
  }
}
