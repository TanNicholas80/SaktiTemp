import { z } from "zod";

export const createGlassTypeSchema = z.object({
  glassTypeName: z
    .string()
    .min(1, "Nama tipe kaca wajib diisi")
    .max(150, "Nama tipe kaca maksimal 150 karakter"),
  glassTypeImageUrl: z
    .string()
    .min(1, "Gambar tipe kaca wajib diisi")
    .max(2048, "URL gambar terlalu panjang"),
  glassTypeImagePublicId: z
    .string()
    .min(1, "Public ID gambar wajib diisi")
    .max(512, "Public ID gambar terlalu panjang"),
});

export const updateGlassTypeSchema = z.object({
  glassTypeName: z
    .string()
    .min(1, "Nama tipe kaca wajib diisi")
    .max(150, "Nama tipe kaca maksimal 150 karakter")
    .optional(),
  glassTypeImageUrl: z
    .string()
    .min(1, "Gambar tipe kaca wajib diisi")
    .max(2048, "URL gambar terlalu panjang")
    .optional(),
  glassTypeImagePublicId: z
    .string()
    .min(1, "Public ID gambar wajib diisi")
    .max(512, "Public ID gambar terlalu panjang")
    .optional(),
});

