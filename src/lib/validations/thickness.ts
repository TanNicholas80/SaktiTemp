import { z } from "zod";

export const createThicknessSchema = z.object({
  thicknessValue: z
    .number({ error: "Nilai harus berupa angka" })
    .finite("Nilai harus berupa angka yang valid")
    .positive("Nilai harus positif"),
  thicknessUnit: z
    .string()
    .min(1, "Unit wajib diisi")
    .max(20, "Unit maksimal 20 karakter"),
});

export const updateThicknessSchema = z.object({
  thicknessValue: z
    .number({ error: "Nilai harus berupa angka" })
    .finite("Nilai harus berupa angka yang valid")
    .positive("Nilai harus positif")
    .optional(),
  thicknessUnit: z
    .string()
    .min(1, "Unit wajib diisi")
    .max(20, "Unit maksimal 20 karakter")
    .optional(),
});
