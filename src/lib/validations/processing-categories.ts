import { z } from "zod";

export const createProcessingCategorySchema = z.object({
  categoryName: z
    .string()
    .min(1, "Nama kategori wajib diisi")
    .max(200, "Nama kategori maksimal 200 karakter"),
  categoryImageUrl: z
    .string()
    .min(1, "Gambar wajib diisi")
    .max(2048, "URL gambar terlalu panjang"),
  categoryImagePublicId: z
    .string()
    .min(1, "Public ID gambar wajib diisi")
    .max(512, "Public ID gambar terlalu panjang"),
});

export const updateProcessingCategorySchema = z.object({
  categoryName: z
    .string()
    .min(1, "Nama kategori wajib diisi")
    .max(200, "Nama kategori maksimal 200 karakter")
    .optional(),
  categoryImageUrl: z
    .string()
    .min(1, "Gambar wajib diisi")
    .max(2048, "URL gambar terlalu panjang")
    .optional(),
  categoryImagePublicId: z
    .string()
    .min(1, "Public ID gambar wajib diisi")
    .max(512, "Public ID gambar terlalu panjang")
    .optional(),
});
