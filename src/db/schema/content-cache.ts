import { pgTable, varchar, text, timestamp, index } from "drizzle-orm/pg-core";

export const contentCache = pgTable(
  "content_cache",
  {
    cacheKey: varchar("cache_key", { length: 512 }).primaryKey(),
    cacheValue: text("cache_value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("content_cache_expires_idx").on(table.expiresAt)]
);
