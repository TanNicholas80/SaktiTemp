import { eq, like, lte, and, sql } from "drizzle-orm";

import { db } from "@/db";
import { contentCache } from "@/db/schema/content-cache";

import type { CacheProvider } from "./types";

export class DatabaseProvider implements CacheProvider {
  async get<T>(key: string): Promise<T | null> {
    const row = await db
      .select({ cacheValue: contentCache.cacheValue })
      .from(contentCache)
      .where(
        and(
          eq(contentCache.cacheKey, key),
          lte(sql`now()`, contentCache.expiresAt)
        )
      )
      .limit(1)
      .then((rows) => rows[0]);

    if (!row) return null;
    try {
      return JSON.parse(row.cacheValue) as T;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const ttl = ttlSeconds ?? Number(process.env.CACHE_TTL ?? 300);
    const expiresAt = new Date(Date.now() + ttl * 1000);
    const serialized = JSON.stringify(value);
    const cacheValue =
      serialized === undefined ? "null" : serialized;

    await db
      .insert(contentCache)
      .values({
        cacheKey: key,
        cacheValue,
        expiresAt,
      })
      .onConflictDoUpdate({
        target: contentCache.cacheKey,
        set: {
          cacheValue,
          expiresAt,
        },
      });
  }

  async del(key: string): Promise<void> {
    await db.delete(contentCache).where(eq(contentCache.cacheKey, key));
  }

  async delByPrefix(prefix: string): Promise<void> {
    await db
      .delete(contentCache)
      .where(like(contentCache.cacheKey, `${prefix}%`));
  }

  async flush(): Promise<void> {
    await db.delete(contentCache);
  }
}
