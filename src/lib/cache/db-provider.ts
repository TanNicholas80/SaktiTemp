import { eq, like, lte, and, sql } from "drizzle-orm";

import { db } from "@/db";
import { contentCache } from "@/db/schema/content-cache";

import type { CacheProvider } from "./types";

const MISSING_TABLE_CODE = "42P01";

function isMissingTableError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { code?: string; cause?: { code?: string } };
  return e.code === MISSING_TABLE_CODE || e.cause?.code === MISSING_TABLE_CODE;
}

let warned = false;
function warnOnce(operation: string, err: unknown) {
  if (warned) return;
  warned = true;
  // eslint-disable-next-line no-console
  console.warn(
    `[cache:database] ${operation} failed (table belum tersedia atau error DB). Cache di-bypass. ` +
      `Pastikan migration content_cache sudah dijalankan.`,
    err instanceof Error ? err.message : err
  );
}

export class DatabaseProvider implements CacheProvider {
  async get<T>(key: string): Promise<T | null> {
    try {
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
    } catch (err) {
      if (isMissingTableError(err)) {
        warnOnce("get", err);
        return null;
      }
      throw err;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const ttl = ttlSeconds ?? Number(process.env.CACHE_TTL ?? 300);
    const expiresAt = new Date(Date.now() + ttl * 1000);
    const serialized = JSON.stringify(value);
    const cacheValue = serialized === undefined ? "null" : serialized;

    try {
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
    } catch (err) {
      if (isMissingTableError(err)) {
        warnOnce("set", err);
        return;
      }
      throw err;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await db.delete(contentCache).where(eq(contentCache.cacheKey, key));
    } catch (err) {
      if (isMissingTableError(err)) {
        warnOnce("del", err);
        return;
      }
      throw err;
    }
  }

  async delByPrefix(prefix: string): Promise<void> {
    try {
      await db
        .delete(contentCache)
        .where(like(contentCache.cacheKey, `${prefix}%`));
    } catch (err) {
      if (isMissingTableError(err)) {
        warnOnce("delByPrefix", err);
        return;
      }
      throw err;
    }
  }

  async flush(): Promise<void> {
    try {
      await db.delete(contentCache);
    } catch (err) {
      if (isMissingTableError(err)) {
        warnOnce("flush", err);
        return;
      }
      throw err;
    }
  }
}
