import {
  pgTable,
  timestamp,
  foreignKey,
  index,
  uuid,
} from "drizzle-orm/pg-core";
import { productApplication } from "./product-application";
import { portofolio } from "./portofolio";

/**
 * Junction table: Product Application ↔ Portofolio (many-to-many).
 * Satu product application (e.g. Glass Railing System) dapat dipakai di banyak portofolio,
 * dan satu portofolio dapat punya banyak product application.
 *
 * Kolom custom opsional untuk override data spesifik per proyek (deskripsi/gambar).
 */
export const productApplicationPortofolio = pgTable(
  "product-application-portofolio",
  {
    productApplicationPortofolioId: uuid(
      "product_application_portofolio_id"
    )
      .primaryKey()
      .defaultRandom(),
    productApplicationId: uuid("product_application_id").references(
      () => productApplication.productApplicationId,
      { onDelete: "cascade" }
    ),
    portofolioId: uuid("portofolio_id").references(
      () => portofolio.portofolioId,
      { onDelete: "cascade" }
    ),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.productApplicationId],
      foreignColumns: [productApplication.productApplicationId],
      name: "fk_product_application_portofolio_product_application_id",
    }),
    foreignKey({
      columns: [table.portofolioId],
      foreignColumns: [portofolio.portofolioId],
      name: "fk_product_application_portofolio_portofolio_id",
    }),
    index("product_application_portofolio_product_application_id_idx").on(
      table.productApplicationId
    ),
    index("product_application_portofolio_portofolio_id_idx").on(
      table.portofolioId
    ),
  ]
);
