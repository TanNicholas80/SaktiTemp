import { deleteUploadedImageFile } from "./uploaded-image";

/**
 * Menghapus file gambar product dari Supabase Storage (URL baru)
 * atau dari disk lokal (URL lama — dual-read fallback).
 */
export async function deleteProductImageFile(
  publicIdOrUrl: string | null | undefined
): Promise<void> {
  await deleteUploadedImageFile("product", publicIdOrUrl);
}
