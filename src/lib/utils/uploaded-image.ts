import { unlink } from "fs/promises";
import path from "path";

import type { FinalUploadFolder } from "@/lib/constants/admin-upload";

function getFilename(publicIdOrUrl: string): string {
  if (publicIdOrUrl.includes("/")) {
    const parts = publicIdOrUrl.split("/");
    return parts[parts.length - 1] ?? publicIdOrUrl;
  }
  return publicIdOrUrl;
}

/**
 * Menghapus file gambar dari folder public/uploads/{folder}.
 * Tidak melempar error jika file tidak ditemukan (sudah dihapus).
 */
export async function deleteUploadedImageFile(
  folder: FinalUploadFolder,
  publicIdOrUrl: string | null | undefined
): Promise<void> {
  if (!publicIdOrUrl || typeof publicIdOrUrl !== "string") return;

  const filename = getFilename(publicIdOrUrl.trim());
  if (!filename) return;

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
      `[deleteUploadedImageFile] Gagal menghapus file: ${filepath}`,
      err
    );
  }
}
