import { pgTable, timestamp, varchar, foreignKey, index, text, boolean } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { product } from "./product";

export const productApplication = pgTable("product-application", {
    productApplicationId: uuid("product_application_id").primaryKey().defaultRandom(),
    productId: uuid("product_id").references(() => product.productId, { onDelete: "cascade" }),
    productApplicationImageUrl: varchar("product_application_image_url").notNull(),
    productApplicationImagePublicId: varchar("product_application_image_public_id").notNull(),
    productApplicationName: varchar("product_application_name").notNull(),
    productApplicationDescription: text("product_application_description").notNull(),
    productApplicationSlug: varchar("product_application_slug").notNull().unique(),
    productApplicationIsPublished: boolean("product_application_is_published").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
    foreignKey({
        columns: [table.productId],
        foreignColumns: [product.productId],
        name: "fk_product_application_product_id",
    }).onDelete("cascade"),
    index("product_application_product_id_idx").on(table.productId),
]);
