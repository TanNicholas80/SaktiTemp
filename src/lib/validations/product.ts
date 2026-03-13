import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const thicknessIdSchema = z.string().uuid("Thickness tidak valid");

const excellenceItemSchema = z.object({
  productExellenceDescription: z.string().min(2).max(500),
});

export const createProductSchema = z.object({
  productName: z
    .string()
    .min(2, "Nama produk minimal 2 karakter")
    .max(255, "Nama produk maksimal 255 karakter"),
  productSlug: z
    .string()
    .min(2, "Slug minimal 2 karakter")
    .max(255, "Slug maksimal 255 karakter")
    .regex(slugRegex, "Slug hanya boleh huruf kecil, angka, dan strip"),
  productShortDescription: z.string().max(500, "Deskripsi singkat maksimal 500 karakter").optional(),
  productDescription: z.string().min(1, "Deskripsi wajib diisi"),
  productImageUrl: z.string().min(1, "Gambar cover wajib diunggah"),
  productImagePublicId: z.string().min(1, "Gambar cover wajib diunggah"),
  categoryProductId: z
    .string()
    .uuid("Kategori tidak valid")
    .nullable()
    .optional(),
  productIsPublished: z.boolean().default(false),
  thicknessIds: z.array(thicknessIdSchema).optional().default([]),
  excellences: z.array(excellenceItemSchema).optional().default([]),
});

export const updateProductSchema = z.object({
  productName: z
    .string()
    .min(2, "Nama produk minimal 2 karakter")
    .max(255, "Nama produk maksimal 255 karakter")
    .optional(),
  productSlug: z
    .string()
    .min(2, "Slug minimal 2 karakter")
    .max(255, "Slug maksimal 255 karakter")
    .regex(slugRegex, "Slug hanya boleh huruf kecil, angka, dan strip")
    .optional(),
  productShortDescription: z.string().max(500, "Deskripsi singkat maksimal 500 karakter").optional(),
  productDescription: z.string().min(1, "Deskripsi wajib diisi").optional(),
  productImageUrl: z.string().min(1, "Gambar cover wajib diunggah").optional(),
  productImagePublicId: z
    .string()
    .min(1, "Gambar cover wajib diunggah")
    .optional(),
  categoryProductId: z
    .string()
    .uuid("Kategori tidak valid")
    .nullable()
    .optional(),
  productIsPublished: z.boolean().optional(),
  thicknessIds: z.array(thicknessIdSchema).optional(),
  excellences: z.array(excellenceItemSchema).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
