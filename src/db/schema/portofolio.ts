import { pgTable, timestamp, uniqueIndex, index, varchar, text, boolean, integer, foreignKey, jsonb } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { categoryPortofolio } from "./category-portofolio";
import { portofolioType } from "./portofolio-type";

export const portofolio = pgTable("portofolio", {
    portofolioId: uuid("portofolio_id").primaryKey().defaultRandom(),
    categoryPortofolioId: uuid("category_portofolio_id").references(() => categoryPortofolio.categoryPortofolioId, { onDelete: "set null" }),
    portofolioTypeId: uuid("portofolio_type_id").references(() => portofolioType.portofolioTypeId, { onDelete: "set null" }),
    portofolioName: varchar("portofolio_name").notNull(),
    portofolioSlug: varchar("portofolio_slug").notNull(),
    portofolioShortDescription: varchar("portofolio_short_description", { length: 500 }).notNull().default(""),
    portofolioGalleryImages: jsonb("portofolio_gallery_images")
      .$type<{ url: string; publicId: string }[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    portofolioLocation: varchar("portofolio_location").notNull(),
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
    }).onDelete("set null"),
    foreignKey({
        columns: [table.portofolioTypeId],
        foreignColumns: [portofolioType.portofolioTypeId],
        name: "fk_portofolio_portofolio_type_id",
    }).onDelete("set null"),
    uniqueIndex("portofolio_slug_unique").on(table.portofolioSlug),
    index("portofolio_category_portofolio_id_idx").on(table.categoryPortofolioId),
    index("portofolio_portofolio_type_id_idx").on(table.portofolioTypeId),
    index("portofolio_is_published_at_idx").on(table.portofolioIsPublishedAt),
    index("portofolio_views_idx").on(table.portofolioViews),
])
