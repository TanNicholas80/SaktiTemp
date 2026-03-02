import { pgTable, timestamp, text, foreignKey } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { product } from "./product";
import { portofolio } from "./portofolio";

export const productPortofolio = pgTable("product-portofolio", {
    productPortofolioId: uuid("product_portofolio_id").primaryKey().defaultRandom(),
    productId: uuid("product_id").references(() => product.productId),
    portofolioId: uuid("portofolio_id").references(() => portofolio.portofolioId),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
    foreignKey({
        columns: [table.productId],
        foreignColumns: [product.productId],
        name: "fk_product_portofolio_product_id",
    }),
    foreignKey({
        columns: [table.portofolioId],
        foreignColumns: [portofolio.portofolioId],
        name: "fk_product_portofolio_portofolio_id",
    }),
]);