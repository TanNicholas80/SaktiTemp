import { copyFile, mkdir, unlink } from "fs/promises";
import path from "path";

import {
  FINAL_UPLOAD_FOLDERS,
  STAGING_UPLOAD_DIR,
  type FinalUploadFolder,
} from "@/lib/constants/admin-upload";

const STAGING_PUBLIC_PREFIX = `/uploads/${STAGING_UPLOAD_DIR}/`;

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

export function isStagingImageUrl(url: string): boolean {
  return url.includes(STAGING_PUBLIC_PREFIX);
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
 * Salin dari staging ke folder final lalu hapus berkas staging.
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
  const cwd = process.cwd();
  const src = path.join(cwd, "public", "uploads", STAGING_UPLOAD_DIR, filename);
  const destDir = path.join(cwd, "public", "uploads", targetFolder);
  const dest = path.join(destDir, filename);

  try {
    await mkdir(destDir, { recursive: true });
    await copyFile(src, dest);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new StagingPromoteError(`Gagal mempromosikan gambar: ${msg}`);
  }

  await unlink(src).catch(() => {});

  return {
    url: `/uploads/${targetFolder}/${filename}`,
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

  const cwd = process.cwd();
  const src = path.join(cwd, "public", "uploads", STAGING_UPLOAD_DIR, filename);
  const destDir = path.join(cwd, "public", "uploads", targetFolder);
  const dest = path.join(destDir, filename);

  try {
    await mkdir(destDir, { recursive: true });
    await copyFile(src, dest);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new StagingPromoteError(`Gagal mempromosikan gambar: ${msg}`);
  }

  await unlink(src).catch(() => {});

  return `/uploads/${targetFolder}/${filename}`;
}
