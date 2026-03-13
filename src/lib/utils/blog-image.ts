import { unlink } from "fs/promises";
import path from "path";

const BLOG_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "blog");

/**
 * Mendapatkan filename dari publicId atau URL.
 * - publicId: "uuid.webp"
 * - url: "/uploads/blog/uuid.webp" -> "uuid.webp"
 */
function getFilename(publicIdOrUrl: string): string {
  if (publicIdOrUrl.includes("/")) {
    const parts = publicIdOrUrl.split("/");
    return parts[parts.length - 1] ?? publicIdOrUrl;
  }
  return publicIdOrUrl;
}

/**
 * Menghapus file gambar blog dari folder public/uploads/blog.
 * Tidak melempar error jika file tidak ditemukan (sudah dihapus).
 */
export async function deleteBlogImageFile(
  publicIdOrUrl: string | null | undefined
): Promise<void> {
  if (!publicIdOrUrl || typeof publicIdOrUrl !== "string") return;

  const filename = getFilename(publicIdOrUrl.trim());
  if (!filename) return;

  const filepath = path.join(BLOG_UPLOAD_DIR, filename);

  try {
    await unlink(filepath);
  } catch (err) {
    const nodeErr = err as NodeJS.ErrnoException | null;
    // ENOENT = file tidak ada, abaikan
    if (nodeErr?.code === "ENOENT") return;
    console.error("[deleteBlogImageFile] Gagal menghapus file:", filepath, err);
  }
}
