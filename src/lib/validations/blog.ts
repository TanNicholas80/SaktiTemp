import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createBlogSchema = z.object({
  blogTitle: z
    .string()
    .min(2, "Judul minimal 2 karakter")
    .max(255, "Judul maksimal 255 karakter"),
  blogSlug: z
    .string()
    .min(2, "Slug minimal 2 karakter")
    .max(255, "Slug maksimal 255 karakter")
    .regex(slugRegex, "Slug hanya boleh huruf kecil, angka, dan strip"),
  blogExcerpt: z.string().max(500, "Deskripsi singkat maksimal 500 karakter").optional(),
  blogContent: z.string().min(1, "Konten wajib diisi"),
  blogImageUrl: z.string().min(1, "Gambar cover wajib diunggah"),
  blogImagePublicId: z.string().min(1, "Gambar cover wajib diunggah"),
  categoryBlogId: z.string().uuid("Kategori tidak valid").nullable().optional(),
  blogIsPublished: z.boolean().default(false),
});

export const updateBlogSchema = z.object({
  blogTitle: z
    .string()
    .min(2, "Judul minimal 2 karakter")
    .max(255, "Judul maksimal 255 karakter")
    .optional(),
  blogSlug: z
    .string()
    .min(2, "Slug minimal 2 karakter")
    .max(255, "Slug maksimal 255 karakter")
    .regex(slugRegex, "Slug hanya boleh huruf kecil, angka, dan strip")
    .optional(),
  blogExcerpt: z.string().max(500, "Deskripsi singkat maksimal 500 karakter").optional(),
  blogContent: z.string().min(1, "Konten wajib diisi").optional(),
  blogImageUrl: z.string().min(1, "Gambar cover wajib diunggah").optional(),
  blogImagePublicId: z.string().min(1, "Gambar cover wajib diunggah").optional(),
  categoryBlogId: z.string().uuid("Kategori tidak valid").nullable().optional(),
  blogIsPublished: z.boolean().optional(),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
