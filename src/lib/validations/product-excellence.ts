import { z } from "zod";

export const createProductExcellenceSchema = z.object({
  productId: z.string().uuid("Product tidak valid"),
  productExellenceDescription: z
    .string()
    .min(2, "Deskripsi minimal 2 karakter")
    .max(500, "Deskripsi maksimal 500 karakter"),
});

export const updateProductExcellenceSchema = z.object({
  productExellenceDescription: z
    .string()
    .min(2, "Deskripsi minimal 2 karakter")
    .max(500, "Deskripsi maksimal 500 karakter")
    .optional(),
});

export type CreateProductExcellenceInput = z.infer<
  typeof createProductExcellenceSchema
>;
export type UpdateProductExcellenceInput = z.infer<
  typeof updateProductExcellenceSchema
>;
