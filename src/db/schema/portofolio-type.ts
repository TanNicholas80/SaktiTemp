import {
  pgTable,
  timestamp,
  uniqueIndex,
  index,
  varchar,
} from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";

/**
 * Tipe/jenis portofolio (aplikasi penggunaan) - e.g. Gedung perkantoran, Hotel & apartemen, Pusat perbelanjaan, Fasad komersial.
 * Ditampilkan di detail produk untuk menunjukkan jenis proyek yang menggunakan produk tersebut.
 */
export const portofolioType = pgTable(
  "portofolio_type",
  {
    portofolioTypeId: uuid("portofolio_type_id").primaryKey().defaultRandom(),
    portofolioTypeName: varchar("portofolio_type_name", { length: 100 })
      .notNull(),
    portofolioTypeSlug: varchar("portofolio_type_slug", { length: 100 })
      .notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("portofolio_type_name_unique").on(table.portofolioTypeName),
    uniqueIndex("portofolio_type_slug_unique").on(table.portofolioTypeSlug),
    index("portofolio_type_created_at_idx").on(table.createdAt),
  ]
);
