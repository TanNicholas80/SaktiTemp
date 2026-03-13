import { z } from "zod";

export const createBenefitSchema = z.object({
  benefitName: z
    .string()
    .min(2, "Nama keunggulan minimal 2 karakter")
    .max(255, "Nama keunggulan maksimal 255 karakter"),
  benefitDescription: z.string().min(1, "Deskripsi wajib diisi"),
  benefitIcon: z.string().min(1, "Icon wajib dipilih"),
  benefitIsPublished: z.boolean().default(false),
});

export const updateBenefitSchema = z.object({
  benefitName: z
    .string()
    .min(2, "Nama keunggulan minimal 2 karakter")
    .max(255, "Nama keunggulan maksimal 255 karakter")
    .optional(),
  benefitDescription: z.string().min(1, "Deskripsi wajib diisi").optional(),
  benefitIcon: z.string().min(1, "Icon wajib dipilih").optional(),
  benefitIsPublished: z.boolean().optional(),
});

export type CreateBenefitInput = z.infer<typeof createBenefitSchema>;
export type UpdateBenefitInput = z.infer<typeof updateBenefitSchema>;
