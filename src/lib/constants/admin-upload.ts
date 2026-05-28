/** Harus selaras dengan `src/app/api/admin/upload/route.ts` */
export const ADMIN_IMAGE_MAX_BYTES = 4 * 1024 * 1024; // 4MB

export const ADMIN_IMAGE_ACCEPT_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ADMIN_IMAGE_ACCEPT_ATTR = ADMIN_IMAGE_ACCEPT_MIME.join(",");

/** Folder sementara pratinjau admin; file dipromosikan ke folder final saat simpan. */
export const STAGING_UPLOAD_DIR = "staging" as const;

/**
 * Segmen path yang dipakai untuk mendeteksi URL staging, berlaku untuk
 * URL lokal (`/uploads/staging/...`) maupun URL Supabase (`...supabase.co/.../staging/...`).
 */
export const STAGING_URL_SEGMENT = "/staging/" as const;

/** Folder tujuan setelah promote (bukan staging). */
export const FINAL_UPLOAD_FOLDERS = [
  "blog",
  "product",
  "portofolio",
  "carousel",
  "hero",
  "certification",
  "category",
] as const;

export type FinalUploadFolder = (typeof FINAL_UPLOAD_FOLDERS)[number];
