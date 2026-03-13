import {
  pgTable,
  timestamp,
  foreignKey,
  index,
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";
import { product } from "./product";
import { thickness } from "./thickness";

/**
 * Junction table: Product ↔ Thickness (many-to-many).
 * Satu product dapat punya banyak ketebalan, satu ketebalan bisa dipakai banyak product.
 */
export const productThickness = pgTable(
  "product_thickness",
  {
    productId: uuid("product_id")
      .references(() => product.productId, { onDelete: "cascade" })
      .notNull(),
    thicknessId: uuid("thickness_id")
      .references(() => thickness.thicknessId, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.productId, table.thicknessId] }),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [product.productId],
      name: "fk_product_thickness_product_id",
    }),
    foreignKey({
      columns: [table.thicknessId],
      foreignColumns: [thickness.thicknessId],
      name: "fk_product_thickness_thickness_id",
    }),
    index("product_thickness_product_id_idx").on(table.productId),
    index("product_thickness_thickness_id_idx").on(table.thicknessId),
  ]
);
