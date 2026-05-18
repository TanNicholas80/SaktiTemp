import { getCache } from "./index";
import { revalidatePath } from "next/cache";

export async function revalidateContentCache(
  entity: string
): Promise<void> {
  const cache = getCache();
  
  const prefixes = [`content:${entity}`, `tr:${entity}`];
  
  // Dependensi Landing Page: Jika salah satu dari entitas ini berubah, cache landing juga harus dihapus
  const landingDependencies = [
    "carousel", 
    "benefit", 
    "blog", 
    "portofolio", 
    "location", 
    "contact", 
    "social-media", 
    "company-stat"
  ];
  
  if (landingDependencies.includes(entity)) {
    prefixes.push("content:landing", "tr:landing");
  }

  await Promise.all(prefixes.map(prefix => cache.delByPrefix(prefix)));

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
