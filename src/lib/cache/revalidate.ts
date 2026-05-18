import { getCache } from "./index";
import { revalidatePath } from "next/cache";

export async function revalidateContentCache(
  entity: string
): Promise<void> {
  const cache = getCache();

  const prefixes = [`content:${entity}`, `tr:${entity}`];

  // 1. Entitas Global: Digunakan di Footer/Header hampir semua halaman
  const globalDependencies = ["contact", "social-media", "hero-section", "category-product"];
  if (globalDependencies.includes(entity)) {
    prefixes.push(
      "content:landing", "tr:landing",
      "content:article", "tr:article",
      "content:product", "tr:product",
      "content:portofolio", "tr:portofolio",
      "content:about", "tr:about",
      "content:calculator", "tr:calculator",
      "content:calculator-rician", "tr:calculator-rician"
    );
  }

  // 2. Dependensi Halaman Landing (Beranda)
  const landingDependencies = ["carousel", "benefit", "blog", "category-blog", "portofolio", "location", "company-stat", "product"];
  if (landingDependencies.includes(entity) && !prefixes.includes("content:landing")) {
    prefixes.push("content:landing", "tr:landing");
  }

  // 3. Dependensi Halaman Artikel
  if (["blog", "category-blog"].includes(entity) && !prefixes.includes("content:article")) {
    prefixes.push("content:article", "tr:article");
  }

  // 4. Dependensi Halaman Produk
  if (["product", "portofolio", "product-application"].includes(entity) && !prefixes.includes("content:product")) {
    prefixes.push("content:product", "tr:product");
  }

  // 5. Dependensi Halaman Portofolio
  if (["portofolio", "category-portofolio", "product", "product-application"].includes(entity) && !prefixes.includes("content:portofolio")) {
    prefixes.push("content:portofolio", "tr:portofolio");
  }

  // 6. Dependensi Halaman About / Contact
  if (["company-stat", "location"].includes(entity) && !prefixes.includes("content:about")) {
    prefixes.push("content:about", "tr:about");
  }

  // 7. Dependensi Halaman Calculator
  const calculatorDependencies = ["thickness", "glass-types", "glass-prices", "processing-categories", "processing-prices"];
  if (calculatorDependencies.includes(entity) && !prefixes.includes("content:calculator")) {
    prefixes.push(
      "content:calculator", "tr:calculator",
      "content:calculator-rician", "tr:calculator-rician"
    );
  }

  // Filter agar array unik (tidak ada duplikat prefix)
  const uniquePrefixes = Array.from(new Set(prefixes));
  
  await Promise.all(uniquePrefixes.map(prefix => cache.delByPrefix(prefix)));

  // Menghapus cache ISR Next.js secara global agar layout & page ter-refresh
  try {
    revalidatePath("/", "layout");
  } catch (err) {
    console.error("[Cache] Failed to revalidate Next.js path", err);
  }
}

export async function revalidateAllCache(): Promise<void> {
  const cache = getCache();
  await cache.flush();

  try {
    revalidatePath("/", "layout");
  } catch (err) {
    console.error("[Cache] Failed to revalidate Next.js path", err);
  }
}
