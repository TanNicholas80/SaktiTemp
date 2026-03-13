import { unlink } from "fs/promises";
import path from "path";

const PRODUCT_UPLOAD_DIR = path.join(
  process.cwd(),
  "public",
  "uploads",
  "product"
);

/**
 * Mendapatkan filename dari publicId atau URL.
 * - publicId: "uuid.webp"
 * - url: "/uploads/product/uuid.webp" -> "uuid.webp"
 */
function getFilename(publicIdOrUrl: string): string {
  if (publicIdOrUrl.includes("/")) {
    const parts = publicIdOrUrl.split("/");
    return parts[parts.length - 1] ?? publicIdOrUrl;
  }
  return publicIdOrUrl;
}

/**
 * Menghapus file gambar product dari folder public/uploads/product.
 * Tidak melempar error jika file tidak ditemukan (sudah dihapus).
 */
export async function deleteProductImageFile(
  publicIdOrUrl: string | null | undefined
): Promise<void> {
  if (!publicIdOrUrl || typeof publicIdOrUrl !== "string") return;

  const filename = getFilename(publicIdOrUrl.trim());
  if (!filename) return;

  const filepath = path.join(PRODUCT_UPLOAD_DIR, filename);

  try {
    await unlink(filepath);
  } catch (err) {
    const nodeErr = err as NodeJS.ErrnoException | null;
    // ENOENT = file tidak ada, abaikan
    if (nodeErr?.code === "ENOENT") return;
    console.error(
      "[deleteProductImageFile] Gagal menghapus file:",
      filepath,
      err
    );
  }
}
