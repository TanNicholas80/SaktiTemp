import { z } from "zod";

const embedUrlSchema = z
  .string()
  .min(1, "URL embed peta wajib diisi")
  .refine(
    (val) => {
      try {
        const url = new URL(val.trim());
        return url.protocol === "https:" || url.protocol === "http:";
      } catch {
        return false;
      }
    },
    { message: "Format URL embed peta tidak valid. Gunakan link embed dari Google Maps (Share → Embed a map)." }
  );

export const createLocationSchema = z.object({
  locationCity: z
    .string()
    .min(2, "Nama kota minimal 2 karakter")
    .max(100, "Nama kota maksimal 100 karakter"),
  locationType: z.enum(["branch", "head"]),
  locationAddress: z.string().min(1, "Alamat wajib diisi"),
  locationMapUrl: z.string().min(1, "URL Google Maps wajib diisi"),
  locationMapEmbedUrl: embedUrlSchema,
  locationIsPublished: z.boolean().default(false),
});

export const updateLocationSchema = z.object({
  locationCity: z
    .string()
    .min(2, "Nama kota minimal 2 karakter")
    .max(100, "Nama kota maksimal 100 karakter")
    .optional(),
  locationType: z.enum(["branch", "head"]).optional(),
  locationAddress: z.string().min(1, "Alamat wajib diisi").optional(),
  locationMapUrl: z.string().min(1, "URL Google Maps wajib diisi").optional(),
  locationMapEmbedUrl: embedUrlSchema.optional(),
  locationIsPublished: z.boolean().optional(),
});

export type CreateLocationInput = z.infer<typeof createLocationSchema>;
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
