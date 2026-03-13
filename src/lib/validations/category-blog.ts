import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createCategoryBlogSchema = z.object({
  categoryBlogName: z
    .string()
    .min(2, "Nama kategori minimal 2 karakter")
    .max(100, "Nama kategori maksimal 100 karakter"),
  categoryBlogSlug: z
    .string()
    .min(2, "Slug minimal 2 karakter")
    .max(120, "Slug maksimal 120 karakter")
    .regex(slugRegex, "Slug hanya boleh huruf kecil, angka, dan strip")
    .optional(),
});

export const updateCategoryBlogSchema = z.object({
  categoryBlogName: z
    .string()
    .min(2, "Nama kategori minimal 2 karakter")
    .max(100, "Nama kategori maksimal 100 karakter")
    .optional(),
  categoryBlogSlug: z
    .string()
    .min(2, "Slug minimal 2 karakter")
    .max(120, "Slug maksimal 120 karakter")
    .regex(slugRegex, "Slug hanya boleh huruf kecil, angka, dan strip")
    .optional(),
});

export type CreateCategoryBlogInput = z.infer<typeof createCategoryBlogSchema>;
export type UpdateCategoryBlogInput = z.infer<typeof updateCategoryBlogSchema>;
