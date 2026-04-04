import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import sharp from "sharp";

import { requireAdminApi } from "@/lib/api-auth";
import {
  ADMIN_IMAGE_ACCEPT_MIME,
  ADMIN_IMAGE_MAX_BYTES,
  FINAL_UPLOAD_FOLDERS,
  STAGING_UPLOAD_DIR,
  type FinalUploadFolder,
} from "@/lib/constants/admin-upload";

const ALLOWED_TYPES = [...ADMIN_IMAGE_ACCEPT_MIME];
const MAX_SIZE = ADMIN_IMAGE_MAX_BYTES; // sebelum optimasi Sharp
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 80;

function parseTargetFolderHint(request: Request): FinalUploadFolder {
  const url = new URL(request.url);
  const folder = url.searchParams.get("folder") ?? "blog";
  return FINAL_UPLOAD_FOLDERS.includes(folder as FinalUploadFolder)
    ? (folder as FinalUploadFolder)
    : "blog";
}

/** Hanya dipakai untuk validasi query; unggahan selalu ke staging. */
export async function POST(request: Request) {
  void parseTargetFolderHint(request);

  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    if (!(ALLOWED_TYPES as readonly string[]).includes(file.type)) {
      return NextResponse.json(
        { error: "Tipe file tidak didukung. Gunakan JPEG, PNG, atau WebP" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 4MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    const optimizedBuffer = await sharp(inputBuffer)
      .resize(MAX_WIDTH, null, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    const filename = `${crypto.randomUUID()}.webp`;
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      STAGING_UPLOAD_DIR
    );
    const filepath = path.join(uploadDir, filename);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(filepath, optimizedBuffer);

    const url = `/uploads/${STAGING_UPLOAD_DIR}/${filename}`;
    const publicId = filename;

    return NextResponse.json({ url, publicId });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengunggah file" },
      { status: 500 }
    );
  }
}

const SAFE_FILENAME = /^[a-zA-Z0-9._-]+\.webp$/;

export async function DELETE(request: Request) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const url = new URL(request.url);
  const publicId = url.searchParams.get("publicId")?.trim();
  if (!publicId || !SAFE_FILENAME.test(publicId)) {
    return NextResponse.json(
      { error: "Parameter publicId tidak valid" },
      { status: 400 }
    );
  }

  const filepath = path.join(
    process.cwd(),
    "public",
    "uploads",
    STAGING_UPLOAD_DIR,
    publicId
  );

  try {
    await unlink(filepath);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const code = err && typeof err === "object" && "code" in err ? (err as { code?: string }).code : undefined;
    if (code === "ENOENT") {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { error: "Gagal menghapus file" },
      { status: 500 }
    );
  }
}
