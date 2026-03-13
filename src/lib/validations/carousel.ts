import { z } from "zod";

export const createCarouselSchema = z.object({
  carouselHeading: z
    .string()
    .min(2, "Heading minimal 2 karakter")
    .max(255, "Heading maksimal 255 karakter"),
  carouselSubheading: z
    .string()
    .min(2, "Subheading minimal 2 karakter")
    .max(255, "Subheading maksimal 255 karakter"),
  carouselDescription: z.string().min(1, "Deskripsi wajib diisi"),
  carouselImageUrl: z.string().min(1, "Gambar wajib diunggah"),
  carouselImagePublicId: z.string().min(1, "Gambar wajib diunggah"),
  carouselOrder: z.number().int().min(1, "Urutan minimal 1"),
  carouselIsPublished: z.boolean().default(false),
});

export const updateCarouselSchema = z.object({
  carouselHeading: z
    .string()
    .min(2, "Heading minimal 2 karakter")
    .max(255, "Heading maksimal 255 karakter")
    .optional(),
  carouselSubheading: z
    .string()
    .min(2, "Subheading minimal 2 karakter")
    .max(255, "Subheading maksimal 255 karakter")
    .optional(),
  carouselDescription: z.string().min(1, "Deskripsi wajib diisi").optional(),
  carouselImageUrl: z.string().min(1, "Gambar wajib diunggah").optional(),
  carouselImagePublicId: z.string().min(1, "Gambar wajib diunggah").optional(),
  carouselOrder: z.number().int().min(1, "Urutan minimal 1").optional(),
  carouselIsPublished: z.boolean().optional(),
});

export type CreateCarouselInput = z.infer<typeof createCarouselSchema>;
export type UpdateCarouselInput = z.infer<typeof updateCarouselSchema>;
