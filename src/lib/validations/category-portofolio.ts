import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createCategoryPortofolioSchema = z.object({
  categoryPortofolioName: z
    .string()
    .min(2, "Nama kategori minimal 2 karakter")
    .max(100, "Nama kategori maksimal 100 karakter"),
  categoryPortofolioSlug: z
    .string()
    .min(2, "Slug minimal 2 karakter")
    .max(120, "Slug maksimal 120 karakter")
    .regex(slugRegex, "Slug hanya boleh huruf kecil, angka, dan strip")
    .optional(),
  categoryPortofolioImage: z
    .string()
    .max(255, "Path gambar maksimal 255 karakter")
    .optional(),
  categoryPortofolioDescription: z.string().optional(),
});

export const updateCategoryPortofolioSchema = z.object({
  categoryPortofolioName: z
    .string()
    .min(2, "Nama kategori minimal 2 karakter")
    .max(100, "Nama kategori maksimal 100 karakter")
    .optional(),
  categoryPortofolioSlug: z
    .string()
    .min(2, "Slug minimal 2 karakter")
    .max(120, "Slug maksimal 120 karakter")
    .regex(slugRegex, "Slug hanya boleh huruf kecil, angka, dan strip")
    .optional(),
  categoryPortofolioImage: z
    .string()
    .max(255, "Path gambar maksimal 255 karakter")
    .optional(),
  categoryPortofolioDescription: z.string().optional(),
});

export type CreateCategoryPortofolioInput = z.infer<
  typeof createCategoryPortofolioSchema
>;
export type UpdateCategoryPortofolioInput = z.infer<
  typeof updateCategoryPortofolioSchema
>;
