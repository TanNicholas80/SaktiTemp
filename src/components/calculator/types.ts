// --- Data types (from DB, passed as props) ---

export type GlassType = {
  glassTypeId: string;
  glassTypeName: string;
  glassTypeImageUrl: string;
};

export type GlassPrice = {
  glassPricesId: string;
  glassTypeId: string;
  thicknessId: string;
  /** Nama varian untuk tampilan (terjemahan sesuai locale). */
  variant: string;
  /** Kunci varian dasar (bahasa Indonesia) untuk pencocokan internal. */
  variantKey: string;
  variantImageUrl: string;
  composition: string | null;
  compositionDetail: string | null;
  pricePerSqm: number;
  thicknessValue: number;
  thicknessUnit: string;
};

// --- Calculator state types ---

export type GlassSpec = {
  glassTypeId: string | null;
  /** Kunci varian dasar yang dipilih user (bukan label terjemahan). */
  variantKey: string | null;
  thicknessId: string | null;
  panjang: string;
  lebar: string;
  /** Jumlah lembar kaca yang dipesan (raw input string, default "1") */
  quantity: string;
};

// --- Calculation result types ---

export type CalcBreakdown = {
  /** Harga material per lembar: pricePerSqm × luas (tanpa surcharge dimensi). */
  materialCost: number;
  /** Tambahan % dari material dasar per lembar sesuai aturan lembaran */
  dimensionSurcharge: number;
  /** 0, 0.1, atau 0.2 — untuk label ringkasan */
  dimensionSurchargeRate?: 0 | 0.1 | 0.2;
  /** Biaya Flat Polish Edging per lembar: ((panjang + lebar) / 1000) * 2 * harga berdasarkan ketebalan */
  flatPolishEdgingCost: number;
  /** True saat spesifikasi kaca + dimensi sudah lengkap, sehingga baris Flat Polish Edging ditampilkan. */
  flatPolishEdgingIncluded: boolean;
  /** Jumlah lembar kaca yang dipesan (>= 1 saat valid; 0 jika belum diisi). */
  quantity: number;
  /** Subtotal per lembar: materialCost + dimensionSurcharge + flatPolishEdgingCost (sebelum dikali quantity) */
  subtotalPerSheet: number;
  /** Subtotal total = subtotalPerSheet × quantity */
  subtotal: number;
  ppn: number;
  grandTotal: number;
};

// --- Props for CalculatorSection ---

export type CalculatorSectionProps = {
  glassTypes: GlassType[];
  glassPrices: GlassPrice[];
};
