import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(100, "Password maksimal 100 karakter")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password harus mengandung huruf kecil, huruf besar, dan angka"
    ),
  role: z.enum(["admin", "user", "blog_editor"]).default("admin"),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter")
    .optional(),
  email: z.string().email("Format email tidak valid").optional(),
  password: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length === 0 || val.length >= 8,
      "Password minimal 8 karakter"
    )
    .refine(
      (val) =>
        !val ||
        val.length === 0 ||
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val),
      "Password harus mengandung huruf kecil, huruf besar, dan angka"
    ),
  role: z.enum(["admin", "user", "blog_editor"]).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
