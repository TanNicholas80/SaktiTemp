import { unlink } from "fs/promises";
import path from "path";

import type { FinalUploadFolder } from "@/lib/constants/admin-upload";
import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase/server-client";

function getFilename(publicIdOrUrl: string): string {
  if (publicIdOrUrl.includes("/")) {
    const parts = publicIdOrUrl.split("/");
    return parts[parts.length - 1] ?? publicIdOrUrl;
  }
  return publicIdOrUrl;
}

/**
 * Mendeteksi apakah URL adalah URL Supabase Storage (bukan lokal).
 * URL Supabase mengandung `supabase.co/storage`.
 */
function isSupabaseStorageUrl(url: string): boolean {
  return url.includes("supabase.co/storage");
}

/**
 * Menghapus file gambar dari Supabase Storage atau dari disk lokal
 * (dual-delete: file lama yang masih di disk lokal tetap dihapus via unlink).
 */
export async function deleteUploadedImageFile(
  folder: FinalUploadFolder,
  publicIdOrUrl: string | null | undefined
): Promise<void> {
  if (!publicIdOrUrl || typeof publicIdOrUrl !== "string") return;

  const trimmed = publicIdOrUrl.trim();
  if (!trimmed) return;

  const filename = getFilename(trimmed);
  if (!filename) return;

  if (isSupabaseStorageUrl(trimmed)) {
    // File baru: hapus dari Supabase Storage
    const storagePath = `${folder}/${filename}`;
    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .remove([storagePath]);

    if (error && !error.message?.toLowerCase().includes("not found")) {
      console.error(
        `[deleteUploadedImageFile] Gagal menghapus dari Supabase: ${storagePath}`,
        error
      );
    }
  } else {
    // File lama: hapus dari disk lokal (dual-read fallback)
    const filepath = path.join(
      process.cwd(),
      "public",
      "uploads",
      folder,
      filename
    );

    try {
      await unlink(filepath);
    } catch (err) {
      const nodeErr = err as NodeJS.ErrnoException | null;
      if (nodeErr?.code === "ENOENT") return;
      console.error(
        `[deleteUploadedImageFile] Gagal menghapus file lokal: ${filepath}`,
        err
      );
    }
  }
}
