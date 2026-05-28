import { deleteUploadedImageFile } from "./uploaded-image";

/**
 * Menghapus file gambar portofolio dari Supabase Storage (URL baru)
 * atau dari disk lokal (URL lama — dual-read fallback).
 */
export async function deletePortofolioImageFile(
  publicIdOrUrl: string | null | undefined
): Promise<void> {
  await deleteUploadedImageFile("portofolio", publicIdOrUrl);
}
