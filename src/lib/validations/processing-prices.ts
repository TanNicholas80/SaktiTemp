import { z } from "zod";

export const processingUnitSchema = z.enum(["m1", "pcs", "sqm", "none"]);

export const processingPriceRowSchema = z
  .object({
    mode: z.enum(["range", "single"]),
    thickness: z.number().min(0, "Ketebalan tidak boleh negatif").optional(),
    minThickness: z
      .number()
      .min(0, "Ketebalan minimum tidak boleh negatif")
      .optional(),
    maxThickness: z
      .number()
      .min(0, "Ketebalan maksimum tidak boleh negatif")
      .optional(),
    price: z.number().min(0, "Harga tidak boleh negatif"),
  })
  .superRefine((d, ctx) => {
    if (d.mode === "single") {
      if (d.thickness === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ketebalan tunggal wajib diisi",
          path: ["thickness"],
        });
      }
      if (d.minThickness !== undefined || d.maxThickness !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Gunakan `ketebalan tunggal` atau `range min-max`, bukan keduanya",
          path: ["minThickness"],
        });
      }
      return;
    }

    // mode === "range"
    if (d.minThickness === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ketebalan min wajib diisi",
        path: ["minThickness"],
      });
    }
    if (d.maxThickness === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ketebalan max wajib diisi",
        path: ["maxThickness"],
      });
    }
    if (d.thickness !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Gunakan `ketebalan tunggal` atau `range min-max`, bukan keduanya",
        path: ["thickness"],
      });
    }
    if (
      d.minThickness !== undefined &&
      d.maxThickness !== undefined &&
      d.minThickness > d.maxThickness
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ketebalan minimum harus ≤ maksimum",
        path: ["maxThickness"],
      });
    }
  });

export const createProcessingPriceBatchSchema = z
  .object({
    categoryId: z.string().uuid("Kategori tidak valid"),
    serviceName: z
      .string()
      .min(1, "Nama layanan wajib diisi")
      .max(200, "Nama layanan maksimal 200 karakter"),
    unit: processingUnitSchema,
    rows: z
      .array(processingPriceRowSchema)
      .min(1, "Minimal satu baris range & harga"),
  })
  .superRefine((data, ctx) => {
    const keys = new Set<string>();
    for (let i = 0; i < data.rows.length; i++) {
      const r = data.rows[i]!;
      const k =
        r.mode === "single"
          ? `single:${r.thickness}`
          : `range:${r.minThickness}:${r.maxThickness}`;
      if (keys.has(k)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Ketebalan (range/tunggal) duplikat dalam satu penyimpanan",
          path: ["rows", i, r.mode === "single" ? "thickness" : "minThickness"],
        });
        return;
      }
      keys.add(k);
    }
  });

export const createProcessingPriceSchema = z
  .object({
    categoryId: z.string().uuid("Kategori tidak valid"),
    mode: z.enum(["range", "single"]),
    thickness: z.number().min(0, "Ketebalan tidak boleh negatif").optional(),
    minThickness: z
      .number()
      .min(0, "Ketebalan minimum tidak boleh negatif")
      .optional(),
    maxThickness: z
      .number()
      .min(0, "Ketebalan maksimum tidak boleh negatif")
      .optional(),
    serviceName: z
      .string()
      .min(1, "Nama layanan wajib diisi")
      .max(200, "Nama layanan maksimal 200 karakter"),
    unit: processingUnitSchema,
    price: z.number().min(0, "Harga tidak boleh negatif"),
  })
  .superRefine((d, ctx) => {
    if (d.mode === "single") {
      if (d.thickness === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ketebalan tunggal wajib diisi",
          path: ["thickness"],
        });
      }
      return;
    }

    if (d.minThickness === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ketebalan minimum wajib diisi",
        path: ["minThickness"],
      });
    }
    if (d.maxThickness === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ketebalan maksimum wajib diisi",
        path: ["maxThickness"],
      });
    }
    if (
      d.minThickness !== undefined &&
      d.maxThickness !== undefined &&
      d.minThickness > d.maxThickness
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ketebalan minimum harus ≤ maksimum",
        path: ["maxThickness"],
      });
    }
  });

export const updateProcessingPriceSchema = z
  .object({
    categoryId: z.string().uuid("Kategori tidak valid").optional(),
    mode: z.enum(["range", "single"]).optional(),
    thickness: z.number().min(0, "Ketebalan tidak boleh negatif").optional(),
    minThickness: z.number().min(0, "Ketebalan minimum tidak boleh negatif").optional(),
    maxThickness: z.number().min(0, "Ketebalan maksimum tidak boleh negatif").optional(),
    serviceName: z
      .string()
      .min(1, "Nama layanan wajib diisi")
      .max(200, "Nama layanan maksimal 200 karakter")
      .optional(),
    unit: processingUnitSchema.optional(),
    price: z.number().min(0, "Harga tidak boleh negatif").optional(),
  })
  .superRefine((d, ctx) => {
    if (
      d.minThickness !== undefined &&
      d.maxThickness !== undefined &&
      d.minThickness > d.maxThickness
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ketebalan minimum harus ≤ maksimum",
        path: ["maxThickness"],
      });
    }

    // Jika mode eksplisit, jangan kirim kedua jenis ketebalan sekaligus
    if (d.mode === "single" && d.minThickness !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Saat mode tunggal, field min/max tidak boleh dikirim",
        path: ["minThickness"],
      });
    }
    if (d.mode === "single" && d.maxThickness !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Saat mode tunggal, field min/max tidak boleh dikirim",
        path: ["maxThickness"],
      });
    }
    if (d.mode === "range" && d.thickness !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Saat mode range, field thickness tidak boleh dikirim",
        path: ["thickness"],
      });
    }
  });
