import { pgTable, timestamp, uniqueIndex, index, varchar, text } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";

export const categoryPortofolio = pgTable("category-portofolio", {
    categoryPortofolioId: uuid("category_portofolio_id").primaryKey().defaultRandom(),
    categoryPortofolioName: varchar("category_portofolio_name").notNull(),
    categoryPortofolioSlug: varchar("category_portofolio_slug").notNull(),
    categoryPortofolioIcon: varchar("category_portofolio_icon", { length: 50 }).notNull().default(""),
    categoryPortofolioImage: varchar("category_portofolio_image", { length: 255 }).notNull().default(""),
    categoryPortofolioDescription: text("category_portofolio_description").notNull().default(""),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
} , (table) => [
    uniqueIndex("category_portofolio_name_unique").on(table.categoryPortofolioName),
    uniqueIndex("category_portofolio_slug_unique").on(table.categoryPortofolioSlug),
    index("category_portofolio_created_at_idx").on(table.createdAt),
]);