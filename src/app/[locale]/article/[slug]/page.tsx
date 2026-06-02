import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
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
import { contact } from "@/db/schema/contact";
import { socialMedia } from "@/db/schema/social-media";
import {
  applyBlogDetailTranslations,
  applyBlogWithCategoryTranslations,
  applyCategoryProductTranslations,
  applyContactTranslations,
} from "@/lib/translate/get-translated";
import type { BlogDetailData } from "@/components/blog/types";
import { routing } from "@/i18n/routing";
import { BlogJsonLd } from "@/components/seo/json-ld";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const rows = await db.query.blog.findMany({
    where: (b, { eq: eqFn }) => eqFn(b.blogIsPublished, true),
    columns: { blogSlug: true },
  });
  return rows.flatMap((r) =>
    routing.locales.map((locale) => ({ locale, slug: r.blogSlug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "seo.articleDetail" });
  const row = await db
    .select({
      blogTitle: blog.blogTitle,
      blogExcerpt: blog.blogExcerpt,
      blogImageUrl: blog.blogImageUrl,
      blogIsPublishedAt: blog.blogIsPublishedAt,
      categoryBlogName: categoryBlog.categoryBlogName,
    })
    .from(blog)
    .leftJoin(categoryBlog, eq(blog.categoryBlogId, categoryBlog.categoryBlogId))
    .where(and(eq(blog.blogSlug, slug), eq(blog.blogIsPublished, true)))
    .limit(1)
    .then((rows) => rows[0]);

  if (!row) {
    return { title: t("notFoundTitle"), robots: { index: false, follow: false } };
  }

  const baseKeywords = t("baseKeywords").split(",");

  const dynamicKeywords: string[] = [
    row.blogTitle,
    row.categoryBlogName ?? "",
  ].filter(Boolean);

  return {
    title: row.blogTitle,
    description: row.blogExcerpt ?? undefined,
    openGraph: {
      type: "article",
      title: t("ogTitleTemplate", { name: row.blogTitle }),
      description: row.blogExcerpt ?? undefined,
      publishedTime: row.blogIsPublishedAt.toISOString(),
      images: row.blogImageUrl
        ? [{ url: row.blogImageUrl, width: 1200, height: 630 }]
        : [{ url: "/og-default.jpg", width: 1200, height: 630 }],
    },
    keywords: [...baseKeywords, ...dynamicKeywords],
    alternates: { canonical: `/article/${slug}` },
  };
}

function stableHash(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

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

  const otherRowsRaw = await db
    .select({
      blogId: blog.blogId,
      blogTitle: blog.blogTitle,
      blogSlug: blog.blogSlug,
      blogImageUrl: blog.blogImageUrl,
      blogIsPublishedAt: blog.blogIsPublishedAt,
      categoryBlogId: blog.categoryBlogId,
    })
    .from(blog)
    .where(
      and(ne(blog.blogId, row.blogId), eq(blog.blogIsPublished, true))
    )
    .orderBy(desc(blog.blogIsPublishedAt))
    .limit(20);

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

  const translatedBlog = await applyBlogDetailTranslations(
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

  // Recommender logic:
  // - 1 artikel dengan kategori yang sama (jika ada)
  // - 2 artikel lain acak (kategori bebas)
  let candidateRows = otherRowsRaw;

  if (candidateRows.length > 3) {
    const sameCategory =
      row.categoryBlogId != null
        ? candidateRows.filter(
            (r) => r.categoryBlogId === row.categoryBlogId
          )
        : [];

    if (sameCategory.length > 0) {
      // Pilih satu artikel kategori sama secara deterministik
      const idx = stableHash(row.blogId) % sameCategory.length;
      const first = sameCategory[idx];

      const pool = candidateRows.filter((r) => r.blogId !== first.blogId);
      candidateRows = [
        first,
        ...pool
          .slice()
          .sort((a, b) => stableHash(a.blogId) - stableHash(b.blogId))
          .slice(0, 2),
      ];
    } else {
      const sorted = [...candidateRows].sort(
        (a, b) => stableHash(a.blogId) - stableHash(b.blogId)
      );
      candidateRows = sorted.slice(0, 3);
    }
  }

  const otherArticlesRaw = await applyBlogWithCategoryTranslations(
    candidateRows.map((r) => ({
      blogId: r.blogId,
      blogTitle: r.blogTitle,
      blogSlug: r.blogSlug,
      blogExcerpt: "",
      blogImageUrl: r.blogImageUrl,
      blogIsPublishedAt: r.blogIsPublishedAt.toISOString(),
      categoryName: null,
    })),
    locale
  );

  const otherArticles: BlogDetailSidebarArticle[] = candidateRows.map(
    (r, i) => ({
      blogId: r.blogId,
      blogTitle: otherArticlesRaw[i]?.blogTitle ?? r.blogTitle,
      blogSlug: r.blogSlug,
      blogImageUrl: r.blogImageUrl,
      blogIsPublishedAt: r.blogIsPublishedAt.toISOString(),
    })
  );

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
    applyContactTranslations(
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
    applyCategoryProductTranslations(
      categoryProductRows.map((c) => ({
        categoryProductId: c.categoryProductId,
        categoryProductName: c.categoryProductName,
        categoryProductSlug: c.categoryProductSlug,
      })),
      locale
    ),
  ]);

  const pageUrl = `https://www.saktitemp.com/article/${slug}`;

  return (
    <div className="w-full bg-white">
      <BlogJsonLd blog={blogDetail} url={pageUrl} />
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
