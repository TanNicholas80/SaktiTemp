import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { eq } from "drizzle-orm";

import { AboutContentSection, VisionMissionSection } from "@/components/about";

import { BenefitSection } from "@/components/benefit";
import { CertificationSection } from "@/components/certification";
import { CompanyStatsSection } from "@/components/company-stat";
import { IndustrySection } from "@/components/industry";
import { ServiceSection } from "@/components/service";
import { VideoSection } from "@/components/video";
import { FooterSection } from "@/components/footer";
import { PageHeroSection } from "@/components/hero-section";
import { cachedQuery } from "@/lib/cache/content-cache-helpers";
import { contentCacheKey } from "@/lib/cache";
import { db } from "@/db";
import { benefit } from "@/db/schema/benefit";
import { certification } from "@/db/schema/certification";
import { companyStat } from "@/db/schema/company-stat";
import { contact } from "@/db/schema/contact";
import { heroSection } from "@/db/schema/hero-section";
import { service } from "@/db/schema/service";
import { socialMedia } from "@/db/schema/social-media";
import {
  applyHeroSectionTranslation,
  applyBenefitTranslations,
  applyCompanyStatTranslations,
  applyCategoryProductTranslations,
  applyContactTranslations,
  applyCertificationTranslations,
  applyCategoryPortofolioTranslations,
  applyServiceTranslations,
} from "@/lib/translate/get-translated";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.aboutCompany" });
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
  const t = await getTranslations({ locale, namespace: "fallbackHero.aboutCompany" });
  return {
    heroSectionId: "fallback",
    pageKey: "about",
    preHeading: t("preHeading"),
    mainHeading: t("mainHeading"),
    subHeading: t("subHeading"),
    description: t("description"),
    backgroundImageUrl: "",
    scrollIndicatorText: t("scrollIndicatorText"),
    scrollIndicatorVisible: true,
  };
}

export default async function AboutCompanyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fallbackHero = await getFallbackHero(locale);

  const companyData = await cachedQuery(
    contentCacheKey("about", "company"),
    async () => {
      const [
        heroRow,
        contactRows,
        categoryProductRows,
        categoryPortofolioRows,
        benefitRows,
        socialMediaRows,
        companyStatRows,
        certificationRows,
        serviceRows,
      ] = await Promise.all([
        db.query.heroSection.findFirst({
          where: eq(heroSection.pageKey, "about"),
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
        db.query.categoryProduct.findMany({
          columns: {
            categoryProductId: true,
            categoryProductName: true,
            categoryProductSlug: true,
          },
        }),
        db.query.categoryPortofolio.findMany({
          columns: {
            categoryPortofolioId: true,
            categoryPortofolioName: true,
            categoryPortofolioSlug: true,
            categoryPortofolioImage: true,
            categoryPortofolioDescription: true,
          },
          orderBy: (c, { asc }) => [asc(c.createdAt)],
        }),
        db.query.benefit.findMany({
          columns: {
            benefitId: true,
            benefitName: true,
            benefitDescription: true,
            benefitIcon: true,
          },
          where: eq(benefit.benefitIsPublished, true),
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
        db.query.certification.findMany({
          columns: {
            certificationId: true,
            name: true,
            image: true,
            displayOrder: true,
          },
          where: eq(certification.isPublished, true),
          orderBy: (c, { asc }) => [asc(c.displayOrder)],
        }),
        db.query.service.findMany({
          columns: {
            serviceId: true,
            serviceName: true,
            serviceDescription: true,
            serviceIcon: true,
            serviceIsPublished: true,
            servicePoints: true,
            serviceBtnText: true,
            serviceBtnLink: true,
          },
          where: eq(service.serviceIsPublished, true),
          orderBy: (s, { asc }) => [asc(s.createdAt)],
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
            scrollIndicatorVisible: heroRow.scrollIndicatorVisible,
          }
        : fallbackHero;

      const rawBenefits = benefitRows.map((r) => ({
        benefitId: r.benefitId,
        benefitName: r.benefitName,
        benefitDescription: r.benefitDescription,
        benefitIcon: r.benefitIcon,
      }));
      const rawStats = companyStatRows.map((r) => ({
        companyStatId: r.companyStatId,
        value: r.value,
        label: r.label,
        displayOrder: r.displayOrder,
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

      const rawCertifications = certificationRows.map((r) => ({
        certificationId: r.certificationId,
        name: r.name,
        image: r.image,
        displayOrder: r.displayOrder,
      }));

      const rawIndustries = categoryPortofolioRows.map((r) => ({
        categoryPortofolioId: r.categoryPortofolioId,
        categoryPortofolioName: r.categoryPortofolioName,
        categoryPortofolioSlug: r.categoryPortofolioSlug,
        categoryPortofolioImage: r.categoryPortofolioImage || "",
        categoryPortofolioDescription: r.categoryPortofolioDescription || "",
      }));

      const rawServices = serviceRows.map((r) => ({
        serviceId: r.serviceId,
        serviceName: r.serviceName,
        serviceDescription: r.serviceDescription,
        serviceIcon: r.serviceIcon,
        serviceIsPublished: r.serviceIsPublished,
        servicePoints: (r.servicePoints as string[]) ?? [],
        serviceBtnText: r.serviceBtnText,
        serviceBtnLink: r.serviceBtnLink,
      }));

      return {
        rawHero,
        rawBenefits,
        rawStats,
        rawContacts,
        rawCategoryProducts,
        rawSocialMedia,
        rawCertifications,
        rawIndustries,
        rawServices,
      };
    }
  );

  const {
    rawHero,
    rawBenefits,
    rawStats,
    rawContacts,
    rawCategoryProducts,
    rawSocialMedia,
    rawCertifications,
    rawIndustries,
    rawServices,
  } = companyData;

  const hero = await applyHeroSectionTranslation(rawHero, locale);

  const benefits = await applyBenefitTranslations(rawBenefits, locale);
  const stats = await applyCompanyStatTranslations(rawStats, locale);

  const categories = await applyCategoryProductTranslations(
    rawCategoryProducts,
    locale
  );

  const contacts = await applyContactTranslations(rawContacts, locale);

  const certifications = await applyCertificationTranslations(rawCertifications, locale);

  const industries = await applyCategoryPortofolioTranslations(rawIndustries, locale);

  const services = await applyServiceTranslations(rawServices, locale);

  return (
    <div className="w-full">
      <PageHeroSection hero={hero} />
      <CompanyStatsSection stats={stats} />
      <AboutContentSection />
      <CertificationSection certifications={certifications} />
      <VisionMissionSection />
      <IndustrySection industries={industries} />
      <BenefitSection benefits={benefits} stats={[]} />
      <VideoSection />
      <ServiceSection services={services} />
      <FooterSection
        contacts={contacts}
        socialMedia={rawSocialMedia}
        categories={categories}
      />
    </div>
  );
}
