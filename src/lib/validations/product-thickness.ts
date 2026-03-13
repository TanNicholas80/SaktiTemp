import { z } from "zod";

export const createProductThicknessSchema = z.object({
  productId: z.string().uuid("Product tidak valid"),
  productThicknessValue: z
    .number()
    .int("Nilai ketebalan harus bilangan bulat")
    .positive("Nilai ketebalan harus positif"),
  productThicknessUnit: z
    .string()
    .min(1, "Unit wajib diisi")
    .max(20, "Unit maksimal 20 karakter"),
});

export const updateProductThicknessSchema = z.object({
  productThicknessValue: z
    .number()
    .int("Nilai ketebalan harus bilangan bulat")
    .positive("Nilai ketebalan harus positif")
    .optional(),
  productThicknessUnit: z
    .string()
    .min(1, "Unit wajib diisi")
    .max(20, "Unit maksimal 20 karakter")
    .optional(),
});

export type CreateProductThicknessInput = z.infer<
  typeof createProductThicknessSchema
>;
export type UpdateProductThicknessInput = z.infer<
  typeof updateProductThicknessSchema
>;
