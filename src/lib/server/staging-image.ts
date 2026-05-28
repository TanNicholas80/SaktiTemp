import {
  FINAL_UPLOAD_FOLDERS,
  STAGING_UPLOAD_DIR,
  STAGING_URL_SEGMENT,
  type FinalUploadFolder,
} from "@/lib/constants/admin-upload";
import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase/server-client";

export class StagingPromoteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StagingPromoteError";
  }
}

export function isFinalUploadFolder(
  value: string
): value is FinalUploadFolder {
  return (FINAL_UPLOAD_FOLDERS as readonly string[]).includes(value);
}

/**
 * Mendeteksi URL staging, berlaku untuk URL lokal (/uploads/staging/...)
 * maupun URL Supabase (...supabase.co/.../staging/...).
 */
export function isStagingImageUrl(url: string): boolean {
  return url.includes(STAGING_URL_SEGMENT);
}

function filenameFromUrl(url: string): string {
  const seg = url.split("/").filter(Boolean);
  return seg[seg.length - 1] ?? "";
}

function resolveStagingFilename(url: string, publicId: string): string {
  if (publicId.includes(".")) return publicId;
  const fromUrl = filenameFromUrl(url);
  if (fromUrl) return fromUrl;
  throw new StagingPromoteError("Nama file staging tidak valid");
}

/**
 * Pindahkan file dari folder staging ke folder final di Supabase Storage,
 * lalu kembalikan URL publik final.
 */
export async function promoteStagingImageIfNeeded(
  url: string,
  publicId: string,
  targetFolder: FinalUploadFolder
): Promise<{ url: string; publicId: string }> {
  const trimmedUrl = url.trim();
  const trimmedPid = publicId.trim();
  if (!isStagingImageUrl(trimmedUrl)) {
    return { url: trimmedUrl, publicId: trimmedPid };
  }

  const filename = resolveStagingFilename(trimmedUrl, trimmedPid);
  const srcPath = `${STAGING_UPLOAD_DIR}/${filename}`;
  const destPath = `${targetFolder}/${filename}`;

  const { error: moveError } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .move(srcPath, destPath);

  if (moveError) {
    throw new StagingPromoteError(
      `Gagal mempromosikan gambar: ${moveError.message}`
    );
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(destPath);

  return {
    url: publicUrlData.publicUrl,
    publicId: filename,
  };
}

/**
 * Untuk kolom yang hanya menyimpan URL (tanpa publicId terpisah).
 */
export async function promoteStagingUrlOnlyIfNeeded(
  url: string,
  targetFolder: FinalUploadFolder
): Promise<string> {
  const trimmed = url.trim();
  if (!isStagingImageUrl(trimmed)) return trimmed;

  const filename = filenameFromUrl(trimmed);
  if (!filename) {
    throw new StagingPromoteError("URL gambar staging tidak valid");
  }

  const srcPath = `${STAGING_UPLOAD_DIR}/${filename}`;
  const destPath = `${targetFolder}/${filename}`;

  const { error: moveError } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .move(srcPath, destPath);

  if (moveError) {
    throw new StagingPromoteError(
      `Gagal mempromosikan gambar: ${moveError.message}`
    );
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(destPath);

  return publicUrlData.publicUrl;
}
