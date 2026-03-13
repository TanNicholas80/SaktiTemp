import { z } from "zod";

export const createCompanyStatSchema = z.object({
  value: z
    .string()
    .min(1, "Nilai wajib diisi")
    .max(50, "Nilai maksimal 50 karakter"),
  label: z
    .string()
    .min(2, "Label minimal 2 karakter")
    .max(100, "Label maksimal 100 karakter"),
  displayOrder: z.number().int().min(1, "Urutan minimal 1"),
  isPublished: z.boolean().default(true),
});

export const updateCompanyStatSchema = z.object({
  value: z
    .string()
    .min(1, "Nilai wajib diisi")
    .max(50, "Nilai maksimal 50 karakter")
    .optional(),
  label: z
    .string()
    .min(2, "Label minimal 2 karakter")
    .max(100, "Label maksimal 100 karakter")
    .optional(),
  displayOrder: z.number().int().min(1, "Urutan minimal 1").optional(),
  isPublished: z.boolean().optional(),
});

export type CreateCompanyStatInput = z.infer<typeof createCompanyStatSchema>;
export type UpdateCompanyStatInput = z.infer<typeof updateCompanyStatSchema>;
