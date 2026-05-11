import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { desc, eq } from "drizzle-orm";

import { BenefitSection } from "@/components/benefit";
import { BlogSection } from "@/components/blog";
import { ContactSection } from "@/components/contact";
import { FooterSection } from "@/components/footer";
import { HeroCarousel } from "@/components/carousel";
import { LocationSection } from "@/components/location";
import { PortofolioSection } from "@/components/portofolio";
import type { HeroCarouselSlide } from "@/components/carousel";
import { db } from "@/db";
import { benefit } from "@/db/schema/benefit";
import { blog } from "@/db/schema/blog";
import { categoryBlog } from "@/db/schema/category-blog";
import { carousel } from "@/db/schema/carousel";
import { categoryPortofolio } from "@/db/schema/category-portofolio";
import { contact } from "@/db/schema/contact";
import { location } from "@/db/schema/location";
import { portofolio } from "@/db/schema/portofolio";
import { companyStat } from "@/db/schema/company-stat";
import { categoryProduct } from "@/db/schema/category-product";
import { socialMedia } from "@/db/schema/social-media";
import { cachedQuery } from "@/lib/cache/content-cache-helpers";
import { contentCacheKey } from "@/lib/cache";
import { getServerSession } from "@/lib/session";
import {
  applyBenefitTranslations,
  applyBlogWithCategoryTranslations,
  applyCarouselTranslations,
  applyCategoryProductTranslations,
  applyCompanyStatTranslations,
  applyContactTranslations,
  applyLocationTranslations,
  applyPortofolioTranslations,
  applyPortofolioCategoryNameTranslations,
} from "@/lib/translate/get-translated";
import { OrganizationJsonLd } from "@/components/seo/json-ld";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.home" });
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

export default async function LandingHomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getServerSession();
  if (session?.user?.role === "admin") {
    redirect("/admin");
  }

  const landingData = await cachedQuery(
    contentCacheKey("landing", "home"),
    async () => {
      const carouselSlides = await db.query.carousel.findMany({
        columns: {
          carouselId: true,
          carouselHeading: true,
          carouselSubheading: true,
          carouselDescription: true,
          carouselImageUrl: true,
          carouselOrder: true,
        },
        where: eq(carousel.carouselIsPublished, true),
        orderBy: (c, { asc: ascFn }) => [ascFn(c.carouselOrder)],
      });

      const rawSlides: HeroCarouselSlide[] = carouselSlides.map((row) => ({
        carouselId: row.carouselId,
        carouselHeading: row.carouselHeading,
        carouselSubheading: row.carouselSubheading,
        carouselDescription: row.carouselDescription,
        carouselImageUrl: row.carouselImageUrl,
        carouselOrder: row.carouselOrder,
      }));

      const [benefitsRows, statsRows] = await Promise.all([
        db.query.benefit.findMany({
          columns: {
            benefitId: true,
            benefitName: true,
            benefitDescription: true,
            benefitIcon: true,
          },
          where: eq(benefit.benefitIsPublished, true),
        }),
        db.query.companyStat.findMany({
          columns: {
            companyStatId: true,
            value: true,
            label: true,
            displayOrder: true,
          },
          where: eq(companyStat.isPublished, true),
          orderBy: (s, { asc }) => [asc(s.displayOrder)],
        }),
      ]);

      const rawBenefits = benefitsRows.map((r) => ({
        benefitId: r.benefitId,
        benefitName: r.benefitName,
        benefitDescription: r.benefitDescription,
        benefitIcon: r.benefitIcon,
      }));
      const rawStats = statsRows.map((r) => ({
        companyStatId: r.companyStatId,
        value: r.value,
        label: r.label,
        displayOrder: r.displayOrder,
      }));

      const blogRows = await db
        .select({
          blogId: blog.blogId,
          blogTitle: blog.blogTitle,
          blogSlug: blog.blogSlug,
          blogExcerpt: blog.blogExcerpt,
          blogImageUrl: blog.blogImageUrl,
          blogIsPublishedAt: blog.blogIsPublishedAt,
          categoryBlogName: categoryBlog.categoryBlogName,
          categoryBlogSlug: categoryBlog.categoryBlogSlug,
        })
        .from(blog)
        .leftJoin(categoryBlog, eq(blog.categoryBlogId, categoryBlog.categoryBlogId))
        .where(eq(blog.blogIsPublished, true))
        .orderBy(desc(blog.blogIsPublishedAt))
        .limit(3);

      const rawBlogs = blogRows.map((r) => ({
        blogId: r.blogId,
        blogTitle: r.blogTitle,
        blogSlug: r.blogSlug,
        blogExcerpt: r.blogExcerpt ?? "",
        blogImageUrl: r.blogImageUrl,
        blogIsPublishedAt: r.blogIsPublishedAt.toISOString(),
        categoryName: r.categoryBlogName,
        categorySlug: r.categoryBlogSlug,
      }));

      const portofolioRows = await db
        .select({
          portofolioId: portofolio.portofolioId,
          portofolioName: portofolio.portofolioName,
          portofolioSlug: portofolio.portofolioSlug,
          portofolioShortDescription: portofolio.portofolioShortDescription,
          portofolioLocation: portofolio.portofolioLocation,
          portofolioImageUrl: portofolio.portofolioImageUrl,
          portofolioIsPublishedAt: portofolio.portofolioIsPublishedAt,
          categoryPortofolioId: categoryPortofolio.categoryPortofolioId,
          categoryPortofolioName: categoryPortofolio.categoryPortofolioName,
          categoryPortofolioSlug: categoryPortofolio.categoryPortofolioSlug,
        })
        .from(portofolio)
        .leftJoin(
          categoryPortofolio,
          eq(portofolio.categoryPortofolioId, categoryPortofolio.categoryPortofolioId)
        )
        .where(eq(portofolio.portofolioIsPublished, true))
        .orderBy(desc(portofolio.portofolioIsPublishedAt))
        .limit(6);

      const rawPortofolios = portofolioRows.map((r) => ({
        portofolioId: r.portofolioId,
        portofolioName: r.portofolioName,
        portofolioSlug: r.portofolioSlug,
        portofolioShortDescription: r.portofolioShortDescription ?? "",
        portofolioLocation: r.portofolioLocation,
        portofolioImageUrl: r.portofolioImageUrl,
        portofolioIsPublishedAt: r.portofolioIsPublishedAt.toISOString(),
        categoryPortofolioId: r.categoryPortofolioId ?? null,
        categoryName: r.categoryPortofolioName,
        categorySlug: r.categoryPortofolioSlug,
      }));

      const [locationRows, contactRows, categoryProductRows, socialMediaRows] =
        await Promise.all([
          db.query.location.findMany({
            columns: {
              locationId: true,
              locationCity: true,
              locationType: true,
              locationAddress: true,
              locationMapUrl: true,
              locationMapEmbedUrl: true,
            },
            where: eq(location.locationIsPublished, true),
            orderBy: (l, { desc }) => [desc(l.locationType)],
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
          db.query.categoryProduct.findMany({
            columns: {
              categoryProductId: true,
              categoryProductName: true,
              categoryProductSlug: true,
            },
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

      const rawLocations = locationRows.map((r) => ({
        locationId: r.locationId,
        locationCity: r.locationCity,
        locationType: r.locationType,
        locationAddress: r.locationAddress,
        locationMapUrl: r.locationMapUrl,
        locationMapEmbedUrl: r.locationMapEmbedUrl,
      }));

      const rawContacts = contactRows.map((r) => ({
        contactId: r.contactId,
        contactType: r.contactType,
        contactLabel: r.contactLabel,
        contactValue: r.contactValue,
        contactValueExtra: r.contactValueExtra,
        contactIcon: r.contactIcon,
      }));

      const rawCategoryProducts = categoryProductRows.map((r) => ({
        categoryProductId: r.categoryProductId,
        categoryProductName: r.categoryProductName,
        categoryProductSlug: r.categoryProductSlug,
      }));

      const rawSocialMedia = socialMediaRows.map((r) => ({
        socialMediaId: r.socialMediaId,
        platformName: r.platformName,
        profileUrl: r.profileUrl,
        iconName: r.iconName,
      }));

      return {
        rawSlides,
        rawBenefits,
        rawStats,
        rawBlogs,
        rawPortofolios,
        rawLocations,
        rawContacts,
        rawCategoryProducts,
        rawSocialMedia,
      };
    }
  );

  const {
    rawSlides,
    rawBenefits,
    rawStats,
    rawBlogs,
    rawPortofolios,
    rawLocations,
    rawContacts,
    rawCategoryProducts,
    rawSocialMedia,
  } = landingData;

  const slides = await applyCarouselTranslations(rawSlides, locale);
  const benefits = await applyBenefitTranslations(rawBenefits, locale);
  const stats = await applyCompanyStatTranslations(rawStats, locale);
  const blogs = await applyBlogWithCategoryTranslations(rawBlogs, locale);
  const portofolios = await applyPortofolioCategoryNameTranslations(
    await applyPortofolioTranslations(rawPortofolios, locale),
    locale
  );
  const portofolioCategories = Array.from(
    new Map(
      portofolios
        .filter((p) => p.categoryName && p.categorySlug)
        .map((p) => [p.categorySlug!, { name: p.categoryName!, slug: p.categorySlug! }])
    ).values()
  );
  const [locations, contacts, categories] = await Promise.all([
    applyLocationTranslations(rawLocations, locale),
    applyContactTranslations(rawContacts, locale),
    applyCategoryProductTranslations(rawCategoryProducts, locale),
  ]);

  const contactEmail =
    contacts.find((c) => c.contactType === "email")?.contactValue ?? "";
  const whatsappPhone =
    contacts.find((c) => c.contactType === "phone")?.contactValue ?? "";

  return (
    <div className="w-full">
      <OrganizationJsonLd />
      <HeroCarousel slides={slides} />
      <BenefitSection benefits={benefits} stats={stats} />
      <BlogSection blogs={blogs} />
      <PortofolioSection
        portofolios={portofolios}
        categories={portofolioCategories}
      />
      <ContactSection
        locations={locations}
        contacts={contacts}
        contactEmail={contactEmail}
        whatsappPhone={whatsappPhone}
      />
      <LocationSection locations={locations} />
      <FooterSection
        contacts={contacts}
        socialMedia={rawSocialMedia}
        categories={categories}
      />
    </div>
  );
}
