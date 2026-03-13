import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

import { requireAdminApi } from "@/lib/api-auth";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 4 * 1024 * 1024; // 4MB (sebelum optimasi)
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 80;

const UPLOAD_FOLDERS = ["blog", "product", "portofolio", "carousel", "hero", "certification", "category"] as const;
type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

function parseFolder(request: Request): UploadFolder {
  const url = new URL(request.url);
  const folder = url.searchParams.get("folder") ?? "blog";
  return UPLOAD_FOLDERS.includes(folder as UploadFolder)
    ? (folder as UploadFolder)
    : "blog";
}

export async function POST(request: Request) {
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

    if (!ALLOWED_TYPES.includes(file.type)) {
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

    const folder = parseFolder(request);
    const filename = `${crypto.randomUUID()}.webp`;
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      folder
    );
    const filepath = path.join(uploadDir, filename);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(filepath, optimizedBuffer);

    const url = `/uploads/${folder}/${filename}`;
    const publicId = filename;

    return NextResponse.json({ url, publicId });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengunggah file" },
      { status: 500 }
    );
  }
}
