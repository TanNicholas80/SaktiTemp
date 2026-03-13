import {
  pgTable,
  timestamp,
  varchar,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";

/**
 * Master table: Daftar ketebalan yang tersedia (5mm, 6mm, 8mm, dll).
 * Digunakan many-to-many dengan product via productThickness junction.
 */
export const thickness = pgTable(
  "thickness",
  {
    thicknessId: uuid("thickness_id").primaryKey().defaultRandom(),
    thicknessValue: integer("thickness_value").notNull(),
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
