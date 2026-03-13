import { pgTable, timestamp, uniqueIndex, index, varchar, text, boolean, integer, foreignKey } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { categoryBlog } from "./category-blog";

export const blog = pgTable("blog", {
    blogId: uuid("blog_id").primaryKey().defaultRandom(),
    categoryBlogId: uuid("category_blog_id").references(() => categoryBlog.categoryBlogId),
    blogTitle: varchar("blog_title").notNull(),
    blogSlug: varchar("blog_slug").notNull(),
    blogExcerpt: varchar("blog_excerpt", { length: 500 }).notNull().default(""),
    blogContent: text("blog_content").notNull(),
    blogImageUrl: varchar("blog_image_url").notNull(),
    blogImagePublicId: varchar("blog_image_public_id").notNull(),
    blogViews: integer("blog_views").notNull().default(0),
    blogIsPublished: boolean("blog_is_published").notNull().default(false),
    blogIsPublishedAt: timestamp("blog_is_published_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
    foreignKey({
        columns: [table.categoryBlogId],
        foreignColumns: [categoryBlog.categoryBlogId],
        name: "fk_blog_category_blog_id",
    }),
    uniqueIndex("blog_slug_unique").on(table.blogSlug),
    index("blog_category_blog_id_idx").on(table.categoryBlogId),
    index("blog_is_published_at_idx").on(table.blogIsPublishedAt),
    index("blog_views_idx").on(table.blogViews),
]);