import { deleteUploadedImageFile } from "./uploaded-image";

/**
 * Menghapus file gambar blog dari Supabase Storage (URL baru)
 * atau dari disk lokal (URL lama — dual-read fallback).
 */
export async function deleteBlogImageFile(
  publicIdOrUrl: string | null | undefined
): Promise<void> {
  await deleteUploadedImageFile("blog", publicIdOrUrl);
}
