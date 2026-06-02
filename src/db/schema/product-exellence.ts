import { pgTable, timestamp, text, foreignKey, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { product } from "./product";

export const productExellence = pgTable("product-exellence", {
    productExellenceId: uuid("product_exellence_id").primaryKey().defaultRandom(),
    productId: uuid("product_id").references(() => product.productId, { onDelete: "cascade" }),
    productExellenceDescription: text("product_exellence_description").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
    foreignKey({
        columns: [table.productId],
        foreignColumns: [product.productId],
        name: "fk_product_exellence_product_id",
    }).onDelete("cascade"),
    index("product_exellence_product_id_idx").on(table.productId),
]);
