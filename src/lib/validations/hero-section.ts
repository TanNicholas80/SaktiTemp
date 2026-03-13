import { z } from "zod";

const breadcrumbItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const createHeroSectionSchema = z.object({
  pageKey: z
    .string()
    .min(2, "Page key minimal 2 karakter")
    .max(50, "Page key maksimal 50 karakter")
    .regex(/^[a-z0-9_-]+$/, "Hanya huruf kecil, angka, underscore, atau strip"),
  preHeading: z
    .string()
    .max(100, "Pre-heading maksimal 100 karakter")
    .optional()
    .nullable(),
  mainHeading: z
    .string()
    .min(2, "Main heading minimal 2 karakter")
    .max(200, "Main heading maksimal 200 karakter"),
  subHeading: z
    .string()
    .min(2, "Sub-heading minimal 2 karakter")
    .max(200, "Sub-heading maksimal 200 karakter"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  backgroundImageUrl: z.string().min(1, "Gambar background wajib diunggah"),
  backgroundImagePublicId: z.string().min(1, "Gambar background wajib diunggah"),
  breadcrumbItems: z
    .array(breadcrumbItemSchema)
    .optional()
    .nullable(),
  scrollIndicatorText: z
    .string()
    .max(50, "Scroll indicator maksimal 50 karakter")
    .optional(),
  scrollIndicatorVisible: z.boolean().optional(),
  isPublished: z.boolean().default(true),
});

export const updateHeroSectionSchema = z.object({
  pageKey: z
    .string()
    .min(2, "Page key minimal 2 karakter")
    .max(50, "Page key maksimal 50 karakter")
    .regex(/^[a-z0-9_-]+$/, "Hanya huruf kecil, angka, underscore, atau strip")
    .optional(),
  preHeading: z
    .string()
    .max(100, "Pre-heading maksimal 100 karakter")
    .optional()
    .nullable(),
  mainHeading: z
    .string()
    .min(2, "Main heading minimal 2 karakter")
    .max(200, "Main heading maksimal 200 karakter")
    .optional(),
  subHeading: z
    .string()
    .min(2, "Sub-heading minimal 2 karakter")
    .max(200, "Sub-heading maksimal 200 karakter")
    .optional(),
  description: z.string().min(1, "Deskripsi wajib diisi").optional(),
  backgroundImageUrl: z.string().min(1, "Gambar background wajib diunggah").optional(),
  backgroundImagePublicId: z.string().min(1, "Gambar background wajib diunggah").optional(),
  breadcrumbItems: z
    .array(breadcrumbItemSchema)
    .optional()
    .nullable(),
  scrollIndicatorText: z
    .string()
    .max(50, "Scroll indicator maksimal 50 karakter")
    .optional()
    .nullable(),
  scrollIndicatorVisible: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

export type CreateHeroSectionInput = z.infer<typeof createHeroSectionSchema>;
export type UpdateHeroSectionInput = z.infer<typeof updateHeroSectionSchema>;
