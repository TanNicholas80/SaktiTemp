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

function publicUrlForPath(path: string): string {
  const { data } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function objectExists(path: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .download(path);
  return !error && !!data;
}

/**
 * Pindahkan staging → folder final. Fallback copy jika move gagal;
 * idempoten jika file sudah ada di folder final (submit ulang).
 */
async function promoteStorageObject(
  srcPath: string,
  destPath: string,
  filename: string
): Promise<{ url: string; publicId: string }> {
  const bucket = supabaseAdmin.storage.from(STORAGE_BUCKET);

  const destReady = await objectExists(destPath);
  if (destReady) {
    await bucket.remove([srcPath]).catch(() => {});
    return { url: publicUrlForPath(destPath), publicId: filename };
  }

  const { error: moveError } = await bucket.move(srcPath, destPath);

  if (!moveError) {
    return { url: publicUrlForPath(destPath), publicId: filename };
  }

  const moveMsg = moveError.message?.toLowerCase() ?? "";
  const srcMissing =
    moveMsg.includes("not found") || moveMsg.includes("object not found");

  if (srcMissing) {
    const { data: blob, error: downloadError } = await bucket.download(srcPath);

    if (!downloadError && blob) {
      const buffer = Buffer.from(await blob.arrayBuffer());
      const { error: uploadError } = await bucket.upload(destPath, buffer, {
        contentType: "image/webp",
        upsert: true,
      });

      if (!uploadError) {
        await bucket.remove([srcPath]).catch(() => {});
        return { url: publicUrlForPath(destPath), publicId: filename };
      }

      throw new StagingPromoteError(
        `Gagal mempromosikan gambar: ${uploadError.message}`
      );
    }

    throw new StagingPromoteError(
      "Gagal mempromosikan gambar: file staging tidak ditemukan di storage. " +
        "Unggah ulang gambar lalu simpan lagi. Pastikan SUPABASE_STORAGE_BUCKET benar di server."
    );
  }

  throw new StagingPromoteError(
    `Gagal mempromosikan gambar: ${moveError.message}`
  );
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

  return promoteStorageObject(srcPath, destPath, filename);
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

  const result = await promoteStorageObject(srcPath, destPath, filename);
  return result.url;
}
