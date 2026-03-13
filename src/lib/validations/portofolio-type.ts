import { z } from "zod";

export const createPortofolioTypeSchema = z.object({
  portofolioTypeName: z
    .string()
    .min(2, "Nama tipe minimal 2 karakter")
    .max(100, "Nama tipe maksimal 100 karakter"),
});

export const updatePortofolioTypeSchema = z.object({
  portofolioTypeName: z
    .string()
    .min(2, "Nama tipe minimal 2 karakter")
    .max(100, "Nama tipe maksimal 100 karakter")
    .optional(),
});
