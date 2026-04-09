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
  variant: string;
  variantImageUrl: string;
  composition: string | null;
  compositionDetail: string | null;
  pricePerSqm: number;
  thicknessValue: number;
  thicknessUnit: string;
};

export type ProcessingCategory = {
  processingCategoryId: string;
  categoryName: string;
  categoryImageUrl: string;
};

export type ProcessingPrice = {
  processingPricesId: string;
  categoryId: string;
  thickness: number | null;
  minThickness: number | null;
  maxThickness: number | null;
  serviceName: string;
  unit: "m1" | "pcs" | "sqm" | "none";
  price: number;
};

// --- Calculator state types ---

export type GlassSpec = {
  glassTypeId: string | null;
  variant: string | null;
  thicknessId: string | null;
  panjang: string;
  lebar: string;
};

export type AddOnItem = {
  id: string;
  categoryId: string | null;
  serviceName: string | null;
  thicknessValue: string;
  quantity: string;
};

// --- Calculation result types ---

export type CalcBreakdown = {
  /** Harga material: pricePerSqm × luas (tanpa surcharge dimensi) */
  materialCost: number;
  /** Tambahan % dari material dasar sesuai aturan lembaran */
  dimensionSurcharge: number;
  /** 0, 0.1, atau 0.2 — untuk label ringkasan */
  dimensionSurchargeRate?: 0 | 0.1 | 0.2;
  addOnCosts: Array<{ label: string; cost: number }>;
  subtotal: number;
  ppn: number;
  grandTotal: number;
};

// --- Props for CalculatorSection ---

export type CalculatorSectionProps = {
  glassTypes: GlassType[];
  glassPrices: GlassPrice[];
  processingCategories: ProcessingCategory[];
  processingPrices: ProcessingPrice[];
};
