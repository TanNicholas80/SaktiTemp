import { pgTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";

export const categoryBlog = pgTable("category-blog", {
    categoryBlogId: uuid("category_blog_id").primaryKey().defaultRandom(),
    categoryBlogName: varchar("category_blog_name").notNull(),
    categoryBlogSlug: varchar("category_blog_slug").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
} , (table) => [
    uniqueIndex("category_blog_name_unique").on(table.categoryBlogName),
    uniqueIndex("category_blog_slug_unique").on(table.categoryBlogSlug),
]);