import { z } from "zod";

export const createCertificationSchema = z.object({
  name: z
    .string()
    .min(1, "Nama wajib diisi")
    .max(100, "Nama maksimal 100 karakter"),
  image: z
    .string()
    .min(1, "Gambar logo wajib diunggah")
    .max(255, "Path gambar maksimal 255 karakter"),
  displayOrder: z.number().int().min(1, "Urutan minimal 1"),
  isPublished: z.boolean().default(true),
});

export const updateCertificationSchema = z.object({
  name: z
    .string()
    .min(1, "Nama wajib diisi")
    .max(100, "Nama maksimal 100 karakter")
    .optional(),
  image: z
    .string()
    .min(1, "Gambar logo wajib diunggah")
    .max(255, "Path gambar maksimal 255 karakter")
    .optional(),
  displayOrder: z.number().int().min(1, "Urutan minimal 1").optional(),
  isPublished: z.boolean().optional(),
});

export type CreateCertificationInput = z.infer<typeof createCertificationSchema>;
export type UpdateCertificationInput = z.infer<typeof updateCertificationSchema>;
