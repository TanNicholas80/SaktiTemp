import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

import { desc, eq, or } from "drizzle-orm";

import { CompanyStatsSection } from "@/components/company-stat";
import { FooterSection } from "@/components/footer";
import { PageHeroSection } from "@/components/hero-section";
import { PortfolioPageContent } from "@/components/portofolio/portfolio-page-content";
import { cachedQuery } from "@/lib/cache/content-cache-helpers";
import { contentCacheKey } from "@/lib/cache";
import { db } from "@/db";
import { categoryPortofolio } from "@/db/schema/category-portofolio";
import { companyStat } from "@/db/schema/company-stat";
import { contact } from "@/db/schema/contact";
import { heroSection } from "@/db/schema/hero-section";
import { portofolio } from "@/db/schema/portofolio";
import { socialMedia } from "@/db/schema/social-media";
import {
  applyCompanyStatTranslations,
  applyCategoryPortofolioTranslations,
  applyCategoryProductTranslations,
  applyContactTranslations,
  applyHeroSectionTranslation,
  applyPortofolioTranslations,
} from "@/lib/translate/get-translated";
import type { PortfolioPageCardData } from "@/components/portofolio/portfolio-page-card";

export const revalidate = 300;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.portofolio" });
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
  const t = await getTranslations({ locale, namespace: "fallbackHero.portofolio" });
  return {
    heroSectionId: "fallback",
    pageKey: "portfolio",
    preHeading: null,
    mainHeading: t("mainHeading"),
    subHeading: t("subHeading"),
    description: t("description"),
    backgroundImageUrl: "",
    scrollIndicatorText: t("scrollIndicatorText"),
    scrollIndicatorVisible: true,
    breadcrumbItems: [
      { label: t("home"), href: "/" },
      { label: t("page"), href: "/portofolio" },
    ] as { label: string; href: string }[],
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fallbackHero = await getFallbackHero(locale);

  const t = await getTranslations("portofolioSection");

  const {
    heroRow,
    statsRows,
    categoryRows,
    portofolioRows,
    contactRows,
    socialMediaRows,
    categoryProductRows,
  } = await cachedQuery(contentCacheKey("portofolio", "list"), async () => {
    const [
      heroRaw,
      statsRaw,
      categoryRaw,
      portofolioRaw,
      contactRaw,
      socialMediaRaw,
      categoryProductRaw,
    ] = await Promise.all([
      db.query.heroSection.findFirst({
        where: or(
          eq(heroSection.pageKey, "portfolio"),
          eq(heroSection.pageKey, "portofolio")
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
      db.query.categoryPortofolio.findMany({
        columns: {
          categoryPortofolioId: true,
          categoryPortofolioName: true,
          categoryPortofolioSlug: true,
          categoryPortofolioImage: true,
          categoryPortofolioDescription: true,
        },
      }),
      db
        .select({
          portofolioId: portofolio.portofolioId,
          portofolioName: portofolio.portofolioName,
          portofolioSlug: portofolio.portofolioSlug,
          portofolioShortDescription: portofolio.portofolioShortDescription,
          portofolioLocation: portofolio.portofolioLocation,
          portofolioImageUrl: portofolio.portofolioImageUrl,
          portofolioIsPublishedAt: portofolio.portofolioIsPublishedAt,
          categoryPortofolioName: categoryPortofolio.categoryPortofolioName,
          categoryPortofolioSlug: categoryPortofolio.categoryPortofolioSlug,
        })
        .from(portofolio)
        .leftJoin(
          categoryPortofolio,
          eq(portofolio.categoryPortofolioId, categoryPortofolio.categoryPortofolioId)
        )
        .where(eq(portofolio.portofolioIsPublished, true))
        .orderBy(desc(portofolio.portofolioIsPublishedAt)),
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

    return {
      heroRow: heroRaw,
      statsRows: statsRaw,
      categoryRows: categoryRaw,
      portofolioRows: portofolioRaw.map((r) => ({
        portofolioId: r.portofolioId,
        portofolioName: r.portofolioName,
        portofolioSlug: r.portofolioSlug,
        portofolioShortDescription: r.portofolioShortDescription,
        portofolioLocation: r.portofolioLocation,
        portofolioImageUrl: r.portofolioImageUrl,
        portofolioIsPublishedAt: r.portofolioIsPublishedAt.toISOString(),
        categoryPortofolioName: r.categoryPortofolioName,
        categoryPortofolioSlug: r.categoryPortofolioSlug,
      })),
      contactRows: contactRaw,
      socialMediaRows: socialMediaRaw,
      categoryProductRows: categoryProductRaw,
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
        scrollIndicatorVisible: heroRow.scrollIndicatorVisible,
        breadcrumbItems: heroRow.breadcrumbItems as
          | { label: string; href: string }[]
          | undefined,
      }
    : fallbackHero;

  const rawStats = statsRows.map((r) => ({
    companyStatId: r.companyStatId,
    value: r.value,
    label: r.label,
    displayOrder: r.displayOrder,
  }));

  const rawCategories = categoryRows.map((r) => ({
    categoryPortofolioId: r.categoryPortofolioId,
    categoryPortofolioName: r.categoryPortofolioName,
    categoryPortofolioSlug: r.categoryPortofolioSlug,
    categoryPortofolioImage: r.categoryPortofolioImage ?? "",
    categoryPortofolioDescription:
      (r.categoryPortofolioDescription as string) ?? "",
  }));

  const rawPortofolios = portofolioRows.map((r) => ({
    portofolioId: r.portofolioId,
    portofolioName: r.portofolioName,
    portofolioSlug: r.portofolioSlug,
    portofolioShortDescription: r.portofolioShortDescription ?? "",
    portofolioLocation: r.portofolioLocation,
    portofolioImageUrl: r.portofolioImageUrl,
    portofolioIsPublishedAt: r.portofolioIsPublishedAt,
    categoryName: r.categoryPortofolioName,
    categorySlug: r.categoryPortofolioSlug,
  }));

  const [hero, stats, categoriesTranslated, portofoliosTranslated] =
    await Promise.all([
      applyHeroSectionTranslation(rawHero, locale),
      applyCompanyStatTranslations(rawStats, locale),
      applyCategoryPortofolioTranslations(rawCategories, locale),
      applyPortofolioTranslations(rawPortofolios, locale),
    ]);

  const portofolioCards: PortfolioPageCardData[] = portofoliosTranslated.map(
    (p) => ({
      portofolioId: p.portofolioId,
      portofolioName: p.portofolioName,
      portofolioSlug: p.portofolioSlug,
      portofolioShortDescription: p.portofolioShortDescription,
      portofolioLocation: p.portofolioLocation,
      portofolioImageUrl: p.portofolioImageUrl,
      categoryName: p.categoryName,
      categorySlug: p.categorySlug,
    })
  );

  const categoriesForFilter = categoriesTranslated.map((c) => ({
    categoryPortofolioId: c.categoryPortofolioId,
    categoryPortofolioName: c.categoryPortofolioName,
    categoryPortofolioSlug: c.categoryPortofolioSlug,
  }));

  const rawContacts = contactRows.map((r) => ({
    contactId: r.contactId,
    contactType: r.contactType,
    contactLabel: r.contactLabel,
    contactValue: r.contactValue,
    contactValueExtra: r.contactValueExtra,
    contactIcon: r.contactIcon,
  }));

  const [contacts, categories] = await Promise.all([
    applyContactTranslations(rawContacts, locale),
    applyCategoryProductTranslations(
      categoryProductRows.map((r) => ({
        categoryProductId: r.categoryProductId,
        categoryProductName: r.categoryProductName,
        categoryProductSlug: r.categoryProductSlug,
      })),
      locale
    ),
  ]);

  return (
    <div className="w-full">
      <PageHeroSection hero={hero!} />
      <CompanyStatsSection stats={stats} />
      <PortfolioPageContent
        portofolios={portofolioCards}
        categories={categoriesForFilter}
        viewDetailText={t("viewDetail")}
        allText={t("all")}
        noProjectsText={t("noProjects")}
        noProjectsDescription={t("noProjectsDescription")}
        noFilterMatchText={t("noFilterMatch")}
        noFilterMatchDescription={t("noFilterMatchDescription")}
      />
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
