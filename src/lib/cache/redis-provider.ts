import type { CacheProvider } from "./types";

const KEY_PREFIX = "saktitemp:";

let redisClient: import("ioredis").default | null = null;

async function getRedis() {
  if (redisClient) return redisClient;
  const { default: Redis } = await import("ioredis");
  redisClient = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });
  await redisClient.connect();
  return redisClient;
}

export class RedisProvider implements CacheProvider {
  async get<T>(key: string): Promise<T | null> {
    const redis = await getRedis();
    const raw = await redis.get(KEY_PREFIX + key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const redis = await getRedis();
    const ttl = ttlSeconds ?? Number(process.env.CACHE_TTL ?? 300);
    await redis.set(KEY_PREFIX + key, JSON.stringify(value), "EX", ttl);
  }

  async del(key: string): Promise<void> {
    const redis = await getRedis();
    await redis.del(KEY_PREFIX + key);
  }

  async delByPrefix(prefix: string): Promise<void> {
    const redis = await getRedis();
    const fullPrefix = KEY_PREFIX + prefix;
    let cursor = "0";
    do {
      const [next, keys] = await redis.scan(
        cursor,
        "MATCH",
        fullPrefix + "*",
        "COUNT",
        200
      );
      cursor = next;
      if (keys.length > 0) await redis.del(...keys);
    } while (cursor !== "0");
  }

  async flush(): Promise<void> {
    const redis = await getRedis();
    let cursor = "0";
    do {
      const [next, keys] = await redis.scan(
        cursor,
        "MATCH",
        KEY_PREFIX + "*",
        "COUNT",
        200
      );
      cursor = next;
      if (keys.length > 0) await redis.del(...keys);
    } while (cursor !== "0");
  }
}
