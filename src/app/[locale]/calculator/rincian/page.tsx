import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { eq } from "drizzle-orm";

import { CalculatorRincianView } from "@/components/calculator/calculator-rincian-view";
import { FooterSection } from "@/components/footer";
import { PageHeroSection } from "@/components/hero-section";
import { cachedQuery } from "@/lib/cache/content-cache-helpers";
import { contentCacheKey } from "@/lib/cache";
import { db } from "@/db";
import { heroSection } from "@/db/schema/hero-section";
import { getFooterData } from "@/lib/footer/get-footer-data";
import { applyHeroSectionTranslation } from "@/lib/translate/get-translated";

export const metadata: Metadata = {
  title: "Rincian Penawaran | SAKTITEMP®",
  description:
    "Ringkasan estimasi biaya kaca dari kalkulator SAKTITEMP. Lanjutkan ke WhatsApp untuk verifikasi final.",
  keywords: [
    "rincian kalkulator kaca tempered",
    "estimasi biaya kaca tempered",
    "ringkasan penawaran kaca",
    "kalkulator kaca saktitemp",
    "rincian harga kaca tempered",
    "simulasi biaya kaca",
    "penawaran kaca tempered",
  ],
  openGraph: {
    title: "Rincian Penawaran | SAKTITEMP®",
    description:
      "Lihat ringkasan estimasi biaya kaca tempered dari kalkulator SAKTITEMP dan lanjutkan ke WhatsApp untuk verifikasi final.",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/calculator/rincian",
  },
};

type Props = {
  params: Promise<{ locale: string }>;
};

const FALLBACK_HERO = {
  heroSectionId: "fallback",
  pageKey: "calculator-rician",
  preHeading: null,
  mainHeading: "Rincian Penawaran Anda",
  subHeading: "Berikut adalah estimasi biaya berdasarkan spesifikasi yang Anda pilih.",
  description:
    "Silakan lanjutkan ke WhatsApp untuk verifikasi final dan Bernegosiasi dengan Tim Kami.",
  backgroundImageUrl: "",
  scrollIndicatorText: "SCROLL",
  scrollIndicatorVisible: false,
  breadcrumbItems: [
    { label: "Home", href: "/" },
    { label: "Calculator", href: "/calculator" },
    { label: "Rincian", href: "/calculator/rincian" },
  ] as { label: string; href: string }[],
};

export default async function CalculatorRincianPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const footerDataPromise = getFooterData(locale);
  const heroRow = await cachedQuery(contentCacheKey("calculator-rician", "hero"), () =>
    db.query.heroSection.findFirst({
      where: eq(heroSection.pageKey, "calculator-rician"),
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
    })
  );

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
        scrollIndicatorVisible: heroRow.scrollIndicatorVisible ?? true,
        breadcrumbItems:
          (heroRow.breadcrumbItems as { label: string; href: string }[] | null) ??
          null,
      }
    : FALLBACK_HERO;
  const hero = await applyHeroSectionTranslation(rawHero, locale);
  const footerData = await footerDataPromise;

  return (
    <div className="w-full">
      <PageHeroSection hero={hero!} />
      <section
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14"
        aria-label="Rincian penawaran"
      >
        <CalculatorRincianView />
      </section>
      <FooterSection
        contacts={footerData.contacts}
        socialMedia={footerData.socialMedia}
        categories={footerData.categories}
      />
    </div>
  );
}
