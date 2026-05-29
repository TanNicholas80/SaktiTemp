import { NextResponse } from "next/server";
import sharp from "sharp";

import { requireBlogCmsApi } from "@/lib/api-auth";
import { isBlogEditorRole } from "@/lib/roles";
import {
  ADMIN_IMAGE_ACCEPT_MIME,
  ADMIN_IMAGE_MAX_BYTES,
  FINAL_UPLOAD_FOLDERS,
  STAGING_UPLOAD_DIR,
  type FinalUploadFolder,
} from "@/lib/constants/admin-upload";
import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase/server-client";

const ALLOWED_TYPES = [...ADMIN_IMAGE_ACCEPT_MIME];
const MAX_SIZE = ADMIN_IMAGE_MAX_BYTES;
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 80;

function parseTargetFolderHint(request: Request): FinalUploadFolder {
  const url = new URL(request.url);
  const folder = url.searchParams.get("folder") ?? "blog";
  return FINAL_UPLOAD_FOLDERS.includes(folder as FinalUploadFolder)
    ? (folder as FinalUploadFolder)
    : "blog";
}

/** Upload selalu ke folder staging di Supabase Storage. */
export async function POST(request: Request) {
  const auth = await requireBlogCmsApi();
  if (auth.error || !auth.session) {
    return NextResponse.json(
      { error: auth.error ?? "Unauthorized" },
      { status: auth.status ?? 401 }
    );
  }

  const folderHint = parseTargetFolderHint(request);
  if (
    isBlogEditorRole(auth.session.user.role) &&
    folderHint !== "blog"
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
    const storagePath = `${STAGING_UPLOAD_DIR}/${filename}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, optimizedBuffer, {
        contentType: "image/webp",
        upsert: false,
      });

    if (uploadError) {
      console.error("[upload/route] Supabase upload error:", uploadError);
      const hint =
        uploadError.message?.toLowerCase().includes("bucket") ||
        uploadError.message?.toLowerCase().includes("invalid")
          ? " Periksa SUPABASE_STORAGE_BUCKET di env (nama bucket harus sama persis dengan Supabase, tanpa spasi)."
          : "";
      return NextResponse.json(
        { error: `Gagal mengunggah file ke storage: ${uploadError.message}.${hint}` },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    return NextResponse.json({ url: publicUrlData.publicUrl, publicId: filename });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengunggah file" },
      { status: 500 }
    );
  }
}

const SAFE_FILENAME = /^[a-zA-Z0-9._-]+\.webp$/;

export async function DELETE(request: Request) {
  const auth = await requireBlogCmsApi();
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

  const storagePath = `${STAGING_UPLOAD_DIR}/${publicId}`;

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .remove([storagePath]);

  if (error) {
    // Jika file tidak ditemukan, anggap sukses (idempotent)
    if (error.message?.toLowerCase().includes("not found")) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { error: "Gagal menghapus file" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
