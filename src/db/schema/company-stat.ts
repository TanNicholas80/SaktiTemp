import {
  pgTable,
  timestamp,
  varchar,
  integer,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";

export const companyStat = pgTable("company_stat", {
  companyStatId: uuid("company_stat_id").primaryKey().defaultRandom(),
  value: varchar("value", { length: 50 }).notNull(), // 15+, 500+, 100+, 99%
  label: varchar("label", { length: 100 }).notNull(), // Tahun Pengalaman, Proyek Selesai, dll
  displayOrder: integer("display_order").notNull().default(1),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("company_stat_display_order_idx").on(table.displayOrder),
]);
