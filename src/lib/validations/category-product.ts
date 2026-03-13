import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createCategoryProductSchema = z.object({
  categoryProductName: z
    .string()
    .min(2, "Nama kategori minimal 2 karakter")
    .max(100, "Nama kategori maksimal 100 karakter"),
  categoryProductSlug: z
    .string()
    .min(2, "Slug minimal 2 karakter")
    .max(120, "Slug maksimal 120 karakter")
    .regex(slugRegex, "Slug hanya boleh huruf kecil, angka, dan strip")
    .optional(),
});

export const updateCategoryProductSchema = z.object({
  categoryProductName: z
    .string()
    .min(2, "Nama kategori minimal 2 karakter")
    .max(100, "Nama kategori maksimal 100 karakter")
    .optional(),
  categoryProductSlug: z
    .string()
    .min(2, "Slug minimal 2 karakter")
    .max(120, "Slug maksimal 120 karakter")
    .regex(slugRegex, "Slug hanya boleh huruf kecil, angka, dan strip")
    .optional(),
});

export type CreateCategoryProductInput = z.infer<
  typeof createCategoryProductSchema
>;
export type UpdateCategoryProductInput = z.infer<
  typeof updateCategoryProductSchema
>;
