import { getCache } from "./index";

export async function cachedQuery<T>(
  cacheKey: string,
  queryFn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  const cache = getCache();
  const cached = await cache.get<T>(cacheKey);
  if (cached !== null) return cached;
  const result = await queryFn();
  await cache.set(cacheKey, result, ttl);
  return result;
}
