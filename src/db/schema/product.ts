import { pgTable, timestamp, uniqueIndex, varchar, text, boolean, integer, foreignKey } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { categoryProduct } from "./category-product";

export const product = pgTable("product", {
    productId: uuid("product_id").primaryKey().defaultRandom(),
    categoryProductId: uuid("category_product_id").references(() => categoryProduct.categoryProductId),
    productName: varchar("product_name").notNull(),
    productSlug: varchar("product_slug").notNull(),
    productDescription: text("product_description").notNull(),
    productImageUrl: varchar("product_image_url").notNull(),
    productImagePublicId: varchar("product_image_public_id").notNull(),
    productViews: integer("product_views").notNull().default(0),
    productIsPublished: boolean("product_is_published").notNull().default(false),
    productIsPublishedAt: timestamp("product_is_published_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
    foreignKey({
        columns: [table.categoryProductId],
        foreignColumns: [categoryProduct.categoryProductId],
        name: "fk_product_category_product_id",
    }),
    uniqueIndex("product_slug_unique").on(table.productSlug),
]);