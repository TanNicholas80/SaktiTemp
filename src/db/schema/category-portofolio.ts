import { pgTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";

export const categoryPortofolio = pgTable("category-portofolio", {
    categoryPortofolioId: uuid("category_portofolio_id").primaryKey().defaultRandom(),
    categoryPortofolioName: varchar("category_portofolio_name").notNull(),
    categoryPortofolioSlug: varchar("category_portofolio_slug").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
} , (table) => [
    uniqueIndex("category_portofolio_name_unique").on(table.categoryPortofolioName),
    uniqueIndex("category_portofolio_slug_unique").on(table.categoryPortofolioSlug),
]);