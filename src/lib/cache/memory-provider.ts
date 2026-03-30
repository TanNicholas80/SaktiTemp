import type { CacheProvider } from "./types";

interface MemoryEntry {
  value: unknown;
  expiresAt: number;
}

const store = new Map<string, MemoryEntry>();
const MAX_SIZE = 2000;

function evict(): void {
  if (store.size < MAX_SIZE) return;
  const now = Date.now();
  for (const [k, v] of store) {
    if (v.expiresAt <= now) store.delete(k);
  }
  if (store.size >= MAX_SIZE) {
    const first = store.keys().next().value;
    if (first) store.delete(first);
  }
}

export class MemoryProvider implements CacheProvider {
  async get<T>(key: string): Promise<T | null> {
    const entry = store.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= Date.now()) {
      store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    evict();
    const ttl = ttlSeconds ?? Number(process.env.CACHE_TTL ?? 300);
    store.set(key, { value, expiresAt: Date.now() + ttl * 1000 });
  }

  async del(key: string): Promise<void> {
    store.delete(key);
  }

  async delByPrefix(prefix: string): Promise<void> {
    for (const k of store.keys()) {
      if (k.startsWith(prefix)) store.delete(k);
    }
  }

  async flush(): Promise<void> {
    store.clear();
  }
}
