import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { eq } from "drizzle-orm";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Kalkulator Kaca",
  description:
    "Hitung estimasi kebutuhan kaca tempered untuk proyek Anda dengan kalkulator online SAKTITEMP®.",
  keywords: [
    "kalkulator kaca tempered",
    "hitung kebutuhan kaca",
    "kalkulator luas kaca",
    "estimasi kaca tempered",
    "kalkulator material kaca",
    "kalkulator kaca bangunan",
  ],
  openGraph: {
    title: "Kalkulator Kaca | SAKTITEMP®",
    description:
      "Hitung estimasi kebutuhan kaca tempered untuk proyek Anda dengan kalkulator online SAKTITEMP®.",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630 }],
  },
};

type Props = {
  params: Promise<{ locale: string }>;
};

import { PageHeroSection } from "@/components/hero-section";
import { cachedQuery } from "@/lib/cache/content-cache-helpers";
import { contentCacheKey } from "@/lib/cache";
import { db } from "@/db";
import { heroSection } from "@/db/schema/hero-section";
import { applyHeroSectionTranslation } from "@/lib/translate/get-translated";

const FALLBACK_HERO = {
  heroSectionId: "fallback",
  pageKey: "calculator",
  preHeading: null,
  mainHeading: "Kalkulasikan Kebutuhan Kaca Anda",
  subHeading: "Estimasi Biaya Kaca Tempered Untuk Kebutuhan Proyek Anda",
  description:
    "Masukkan detail ukuran dan spesifikasi kaca untuk mendapatkan estimasi biaya awal. Praktis untuk perencanaan budget proyek sebelum konsultasi lanjutan dengan tim kami.",
  backgroundImageUrl: "",
  scrollIndicatorText: "SCROLL",
  scrollIndicatorVisible: true,
  breadcrumbItems: [
    { label: "Home", href: "/" },
    { label: "Calculator", href: "/calculator" },
  ] as { label: string; href: string }[],
};

export default async function CalculatorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const heroRow = await cachedQuery(contentCacheKey("calculator", "hero"), () =>
    db.query.heroSection.findFirst({
      where: eq(heroSection.pageKey, "calculator"),
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

  return (
    <div className="w-full">
      <PageHeroSection hero={hero!} />
      <div className="container py-12">
        <h2 className="text-3xl font-bold">Calculator</h2>
        <p className="text-muted-foreground mt-2">Calculator page</p>
      </div>
    </div>
  );
}
