import { z } from "zod";

export const createSocialMediaSchema = z.object({
  platformName: z
    .string()
    .min(2, "Nama platform minimal 2 karakter")
    .max(50, "Nama platform maksimal 50 karakter"),
  profileUrl: z
    .string()
    .url("URL profil tidak valid")
    .max(500, "URL maksimal 500 karakter"),
  iconName: z.string().min(1, "Icon wajib dipilih"),
  isPublished: z.boolean().default(true),
});

export const updateSocialMediaSchema = z.object({
  platformName: z
    .string()
    .min(2, "Nama platform minimal 2 karakter")
    .max(50, "Nama platform maksimal 50 karakter")
    .optional(),
  profileUrl: z
    .string()
    .url("URL profil tidak valid")
    .max(500, "URL maksimal 500 karakter")
    .optional(),
  iconName: z.string().min(1, "Icon wajib dipilih").optional(),
  isPublished: z.boolean().optional(),
});

export type CreateSocialMediaInput = z.infer<typeof createSocialMediaSchema>;
export type UpdateSocialMediaInput = z.infer<typeof updateSocialMediaSchema>;
