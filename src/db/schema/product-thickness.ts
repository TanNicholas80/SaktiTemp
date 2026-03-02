import { pgTable, timestamp, varchar, integer, foreignKey } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { product } from "./product";

export const productThickness = pgTable("product-thickness", {
    productThicknessId: uuid("product_thickness_id").primaryKey().defaultRandom(),
    productId: uuid("product_id").references(() => product.productId),
    productThicknessValue: integer("product_thickness_value").notNull(),
    productThicknessUnit: varchar("product_thickness_unit").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
    foreignKey({
        columns: [table.productId],
        foreignColumns: [product.productId],
        name: "fk_product_thickness_product_id",
    }),
]);