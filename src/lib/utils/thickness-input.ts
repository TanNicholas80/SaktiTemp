/**
 * Parse input ketebalan: titik atau koma sebagai desimal; opsional format 1.234,5 (EU).
 * Mengembalikan null jika kosong atau tidak valid (harus > 0).
 */
export function parseThicknessValueInput(raw: string): number | null {
  let s = raw.trim().replace(/\s/g, "");
  if (s === "") return null;

  if (s.includes(",") && s.includes(".")) {
    const lastComma = s.lastIndexOf(",");
    const lastDot = s.lastIndexOf(".");
    if (lastComma > lastDot) {
      s = s.replace(/\./g, "").replace(",", ".");
    } else {
      s = s.replace(/,/g, "");
    }
  } else {
    s = s.replace(",", ".");
  }

  const n = Number(s);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

/** Tampilan default di field (angka dari API / state) */
export function thicknessValueToInputString(value: number): string {
  if (value == null || !Number.isFinite(value)) return "";
  return String(value);
}
