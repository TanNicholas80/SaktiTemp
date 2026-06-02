import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { desc, eq, or } from "drizzle-orm";

import { ArticlePageContent } from "@/components/article";
import { FooterSection } from "@/components/footer";
import { cachedQuery } from "@/lib/cache/content-cache-helpers";
import { contentCacheKey } from "@/lib/cache";
import { db } from "@/db";
import { blog } from "@/db/schema/blog";
import { categoryBlog } from "@/db/schema/category-blog";
import { contact } from "@/db/schema/contact";
import { heroSection } from "@/db/schema/hero-section";
import { socialMedia } from "@/db/schema/social-media";
import {
  applyBlogWithCategoryTranslations,
  applyCategoryBlogTranslations,
  applyCategoryProductTranslations,
  applyContactTranslations,
  applyHeroSectionTranslation,
} from "@/lib/translate/get-translated";
import type { ArticleCardData } from "@/components/article";
import type { ArticleFeaturedCardData } from "@/components/article";
import type { CategoryOption } from "@/components/article";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.article" });
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(","),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [{ url: "/og-default.jpg", width: 1200, height: 630 }],
    },
  };
}

async function getFallbackHero(locale: string) {
  const t = await getTranslations({ locale, namespace: "fallbackHero.article" });
  return {
    heroSectionId: "fallback",
    pageKey: "articles",
    preHeading: null,
    mainHeading: t("mainHeading"),
    subHeading: t("subHeading"),
    description: t("description"),
    backgroundImageUrl: "",
    scrollIndicatorText: t("scrollIndicatorText"),
    scrollIndicatorVisible: false,
    breadcrumbItems: [
      { label: t("home"), href: "/" },
      { label: t("page"), href: "/article" },
    ] as { label: string; href: string }[],
  };
}

export default async function ArticlePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fallbackHero = await getFallbackHero(locale);

  const {
    heroRow,
    blogRows,
    categoryRows,
    categoryProductRows,
    contactRows,
    socialMediaRows,
  } = await cachedQuery(contentCacheKey("article", "list"), async () => {
    const [
      heroRaw,
      blogRaw,
      categoryRaw,
      categoryProductRaw,
      contactRaw,
      socialMediaRaw,
    ] = await Promise.all([
      db.query.heroSection.findFirst({
        where: or(
          eq(heroSection.pageKey, "articles"),
          eq(heroSection.pageKey, "blog")
        ),
        columns: {
          heroSectionId: true,
          pageKey: true,
          preHeading: true,
          mainHeading: true,
          subHeading: true,
          description: true,
          backgroundImageUrl: true,
          scrollIndicatorText: true,
          scrollIndicatorVisible: true,
          breadcrumbItems: true,
        },
      }),
      db
        .select({
          blogId: blog.blogId,
          blogTitle: blog.blogTitle,
          blogSlug: blog.blogSlug,
          blogExcerpt: blog.blogExcerpt,
          blogImageUrl: blog.blogImageUrl,
          blogIsPublishedAt: blog.blogIsPublishedAt,
          categoryBlogId: blog.categoryBlogId,
          categoryBlogName: categoryBlog.categoryBlogName,
        })
        .from(blog)
        .leftJoin(
          categoryBlog,
          eq(blog.categoryBlogId, categoryBlog.categoryBlogId)
        )
        .where(eq(blog.blogIsPublished, true))
        .orderBy(desc(blog.blogIsPublishedAt)),
      db.query.categoryBlog.findMany({
        columns: {
          categoryBlogId: true,
          categoryBlogName: true,
          categoryBlogSlug: true,
        },
      }),
      db.query.categoryProduct.findMany({
        columns: {
          categoryProductId: true,
          categoryProductName: true,
          categoryProductSlug: true,
        },
      }),
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
    ]);

    return {
      heroRow: heroRaw,
      blogRows: blogRaw.map((r) => ({
        blogId: r.blogId,
        blogTitle: r.blogTitle,
        blogSlug: r.blogSlug,
        blogExcerpt: r.blogExcerpt,
        blogImageUrl: r.blogImageUrl,
        blogIsPublishedAt: r.blogIsPublishedAt.toISOString(),
        categoryBlogId: r.categoryBlogId,
        categoryBlogName: r.categoryBlogName,
      })),
      categoryRows: categoryRaw,
      categoryProductRows: categoryProductRaw,
      contactRows: contactRaw,
      socialMediaRows: socialMediaRaw,
    };
  });

  const rawHero = heroRow
    ? {
        heroSectionId: heroRow.heroSectionId,
        pageKey: heroRow.pageKey,
        preHeading: heroRow.preHeading,
        mainHeading: heroRow.mainHeading,
        subHeading: heroRow.subHeading,
        description: heroRow.description,
        backgroundImageUrl: heroRow.backgroundImageUrl,
        scrollIndicatorText: heroRow.scrollIndicatorText,
        scrollIndicatorVisible: heroRow.scrollIndicatorVisible ?? false,
        breadcrumbItems:
          (heroRow.breadcrumbItems as { label: string; href: string }[] | null) ??
          null,
      }
    : fallbackHero;

  const hero = (await applyHeroSectionTranslation(rawHero, locale)) ?? rawHero;

  const categories = await applyCategoryBlogTranslations(
    categoryRows.map((c) => ({
      categoryBlogId: c.categoryBlogId,
      categoryBlogName: c.categoryBlogName,
      categoryBlogSlug: c.categoryBlogSlug,
    })),
    locale
  );

  const categoryOptions: CategoryOption[] = categories.map((c) => ({
    categoryBlogId: c.categoryBlogId,
    categoryBlogName: c.categoryBlogName,
    categoryBlogSlug: c.categoryBlogSlug,
  }));

  const translatedBlogs = await applyBlogWithCategoryTranslations(
    blogRows.map((r) => ({
      blogId: r.blogId,
      blogTitle: r.blogTitle,
      blogSlug: r.blogSlug,
      blogExcerpt: r.blogExcerpt ?? "",
      blogImageUrl: r.blogImageUrl,
      blogIsPublishedAt: r.blogIsPublishedAt,
      categoryBlogId: r.categoryBlogId,
      categoryName: r.categoryBlogName,
    })),
    locale
  );

  const blogs: ArticleCardData[] = translatedBlogs.map((t) => ({
    blogId: t.blogId,
    blogTitle: t.blogTitle,
    blogSlug: t.blogSlug,
    blogExcerpt: t.blogExcerpt,
    blogImageUrl: t.blogImageUrl,
    blogIsPublishedAt: t.blogIsPublishedAt,
    categoryBlogId: t.categoryBlogId,
    categoryName: t.categoryName,
  }));

  const featuredBlog: ArticleFeaturedCardData | null =
    blogs.length > 0
      ? {
          blogId: blogs[0].blogId,
          blogTitle: blogs[0].blogTitle,
          blogSlug: blogs[0].blogSlug,
          blogExcerpt: blogs[0].blogExcerpt,
          blogImageUrl: blogs[0].blogImageUrl,
          blogIsPublishedAt: blogs[0].blogIsPublishedAt,
          categoryBlogId: blogs[0].categoryBlogId,
          categoryName: blogs[0].categoryName,
        }
      : null;

  const contacts = await applyContactTranslations(
    contactRows.map((r) => ({
      contactId: r.contactId,
      contactType: r.contactType,
      contactLabel: r.contactLabel,
      contactValue: r.contactValue,
      contactValueExtra: r.contactValueExtra,
      contactIcon: r.contactIcon,
    })),
    locale
  );

  const categoriesForFooter = await applyCategoryProductTranslations(
    categoryProductRows.map((c) => ({
      categoryProductId: c.categoryProductId,
      categoryProductName: c.categoryProductName,
      categoryProductSlug: c.categoryProductSlug,
    })),
    locale
  );

  return (
    <div className="w-full bg-white">
      <ArticlePageContent
        hero={hero}
        categories={categoryOptions}
        blogs={blogs}
        featuredBlog={featuredBlog}
        locale={locale}
      />
      <FooterSection
        contacts={contacts}
        socialMedia={socialMediaRows.map((r) => ({
          socialMediaId: r.socialMediaId,
          platformName: r.platformName,
          profileUrl: r.profileUrl,
          iconName: r.iconName,
        }))}
        categories={categoriesForFooter}
      />
    </div>
  );
}
