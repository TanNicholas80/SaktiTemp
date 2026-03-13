import { z } from "zod";

export const createServiceSchema = z.object({
  serviceName: z
    .string()
    .min(2, "Nama layanan minimal 2 karakter")
    .max(255, "Nama layanan maksimal 255 karakter"),
  serviceDescription: z.string().min(1, "Deskripsi wajib diisi"),
  serviceIcon: z.string().min(1, "Icon wajib dipilih"),
  servicePoints: z
    .array(z.string().min(1, "Poin layanan tidak boleh kosong"))
    .default([]),
  serviceBtnText: z.string().min(1, "Teks tombol wajib diisi"),
  serviceBtnLink: z.string().min(1, "Link tombol wajib diisi"),
  serviceIsPublished: z.boolean().default(false),
});

export const updateServiceSchema = z.object({
  serviceName: z
    .string()
    .min(2, "Nama layanan minimal 2 karakter")
    .max(255, "Nama layanan maksimal 255 karakter")
    .optional(),
  serviceDescription: z.string().min(1, "Deskripsi wajib diisi").optional(),
  serviceIcon: z.string().min(1, "Icon wajib dipilih").optional(),
  servicePoints: z
    .array(z.string().min(1, "Poin layanan tidak boleh kosong"))
    .optional(),
  serviceBtnText: z.string().min(1, "Teks tombol wajib diisi").optional(),
  serviceBtnLink: z.string().min(1, "Link tombol wajib diisi").optional(),
  serviceIsPublished: z.boolean().optional(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
