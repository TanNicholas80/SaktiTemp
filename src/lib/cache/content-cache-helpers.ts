import { getCache } from "./index";

export async function cachedQuery<T>(
  cacheKey: string,
  queryFn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  const cache = getCache();
  try {
    const cached = await cache.get<T>(cacheKey);
    if (cached !== null) return cached;
  } catch (error) {
    console.warn(`[cache] get failed for key "${cacheKey}", falling back to source`, error);
  }

  const result = await queryFn();

  try {
    await cache.set(cacheKey, result, ttl);
  } catch (error) {
    console.warn(`[cache] set failed for key "${cacheKey}", continuing without cache`, error);
  }

  return result;
}
