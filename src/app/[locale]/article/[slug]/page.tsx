import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { and, desc, eq, ne } from "drizzle-orm";

import {
  BlogDetailContent,
  BlogDetailHero,
  BlogDetailSidebar,
} from "@/components/blog";
import type { BlogDetailSidebarArticle } from "@/components/blog";
import { FooterSection } from "@/components/footer";
import { db } from "@/db";
import { blog } from "@/db/schema/blog";
import { categoryBlog } from "@/db/schema/category-blog";
import { categoryProduct } from "@/db/schema/category-product";
import { contact } from "@/db/schema/contact";
import { socialMedia } from "@/db/schema/social-media";
import {
  translateBlogDetail,
  translateBlogs,
  translateCategoryProducts,
  translateContacts,
} from "@/lib/translate";
import type { BlogDetailData } from "@/components/blog/types";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ArticleDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const rows = await db
    .select({
      blogId: blog.blogId,
      blogTitle: blog.blogTitle,
      blogSlug: blog.blogSlug,
      blogExcerpt: blog.blogExcerpt,
      blogContent: blog.blogContent,
      blogImageUrl: blog.blogImageUrl,
      blogIsPublishedAt: blog.blogIsPublishedAt,
      categoryBlogId: blog.categoryBlogId,
      categoryBlogName: categoryBlog.categoryBlogName,
      categoryBlogSlug: categoryBlog.categoryBlogSlug,
    })
    .from(blog)
    .leftJoin(
      categoryBlog,
      eq(blog.categoryBlogId, categoryBlog.categoryBlogId)
    )
    .where(
      and(eq(blog.blogSlug, slug), eq(blog.blogIsPublished, true))
    )
    .limit(1);

  const row = rows[0];
  if (!row) {
    notFound();
  }

  const otherRows = await db
    .select({
      blogId: blog.blogId,
      blogTitle: blog.blogTitle,
      blogSlug: blog.blogSlug,
      blogImageUrl: blog.blogImageUrl,
      blogIsPublishedAt: blog.blogIsPublishedAt,
    })
    .from(blog)
    .where(
      and(ne(blog.blogId, row.blogId), eq(blog.blogIsPublished, true))
    )
    .orderBy(desc(blog.blogIsPublishedAt))
    .limit(3);

  const rawBlog = {
    blogId: row.blogId,
    blogTitle: row.blogTitle,
    blogSlug: row.blogSlug,
    blogExcerpt: row.blogExcerpt ?? "",
    blogContent: row.blogContent,
    blogImageUrl: row.blogImageUrl,
    blogIsPublishedAt: row.blogIsPublishedAt.toISOString(),
    categoryName: row.categoryBlogName,
    categorySlug: row.categoryBlogSlug,
  };

  const translatedBlog = await translateBlogDetail(
    {
      ...rawBlog,
      categoryName: rawBlog.categoryName,
      categorySlug: rawBlog.categorySlug,
    },
    locale
  );

  const blogDetail: BlogDetailData = {
    blogId: translatedBlog.blogId,
    blogTitle: translatedBlog.blogTitle,
    blogSlug: translatedBlog.blogSlug,
    blogContent: translatedBlog.blogContent,
    blogImageUrl: translatedBlog.blogImageUrl,
    blogIsPublishedAt: translatedBlog.blogIsPublishedAt,
    category:
      translatedBlog.categoryName && translatedBlog.categorySlug
        ? {
            name: translatedBlog.categoryName,
            slug: translatedBlog.categorySlug,
          }
        : null,
  };

  const otherArticlesRaw = await translateBlogs(
    otherRows.map((r) => ({
      blogId: r.blogId,
      blogTitle: r.blogTitle,
      blogSlug: r.blogSlug,
      blogExcerpt: "",
      blogImageUrl: r.blogImageUrl,
      blogIsPublishedAt: r.blogIsPublishedAt.toISOString(),
      categoryName: null,
      categorySlug: null,
    })),
    locale
  );

  const otherArticles: BlogDetailSidebarArticle[] = otherRows.map((r, i) => ({
    blogId: r.blogId,
    blogTitle: otherArticlesRaw[i]?.blogTitle ?? r.blogTitle,
    blogSlug: r.blogSlug,
    blogImageUrl: r.blogImageUrl,
    blogIsPublishedAt: r.blogIsPublishedAt.toISOString(),
  }));

  const [contactRows, socialMediaRows, categoryProductRows] = await Promise.all([
    db.query.contact.findMany({
      columns: {
        contactId: true,
        contactType: true,
        contactLabel: true,
        contactValue: true,
        contactValueExtra: true,
        contactIcon: true,
      },
      where: eq(contact.isPublished, true),
    }),
    db.query.socialMedia.findMany({
      columns: {
        socialMediaId: true,
        platformName: true,
        profileUrl: true,
        iconName: true,
      },
      where: eq(socialMedia.isPublished, true),
    }),
    db.query.categoryProduct.findMany({
      columns: {
        categoryProductId: true,
        categoryProductName: true,
        categoryProductSlug: true,
      },
    }),
  ]);

  const [contacts, categories] = await Promise.all([
    translateContacts(
      contactRows.map((r) => ({
        contactId: r.contactId,
        contactType: r.contactType,
        contactLabel: r.contactLabel,
        contactValue: r.contactValue,
        contactValueExtra: r.contactValueExtra,
        contactIcon: r.contactIcon,
      })),
      locale
    ),
    translateCategoryProducts(
      categoryProductRows.map((c) => ({
        categoryProductId: c.categoryProductId,
        categoryProductName: c.categoryProductName,
        categoryProductSlug: c.categoryProductSlug,
      })),
      locale
    ),
  ]);

  return (
    <div className="w-full bg-white">
      <BlogDetailHero blog={blogDetail} variant="landing" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-10 xl:gap-12">
          <div className="min-w-0">
            <BlogDetailContent blog={blogDetail} />
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <BlogDetailSidebar otherArticles={otherArticles} />
          </aside>
        </div>
      </div>

      <FooterSection
        contacts={contacts}
        socialMedia={socialMediaRows.map((r) => ({
          socialMediaId: r.socialMediaId,
          platformName: r.platformName,
          profileUrl: r.profileUrl,
          iconName: r.iconName,
        }))}
        categories={categories}
      />
    </div>
  );
}
