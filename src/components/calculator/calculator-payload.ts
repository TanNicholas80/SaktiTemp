import type { CalcBreakdown } from "./types";

export const CALCULATOR_RINCIAN_STORAGE_KEY = "saktitemp-calculator-rincian-v1";

export type CalculatorRincianPayload = {
  breakdown: CalcBreakdown;
  glassTypeName?: string;
  variant?: string;
  thicknessLabel?: string;
  panjang?: string;
  lebar?: string;
  savedAt: string;
};

export function saveCalculatorRincianPayload(payload: Omit<CalculatorRincianPayload, "savedAt">) {
  if (typeof window === "undefined") return;
  const full: CalculatorRincianPayload = {
    ...payload,
    savedAt: new Date().toISOString(),
  };
  try {
    sessionStorage.setItem(CALCULATOR_RINCIAN_STORAGE_KEY, JSON.stringify(full));
  } catch {
    /* ignore quota / private mode */
  }
}

export function loadCalculatorRincianPayload(): CalculatorRincianPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CALCULATOR_RINCIAN_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CalculatorRincianPayload;
  } catch {
    return null;
  }
}

export function buildCalculatorWhatsAppLines(opts: {
  selectedGlassTypeName?: string;
  glassSpec: { variant: string | null; thicknessLabel?: string; panjang: string; lebar: string };
  breakdown: CalcBreakdown;
}): string[] {
  const { selectedGlassTypeName, glassSpec, breakdown } = opts;
  const lines: string[] = ["Rincian Estimasi Kalkulator SAKTITEMP", ""];

  if (selectedGlassTypeName) {
    lines.push(
      `Spesifikasi Kaca: ${selectedGlassTypeName}${
        glassSpec.variant ? " - " + glassSpec.variant : ""
      }${glassSpec.thicknessLabel ? " (" + glassSpec.thicknessLabel + ")" : ""}`
    );
  }
  if (glassSpec.panjang && glassSpec.lebar) {
    lines.push(`Dimensi: ${glassSpec.panjang} mm x ${glassSpec.lebar} mm`);
  }
  if (breakdown.addOnCosts.length > 0) {
    lines.push(`Add-On: ${breakdown.addOnCosts.map((a) => a.label).join(", ")}`);
  }
  lines.push("");
  lines.push(
    `Sub-Total: Rp ${Math.round(breakdown.subtotal).toLocaleString("id-ID")}`
  );
  lines.push(`PPN (11%): Rp ${Math.round(breakdown.ppn).toLocaleString("id-ID")}`);
  lines.push(
    `Estimasi Grand Total: Rp ${Math.round(breakdown.grandTotal).toLocaleString("id-ID")}`
  );
  lines.push("");
  lines.push("Catatan: Estimasi ini belum final.");
  lines.push("Mohon konfirmasi ke tim SAKTITEMP untuk penawaran resmi.");
  return lines;
}
