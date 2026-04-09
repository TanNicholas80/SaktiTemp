import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { asc, eq, sql } from "drizzle-orm";

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

import { CalculatorHeroActions, CalculatorSection } from "@/components/calculator";
import { FooterSection } from "@/components/footer";
import { PageHeroSection } from "@/components/hero-section";
import { cachedQuery } from "@/lib/cache/content-cache-helpers";
import { contentCacheKey } from "@/lib/cache";
import { db } from "@/db";
import { heroSection } from "@/db/schema/hero-section";
import { getFooterData } from "@/lib/footer/get-footer-data";
import { applyHeroSectionTranslation } from "@/lib/translate/get-translated";
import { glassTypes } from "@/db/schema/glass_types";
import { glassPrices } from "@/db/schema/glass_prices";
import { processingCategories } from "@/db/schema/processing_categories";
import { processingPrices } from "@/db/schema/processing_prices";
import { thickness } from "@/db/schema/thickness";

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
  const footerDataPromise = getFooterData(locale);

  const [heroRow, glassTypeList, glassPriceList, processingCategoryList, processingPriceList] =
    await Promise.all([
      cachedQuery(contentCacheKey("calculator", "hero"), () =>
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
      ),
      db
        .select({
          glassTypeId: glassTypes.glassTypeId,
          glassTypeName: glassTypes.glassTypeName,
          glassTypeImageUrl: glassTypes.glassTypeImageUrl,
        })
        .from(glassTypes)
        .orderBy(asc(glassTypes.glassTypeName)),
      db
        .select({
          glassPricesId: glassPrices.glassPricesId,
          glassTypeId: glassPrices.glassTypeId,
          thicknessId: glassPrices.thicknessId,
          variant: glassPrices.variant,
          variantImageUrl: glassPrices.variantImageUrl,
          composition: glassPrices.composition,
          compositionDetail: glassPrices.compositionDetail,
          pricePerSqm: glassPrices.pricePerSqm,
          thicknessValue: thickness.thicknessValue,
          thicknessUnit: thickness.thicknessUnit,
        })
        .from(glassPrices)
        .innerJoin(thickness, eq(glassPrices.thicknessId, thickness.thicknessId))
        .orderBy(asc(glassPrices.variant), asc(thickness.thicknessValue)),
      db
        .select({
          processingCategoryId: processingCategories.processingCategoryId,
          categoryName: processingCategories.categoryName,
          categoryImageUrl: processingCategories.categoryImageUrl,
        })
        .from(processingCategories)
        .orderBy(asc(processingCategories.categoryName)),
      db
        .select({
          processingPricesId: processingPrices.processingPricesId,
          categoryId: processingPrices.categoryId,
          thickness: processingPrices.thickness,
          minThickness: processingPrices.minThickness,
          maxThickness: processingPrices.maxThickness,
          serviceName: processingPrices.serviceName,
          unit: processingPrices.unit,
          price: processingPrices.price,
        })
        .from(processingPrices)
        .orderBy(
          asc(processingPrices.serviceName),
          asc(sql`coalesce(${processingPrices.minThickness}, ${processingPrices.thickness})`)
        ),
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
      <PageHeroSection
        hero={hero!}
        afterDescription={<CalculatorHeroActions />}
      />
      <section
        id="calculator"
        className="scroll-mt-20 lg:scroll-mt-24"
        aria-label="Kalkulator"
      >
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <CalculatorSection
            glassTypes={glassTypeList}
            glassPrices={glassPriceList.map((r) => ({
              ...r,
              pricePerSqm: Number(r.pricePerSqm),
            }))}
            processingCategories={processingCategoryList}
            processingPrices={processingPriceList.map((r) => ({
              ...r,
              thickness: r.thickness !== null ? Number(r.thickness) : null,
              minThickness: r.minThickness !== null ? Number(r.minThickness) : null,
              maxThickness: r.maxThickness !== null ? Number(r.maxThickness) : null,
              price: Number(r.price),
              unit: r.unit as "m1" | "pcs" | "sqm" | "none",
            }))}
          />
        </div>
      </section>
      <FooterSection
        contacts={footerData.contacts}
        socialMedia={footerData.socialMedia}
        categories={footerData.categories}
      />
    </div>
  );
}
