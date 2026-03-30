import type { CacheProvider } from "./types";
import { RedisProvider } from "./redis-provider";
import { DatabaseProvider } from "./db-provider";
import { MemoryProvider } from "./memory-provider";

export type { CacheProvider };

let provider: CacheProvider | null = null;

export function getCache(): CacheProvider {
  if (provider) return provider;

  const mode = (process.env.CACHE_PROVIDER ?? "memory").toLowerCase();

  switch (mode) {
    case "redis": {
      provider = new RedisProvider();
      break;
    }
    case "database":
    case "db": {
      provider = new DatabaseProvider();
      break;
    }
    default: {
      provider = new MemoryProvider();
      break;
    }
  }

  return provider;
}

export function contentCacheKey(
  entity: string,
  id?: string,
  locale?: string
): string {
  const parts = ["content", entity];
  if (locale) parts.push(locale);
  if (id) parts.push(id);
  return parts.join(":");
}

export function translateCacheKey(
  entity: string,
  hash: string,
  locale: string
): string {
  return `tr:${entity}:${locale}:${hash}`;
}
