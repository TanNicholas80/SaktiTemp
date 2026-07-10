import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const galleryImageSchema = z.object({
  url: z.string().min(1, "URL gambar galeri wajib diisi"),
  publicId: z.string().min(1, "Public ID gambar galeri wajib diisi"),
});

export const createPortofolioSchema = z.object({
  portofolioName: z
    .string()
    .min(2, "Nama portofolio minimal 2 karakter")
    .max(255, "Nama portofolio maksimal 255 karakter"),
  portofolioSlug: z
    .string()
    .min(2, "Slug minimal 2 karakter")
    .max(255, "Slug maksimal 255 karakter")
    .regex(slugRegex, "Slug hanya boleh huruf kecil, angka, dan strip"),
  portofolioShortDescription: z.string().max(500, "Deskripsi singkat maksimal 500 karakter").optional(),
  portofolioGalleryImages: z
    .array(galleryImageSchema)
    .max(3, "Maksimal 3 gambar galeri")
    .optional()
    .default([]),
  portofolioLocation: z.string().min(1, "Lokasi wajib diisi"),
  portofolioImageUrl: z.string().min(1, "Gambar cover wajib diunggah"),
  portofolioImagePublicId: z.string().min(1, "Gambar cover wajib diunggah"),
  categoryPortofolioId: z
    .string()
    .uuid("Kategori tidak valid")
    .nullable()
    .optional(),
  portofolioTypeId: z
    .string()
    .uuid("Tipe portofolio tidak valid")
    .nullable()
    .optional(),
  portofolioIsPublished: z.boolean().default(false),
  productApplicationIds: z.array(z.string().uuid()).optional().default([]),
});

export const updatePortofolioSchema = z.object({
  portofolioName: z
    .string()
    .min(2, "Nama portofolio minimal 2 karakter")
    .max(255, "Nama portofolio maksimal 255 karakter")
    .optional(),
  portofolioSlug: z
    .string()
    .min(2, "Slug minimal 2 karakter")
    .max(255, "Slug maksimal 255 karakter")
    .regex(slugRegex, "Slug hanya boleh huruf kecil, angka, dan strip")
    .optional(),
  portofolioShortDescription: z.string().max(500, "Deskripsi singkat maksimal 500 karakter").optional(),
  portofolioGalleryImages: z
    .array(galleryImageSchema)
    .max(3, "Maksimal 3 gambar galeri")
    .optional(),
  portofolioLocation: z.string().min(1, "Lokasi wajib diisi").optional(),
  portofolioImageUrl: z
    .string()
    .min(1, "Gambar cover wajib diunggah")
    .optional(),
  portofolioImagePublicId: z
    .string()
    .min(1, "Gambar cover wajib diunggah")
    .optional(),
  categoryPortofolioId: z
    .string()
    .uuid("Kategori tidak valid")
    .nullable()
    .optional(),
  portofolioTypeId: z
    .string()
    .uuid("Tipe portofolio tidak valid")
    .nullable()
    .optional(),
  portofolioIsPublished: z.boolean().optional(),
  productApplicationIds: z.array(z.string().uuid()).optional(),
});

export type CreatePortofolioInput = z.infer<typeof createPortofolioSchema>;
export type UpdatePortofolioInput = z.infer<typeof updatePortofolioSchema>;
