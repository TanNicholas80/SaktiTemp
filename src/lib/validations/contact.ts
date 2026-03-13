import { z } from "zod";

const contactTypeEnum = z.enum([
  "phone",
  "email",
  "address",
  "operational_hours",
]);

export const createContactSchema = z.object({
  contactType: contactTypeEnum,
  contactLabel: z
    .string()
    .min(2, "Label minimal 2 karakter")
    .max(100, "Label maksimal 100 karakter"),
  contactValue: z.string().min(1, "Nilai kontak wajib diisi"),
  contactValueExtra: z.string().optional(),
  contactIcon: z.string().min(1, "Icon wajib dipilih"),
  isPublished: z.boolean().default(true),
});

export const updateContactSchema = z.object({
  contactType: contactTypeEnum.optional(),
  contactLabel: z
    .string()
    .min(2, "Label minimal 2 karakter")
    .max(100, "Label maksimal 100 karakter")
    .optional(),
  contactValue: z.string().min(1, "Nilai kontak wajib diisi").optional(),
  contactValueExtra: z.string().optional().nullable(),
  contactIcon: z.string().min(1, "Icon wajib dipilih").optional(),
  isPublished: z.boolean().optional(),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
