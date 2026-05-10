import { getCache } from "./index";

export async function revalidateContentCache(
  entity: string
): Promise<void> {
  const cache = getCache();
  await Promise.all([
    cache.delByPrefix(`content:${entity}`),
    cache.delByPrefix(`tr:${entity}`),
  ]);
}

export async function revalidateAllCache(): Promise<void> {
  const cache = getCache();
  await cache.flush();
}
