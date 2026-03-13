import { setRequestLocale } from "next-intl/server";

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
import { db } from "@/db";
import { benefit } from "@/db/schema/benefit";
import { certification } from "@/db/schema/certification";
import { companyStat } from "@/db/schema/company-stat";
import { contact } from "@/db/schema/contact";
import { heroSection } from "@/db/schema/hero-section";
import { service } from "@/db/schema/service";
import { socialMedia } from "@/db/schema/social-media";
import {
  translateBenefitsAndStats,
  translateCertifications,
  translateCategoryPortofolios,
  translateCategoryProducts,
  translateContacts,
  translateHeroSection,
  translateServices,
} from "@/lib/translate";

type Props = {
  params: Promise<{ locale: string }>;
};

const FALLBACK_HERO = {
  heroSectionId: "fallback",
  pageKey: "about",
  preHeading: "ABOUT US",
  mainHeading: "Membangun Kepercayaan",
  subHeading: "Melalui Presisi *Dan* Kualitas",
  description:
    "Manufaktur kaca tempered berpresisi tinggi dengan standar kualitas dan keandalan untuk setiap proyek.",
  backgroundImageUrl: "",
  scrollIndicatorText: "SCROLL",
  scrollIndicatorVisible: true,
};

export default async function AboutCompanyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

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
          categoryPortofolioIcon: true,
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
    : FALLBACK_HERO;

  const hero = await translateHeroSection(rawHero, locale);

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

  const { benefits, stats } = await translateBenefitsAndStats(
    rawBenefits,
    rawStats,
    locale
  );

  const rawContacts = contactRows.map((r) => ({
    contactId: r.contactId,
    contactType: r.contactType,
    contactLabel: r.contactLabel,
    contactValue: r.contactValue,
    contactValueExtra: r.contactValueExtra,
    contactIcon: r.contactIcon,
  }));

  const categories = await translateCategoryProducts(
    categoryProductRows.map((r) => ({
      categoryProductId: r.categoryProductId,
      categoryProductName: r.categoryProductName,
      categoryProductSlug: r.categoryProductSlug,
    })),
    locale
  );

  const contacts = await translateContacts(rawContacts, locale);

  const rawCertifications = certificationRows.map((r) => ({
    certificationId: r.certificationId,
    name: r.name,
    image: r.image,
    displayOrder: r.displayOrder,
  }));
  const certifications = await translateCertifications(rawCertifications, locale);

  const rawIndustries = categoryPortofolioRows.map((r) => ({
    categoryPortofolioId: r.categoryPortofolioId,
    categoryPortofolioName: r.categoryPortofolioName,
    categoryPortofolioSlug: r.categoryPortofolioSlug,
    categoryPortofolioIcon: r.categoryPortofolioIcon || "Building2",
    categoryPortofolioImage: r.categoryPortofolioImage || "",
    categoryPortofolioDescription: r.categoryPortofolioDescription || "",
  }));
  const industries = await translateCategoryPortofolios(rawIndustries, locale);

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
  const services = await translateServices(rawServices, locale);

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
