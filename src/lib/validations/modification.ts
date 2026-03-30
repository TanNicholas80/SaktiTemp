import { z } from "zod";

const sharedImageFields = {
  modificationImageUrl: z
    .string()
    .min(1, "Gambar wajib diisi")
    .max(2048, "URL gambar terlalu panjang"),
  modificationImagePublicId: z
    .string()
    .min(1, "Public ID gambar wajib diisi")
    .max(512, "Public ID gambar terlalu panjang"),
};

export const modificationRowCreateSchema = z.object({
  thicknessId: z.string().uuid("Ketebalan tidak valid"),
  pricePerSide: z.number().min(0, "Harga per sisi tidak boleh negatif"),
});

export const createModificationBatchSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nama modifikasi wajib diisi")
      .max(150, "Nama maksimal 150 karakter"),
    ...sharedImageFields,
    rows: z.array(modificationRowCreateSchema).min(1, "Minimal satu baris"),
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

export const createModificationSchema = z.object({
  name: z
    .string()
    .min(1, "Nama modifikasi wajib diisi")
    .max(150, "Nama maksimal 150 karakter"),
  thicknessId: z.string().uuid("Ketebalan tidak valid"),
  ...sharedImageFields,
  pricePerSide: z.number().min(0, "Harga per sisi tidak boleh negatif"),
});

export const updateModificationSchema = z.object({
  name: z
    .string()
    .min(1, "Nama modifikasi wajib diisi")
    .max(150, "Nama maksimal 150 karakter")
    .optional(),
  thicknessId: z.string().uuid("Ketebalan tidak valid").optional(),
  modificationImageUrl: z
    .string()
    .min(1, "Gambar wajib diisi")
    .max(2048, "URL gambar terlalu panjang")
    .optional(),
  modificationImagePublicId: z
    .string()
    .min(1, "Public ID gambar wajib diisi")
    .max(512, "Public ID gambar terlalu panjang")
    .optional(),
  pricePerSide: z
    .number()
    .min(0, "Harga per sisi tidak boleh negatif")
    .optional(),
});
