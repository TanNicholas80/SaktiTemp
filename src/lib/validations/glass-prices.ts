import { z } from "zod";

/** Field opsional: terima string, null, atau tidak ada; kosong/null → null di DB */
const optionalTrimmed = (max: number) =>
  z
    .union([z.string().max(max), z.null()])
    .optional()
    .transform((s) => {
      if (s === undefined || s === null) return null;
      const t = s.trim();
      return t === "" ? null : t;
    });

export const glassPriceRowCreateSchema = z.object({
  thicknessId: z.string().uuid("Ketebalan tidak valid"),
  composition: optionalTrimmed(100),
  compositionDetail: optionalTrimmed(255),
  pricePerSqm: z.number().min(0, "Harga per m2 tidak boleh negatif"),
});

export const createGlassPriceBatchSchema = z
  .object({
    glassTypeId: z.string().uuid("Tipe kaca tidak valid"),
    variant: z
      .string()
      .min(1, "Variant wajib diisi")
      .max(100, "Variant maksimal 100 karakter"),
    variantImageUrl: z
      .string()
      .min(1, "Gambar variant wajib diisi")
      .max(2048, "URL gambar terlalu panjang"),
    variantImagePublicId: z
      .string()
      .min(1, "Public ID gambar wajib diisi")
      .max(512, "Public ID gambar terlalu panjang"),
    rows: z
      .array(glassPriceRowCreateSchema)
      .min(1, "Minimal satu baris ketebalan & harga"),
  })
  .superRefine((data, ctx) => {
    const ids = data.rows.map((r) => r.thicknessId);
    const seen = new Set<string>();
    for (let i = 0; i < ids.length; i++) {
      if (seen.has(ids[i]!)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ketebalan tidak boleh duplikat dalam satu penyimpanan",
          path: ["rows", i, "thicknessId"],
        });
        return;
      }
      seen.add(ids[i]!);
    }
  });

/** Satu baris — kompatibel dengan klien lama */
export const createGlassPriceSchema = z.object({
  glassTypeId: z.string().uuid("Tipe kaca tidak valid"),
  thicknessId: z.string().uuid("Ketebalan tidak valid"),
  variant: z
    .string()
    .min(1, "Variant wajib diisi")
    .max(100, "Variant maksimal 100 karakter"),
  variantImageUrl: z
    .string()
    .min(1, "Gambar variant wajib diisi")
    .max(2048, "URL gambar terlalu panjang"),
  variantImagePublicId: z
    .string()
    .min(1, "Public ID gambar wajib diisi")
    .max(512, "Public ID gambar terlalu panjang"),
  composition: optionalTrimmed(100),
  compositionDetail: optionalTrimmed(255),
  pricePerSqm: z.number().min(0, "Harga per m2 tidak boleh negatif"),
});

function optionalPatchString(max: number) {
  return z
    .union([z.string().max(max), z.null(), z.undefined()])
    .transform((s) => {
      if (s === undefined) return undefined;
      if (s === null) return null;
      const t = s.trim();
      return t === "" ? null : t;
    });
}

export const updateGlassPriceSchema = z.object({
  glassTypeId: z.string().uuid("Tipe kaca tidak valid").optional(),
  thicknessId: z.string().uuid("Ketebalan tidak valid").optional(),
  variant: z
    .string()
    .min(1, "Variant wajib diisi")
    .max(100, "Variant maksimal 100 karakter")
    .optional(),
  variantImageUrl: z
    .string()
    .min(1, "Gambar variant wajib diisi")
    .max(2048, "URL gambar terlalu panjang")
    .optional(),
  variantImagePublicId: z
    .string()
    .min(1, "Public ID gambar wajib diisi")
    .max(512, "Public ID gambar terlalu panjang")
    .optional(),
  composition: optionalPatchString(100),
  compositionDetail: optionalPatchString(255),
  pricePerSqm: z.number().min(0, "Harga per m2 tidak boleh negatif").optional(),
});
