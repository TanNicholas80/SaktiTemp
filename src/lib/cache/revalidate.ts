import { getCache } from "./index";

export async function revalidateContentCache(
  entity: string
): Promise<void> {
  const cache = getCache();
  try {
    await Promise.all([
      cache.delByPrefix(`content:${entity}`),
      cache.delByPrefix(`tr:${entity}`),
    ]);
  } catch (error) {
    console.warn(`[cache] revalidate failed for entity "${entity}"`, error);
  }
}

export async function revalidateAllCache(): Promise<void> {
  const cache = getCache();
  try {
    await cache.flush();
  } catch (error) {
    console.warn("[cache] flush failed", error);
  }
}
