/**
 * In-memory cache untuk hasil terjemahan.
 * Key: hash(content + targetLocale) → { heading, subheading, description }
 * Invalidasi otomatis saat konten source berubah (karena hash ikut berubah).
 */

export type CachedTranslation = {
  heading: string;
  subheading: string;
  description: string;
};

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

function cacheKey(
  heading: string,
  subheading: string,
  description: string,
  targetLocale: string
): string {
  const content = `${heading}|${subheading}|${description}`;
  return `${targetLocale}:${simpleHash(content)}`;
}

const cache = new Map<string, CachedTranslation>();

const MAX_CACHE_SIZE = 500;

function evictIfNeeded(): void {
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }
}

export function getCached(
  heading: string,
  subheading: string,
  description: string,
  targetLocale: string
): CachedTranslation | null {
  const key = cacheKey(heading, subheading, description, targetLocale);
  return cache.get(key) ?? null;
}

export function setCached(
  heading: string,
  subheading: string,
  description: string,
  targetLocale: string,
  translated: CachedTranslation
): void {
  evictIfNeeded();
  const key = cacheKey(heading, subheading, description, targetLocale);
  cache.set(key, translated);
}
