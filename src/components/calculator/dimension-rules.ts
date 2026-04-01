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

export type DimensionValidation =
  | { ok: true }
  | { ok: false; message: string };

export function validateGlassDimensions(
  panjang: number,
  lebar: number
): DimensionValidation {
  if (!Number.isFinite(panjang) || !Number.isFinite(lebar)) {
    return { ok: false, message: "Masukkan panjang dan lebar yang valid." };
  }
  if (panjang < GLASS_DIM_MM.MIN_PANJANG || lebar < GLASS_DIM_MM.MIN_LEBAR) {
    return {
      ok: false,
      message: `Ukuran minimal ${GLASS_DIM_MM.MIN_PANJANG} mm × ${GLASS_DIM_MM.MIN_LEBAR} mm.`,
    };
  }
  if (panjang > GLASS_DIM_MM.MAX_PANJANG || lebar > GLASS_DIM_MM.MAX_LEBAR) {
    return {
      ok: false,
      message: `Ukuran maksimal ${GLASS_DIM_MM.MAX_PANJANG} mm × ${GLASS_DIM_MM.MAX_LEBAR} mm. Hubungi kami untuk ukuran khusus.`,
    };
  }
  return { ok: true };
}

/** Surcharge mengacu pada persentase material dasar (harga × luas), bukan termasuk add-on. */
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

export function dimensionSurchargeLabel(rate: 0 | 0.1 | 0.2): string {
  if (rate === 0.2) return "(+20% Surcharge)";
  if (rate === 0.1) return "(+10% Surcharge)";
  return "";
}
