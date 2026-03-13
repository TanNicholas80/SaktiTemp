import { pgTable, timestamp, uniqueIndex, index, varchar, text, boolean, integer, foreignKey } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { categoryPortofolio } from "./category-portofolio";
import { portofolioType } from "./portofolio-type";

export const portofolio = pgTable("portofolio", {
    portofolioId: uuid("portofolio_id").primaryKey().defaultRandom(),
    categoryPortofolioId: uuid("category_portofolio_id").references(() => categoryPortofolio.categoryPortofolioId),
    portofolioTypeId: uuid("portofolio_type_id").references(() => portofolioType.portofolioTypeId),
    portofolioName: varchar("portofolio_name").notNull(),
    portofolioSlug: varchar("portofolio_slug").notNull(),
    portofolioShortDescription: varchar("portofolio_short_description", { length: 500 }).notNull().default(""),
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
    foreignKey({
        columns: [table.portofolioTypeId],
        foreignColumns: [portofolioType.portofolioTypeId],
        name: "fk_portofolio_portofolio_type_id",
    }),
    uniqueIndex("portofolio_slug_unique").on(table.portofolioSlug),
    index("portofolio_category_portofolio_id_idx").on(table.categoryPortofolioId),
    index("portofolio_portofolio_type_id_idx").on(table.portofolioTypeId),
    index("portofolio_is_published_at_idx").on(table.portofolioIsPublishedAt),
    index("portofolio_views_idx").on(table.portofolioViews),
])