import { setRequestLocale } from "next-intl/server";
import { desc, eq, or } from "drizzle-orm";

import { ArticlePageContent } from "@/components/article";
import { FooterSection } from "@/components/footer";
import { db } from "@/db";
import { blog } from "@/db/schema/blog";
import { categoryBlog } from "@/db/schema/category-blog";
import { categoryProduct } from "@/db/schema/category-product";
import { contact } from "@/db/schema/contact";
import { heroSection } from "@/db/schema/hero-section";
import { socialMedia } from "@/db/schema/social-media";
import {
  translateBlogs,
  translateCategoryBlogs,
  translateCategoryProducts,
  translateContacts,
  translateHeroSection,
} from "@/lib/translate";
import type { ArticleCardData } from "@/components/article";
import type { ArticleFeaturedCardData } from "@/components/article";
import type { CategoryOption } from "@/components/article";

type Props = {
  params: Promise<{ locale: string }>;
};

const FALLBACK_HERO = {
  heroSectionId: "fallback",
  pageKey: "articles",
  preHeading: null,
  mainHeading: "Blog Dan Wawasan Tentang Solusi Kaca",
  subHeading: "Kaca Tempered: Pilihan Tahan Lama Dan Bergaya",
  description:
    "Artikel edukatif dan referensi profesional tentang kaca tempered untuk berbagai kebutuhan proyek.",
  backgroundImageUrl: "",
  scrollIndicatorText: "SCROLL",
  scrollIndicatorVisible: false,
  breadcrumbItems: [
    { label: "Home", href: "/" },
    { label: "Blog & Artikel", href: "/article" },
  ] as { label: string; href: string }[],
};

export default async function ArticlePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [
    heroRow,
    blogRows,
    categoryRows,
    categoryProductRows,
    contactRows,
    socialMediaRows,
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
    : FALLBACK_HERO;

  const hero = await translateHeroSection(rawHero, locale);

  const categories = await translateCategoryBlogs(
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

  const rawBlogsForTranslate = blogRows.map((r) => ({
    blogId: r.blogId,
    blogTitle: r.blogTitle,
    blogSlug: r.blogSlug,
    blogExcerpt: r.blogExcerpt ?? "",
    blogImageUrl: r.blogImageUrl,
    blogIsPublishedAt: r.blogIsPublishedAt.toISOString(),
    categoryName: r.categoryBlogName,
    categorySlug: null as string | null,
  }));

  const translatedBlogs = await translateBlogs(
    rawBlogsForTranslate.map((b) => ({
      blogId: b.blogId,
      blogTitle: b.blogTitle,
      blogSlug: b.blogSlug,
      blogExcerpt: b.blogExcerpt,
      blogImageUrl: b.blogImageUrl,
      blogIsPublishedAt: b.blogIsPublishedAt,
      categoryName: b.categoryName,
      categorySlug: b.categorySlug,
    })),
    locale
  );

  const blogs: ArticleCardData[] = blogRows.map((r, i) => {
    const t = translatedBlogs[i];
    return {
      blogId: r.blogId,
      blogTitle: t?.blogTitle ?? r.blogTitle,
      blogSlug: r.blogSlug,
      blogExcerpt: t?.blogExcerpt ?? r.blogExcerpt ?? "",
      blogImageUrl: r.blogImageUrl,
      blogIsPublishedAt: r.blogIsPublishedAt.toISOString(),
      categoryBlogId: r.categoryBlogId,
      categoryName: t?.categoryName ?? r.categoryBlogName,
    };
  });

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

  const contacts = await translateContacts(
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

  const categoriesForFooter = await translateCategoryProducts(
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
