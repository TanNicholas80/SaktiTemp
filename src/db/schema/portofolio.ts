import { pgTable, timestamp, uniqueIndex, varchar, text, boolean, integer, foreignKey } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { categoryPortofolio } from "./category-portofolio";

export const portofolio = pgTable("portofolio", {
    portofolioId: uuid("portofolio_id").primaryKey().defaultRandom(),
    categoryPortofolioId: uuid("category_portofolio_id").references(() => categoryPortofolio.categoryPortofolioId),
    portofolioName: varchar("portofolio_name").notNull(),
    portofolioSlug: varchar("portofolio_slug").notNull(),
    portofolioAbout: text("portofolio_about").notNull(),
    portofolioClient: varchar("portofolio_client").notNull(),
    portofolioLocation: varchar("portofolio_location").notNull(),
    portofolioYear: integer("portofolio_year").notNull().default(0),
    portofolioAreaSize: integer("portofolio_area_size").notNull().default(0),
    portofolioAreaSizeUnit: varchar("portofolio_area_size_unit").notNull(),
    portofolioImageUrl: varchar("portofolio_image_url").notNull(),
    portofolioImagePublicId: varchar("portofolio_image_public_id").notNull(),
    portofolioViews: integer("portofolio_views").notNull().default(0),
    portofolioIsPublished: boolean("portofolio_is_published").notNull().default(false),
    portofolioIsPublishedAt: timestamp("portofolio_is_published_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
    foreignKey({
        columns: [table.categoryPortofolioId],
        foreignColumns: [categoryPortofolio.categoryPortofolioId],
        name: "fk_portofolio_category_portofolio_id",
    }),
    uniqueIndex("portofolio_slug_unique").on(table.portofolioSlug),
])