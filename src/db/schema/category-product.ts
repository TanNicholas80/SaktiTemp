import { pgTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";

export const categoryProduct = pgTable("category-product", {
    categoryProductId: uuid("category_product_id").primaryKey().defaultRandom(),
    categoryProductName: varchar("category_product_name").notNull(),
    categoryProductSlug: varchar("category_product_slug").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
} , (table) => [
    uniqueIndex("category_product_name_unique").on(table.categoryProductName),
    uniqueIndex("category_product_slug_unique").on(table.categoryProductSlug),
]);