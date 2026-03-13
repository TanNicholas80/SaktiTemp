import { z } from "zod";

export const createProductApplicationSchema = z.object({
  productApplicationName: z
    .string()
    .min(2, "Nama aplikasi minimal 2 karakter")
    .max(255, "Nama aplikasi maksimal 255 karakter"),
  productApplicationDescription: z.string().min(1, "Deskripsi wajib diisi"),
  productApplicationImageUrl: z.string().min(1, "Gambar wajib diunggah"),
  productApplicationImagePublicId: z.string().min(1, "Gambar wajib diunggah"),
  productId: z.string().uuid("Produk tidak valid").nullable().optional(),
  productApplicationIsPublished: z.boolean().default(false),
});

export const updateProductApplicationSchema = z.object({
  productApplicationName: z
    .string()
    .min(2, "Nama aplikasi minimal 2 karakter")
    .max(255, "Nama aplikasi maksimal 255 karakter")
    .optional(),
  productApplicationDescription: z.string().min(1, "Deskripsi wajib diisi").optional(),
  productApplicationImageUrl: z.string().min(1, "Gambar wajib diunggah").optional(),
  productApplicationImagePublicId: z.string().min(1, "Gambar wajib diunggah").optional(),
  productId: z.string().uuid("Produk tidak valid").nullable().optional(),
  productApplicationIsPublished: z.boolean().optional(),
});

export type CreateProductApplicationInput = z.infer<
  typeof createProductApplicationSchema
>;
export type UpdateProductApplicationInput = z.infer<
  typeof updateProductApplicationSchema
>;
