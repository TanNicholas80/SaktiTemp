import {
  pgTable,
  timestamp,
  varchar,
  doublePrecision,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";

/**
 * Master table: Daftar ketebalan (5 mm, 6,5 mm, 8 mm, dll.).
 * Nilai numerik boleh desimal. Digunakan many-to-many dengan product via productThickness.
 */
export const thickness = pgTable(
  "thickness",
  {
    thicknessId: uuid("thickness_id").primaryKey().defaultRandom(),
    thicknessValue: doublePrecision("thickness_value").notNull(),
    thicknessUnit: varchar("thickness_unit", { length: 20 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("thickness_value_unit_unique").on(
      table.thicknessValue,
      table.thicknessUnit
    ),
  ]
);
