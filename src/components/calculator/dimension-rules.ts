/**
 * Aturan dimensi lembaran kaca untuk kalkulator (mm).
 * - Di atas 2130×3044 hingga 2435×3655: surcharge 10% dari material dasar
 * - Di atas 3655 lebar (sampai 4800) dalam rentang panjang yang diizinkan: surcharge 20%
 */

export const GLASS_DIM_MM = {
  MIN_PANJANG: 200,
  MIN_LEBAR: 450,
  MAX_PANJANG: 2435,
  MAX_LEBAR: 4800,
  STD_PANJANG: 2130,
  STD_LEBAR: 3044,
  TIER1_MAX_PANJANG: 2435,
  TIER1_MAX_LEBAR: 3655,
  TIER2_MAX_LEBAR: 4800,
} as const;

/**
 * Harga Flat Polish Edging per meter berdasarkan ketebalan satu lapisan kaca (mm).
 * Ketebalan yang belum tersedia pada daftar mengembalikan 0.
 */
export function getFlatPolishEdgingPricePerMeter(thicknessValue?: number): number {
  if (typeof thicknessValue !== "number" || !Number.isFinite(thicknessValue)) return 0;
  if (thicknessValue === 12) return 23000;
  if (thicknessValue >= 5 && thicknessValue <= 6) return 10500;
  if (thicknessValue >= 8 && thicknessValue <= 10) return 20000;
  if (thicknessValue >= 15 && thicknessValue <= 19) return 88000;
  return 0;
}

/**
 * Parse compositionDetail kaca laminated untuk mengekstrak ketebalan setiap lapisan kaca.
 *
 * Format yang didukung (contoh dari DB):
 *   "5 mm + 0,78 mm + 5 mm"
 *   "4mm Temp + 0,76 + 4mm Temp"
 *   "10mm + 0,76 + 10mm"
 *
 * Cara kerja:
 *   - Ekstrak semua angka dari string (ganti koma desimal → titik)
 *   - Lapisan kaca = nilai >= 1 mm (film interlayer PVB/EVA selalu < 1: 0,38 / 0,76 / 0,78)
 *
 * Mengembalikan null jika string kosong atau tidak mengandung lapisan kaca yang valid.
 */
export function parseLaminatedGlassLayers(
  compositionDetail: string | null | undefined
): { layerThicknessMm: number; layerCount: number } | null {
  if (!compositionDetail || !compositionDetail.trim()) return null;

  const text = compositionDetail.replace(/,/g, ".");
  const allValues: number[] = [];
  const numRegex = /(\d+(?:\.\d+)?)/g;
  let m: RegExpExecArray | null;
  while ((m = numRegex.exec(text)) !== null) {
    const v = parseFloat(m[1]);
    if (Number.isFinite(v)) allValues.push(v);
  }

  // Lapisan kaca >= 1 mm; film interlayer (PVB/EVA) < 1 mm
  const glassLayers = allValues.filter((v) => v >= 1);
  if (glassLayers.length === 0) return null;

  return {
    layerThicknessMm: glassLayers[0],
    layerCount: glassLayers.length,
  };
}

export type DimensionValidation =
  | { ok: true }
  | { ok: false; code: "invalid_number" | "min_size" | "max_size" };

export function validateGlassDimensions(
  panjang: number,
  lebar: number
): DimensionValidation {
  if (!Number.isFinite(panjang) || !Number.isFinite(lebar)) {
    return { ok: false, code: "invalid_number" };
  }
  if (panjang < GLASS_DIM_MM.MIN_PANJANG || lebar < GLASS_DIM_MM.MIN_LEBAR) {
    return { ok: false, code: "min_size" };
  }
  if (panjang > GLASS_DIM_MM.MAX_PANJANG || lebar > GLASS_DIM_MM.MAX_LEBAR) {
    return { ok: false, code: "max_size" };
  }
  return { ok: true };
}

/** Surcharge mengacu pada persentase material dasar (harga × luas), terpisah dari Flat Polish Edging. */
export function getDimensionSurchargeRate(
  panjang: number,
  lebar: number
): 0 | 0.1 | 0.2 {
  const v = validateGlassDimensions(panjang, lebar);
  if (!v.ok) return 0;

  const tier2 =
    lebar > GLASS_DIM_MM.TIER1_MAX_LEBAR &&
    lebar <= GLASS_DIM_MM.TIER2_MAX_LEBAR &&
    panjang <= GLASS_DIM_MM.MAX_PANJANG;

  if (tier2) return 0.2;

  const tier1 =
    (panjang > GLASS_DIM_MM.STD_PANJANG || lebar > GLASS_DIM_MM.STD_LEBAR) &&
    panjang <= GLASS_DIM_MM.TIER1_MAX_PANJANG &&
    lebar <= GLASS_DIM_MM.TIER1_MAX_LEBAR;

  if (tier1) return 0.1;

  return 0;
}

type TranslateFn = (
  key: string,
  values?: Record<string, string | number | Date>
) => string;

export function dimensionValidationMessage(
  result: DimensionValidation,
  t: TranslateFn
): string | null {
  if (result.ok) return null;
  if (result.code === "invalid_number") return t("invalidNumber");
  if (result.code === "min_size") {
    return t("minSize", {
      minPanjang: GLASS_DIM_MM.MIN_PANJANG,
      minLebar: GLASS_DIM_MM.MIN_LEBAR,
    });
  }
  return t("maxSize", {
    maxPanjang: GLASS_DIM_MM.MAX_PANJANG,
    maxLebar: GLASS_DIM_MM.MAX_LEBAR,
  });
}

export function dimensionSurchargeLabel(
  rate: 0 | 0.1 | 0.2,
  t: TranslateFn
): string {
  if (rate === 0.2) return t("surcharge20");
  if (rate === 0.1) return t("surcharge10");
  return "";
}
