import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { asc, eq } from "drizzle-orm";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.calculator" });
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

import { CalculatorHeroActions, CalculatorSection } from "@/components/calculator";
import { FooterSection } from "@/components/footer";
import { PageHeroSection } from "@/components/hero-section";
import { cachedQuery } from "@/lib/cache/content-cache-helpers";
import { contentCacheKey } from "@/lib/cache";
import { db } from "@/db";
import { heroSection } from "@/db/schema/hero-section";
import { getFooterData } from "@/lib/footer/get-footer-data";
import {
  applyHeroSectionTranslation,
  applyGlassTypesTranslations,
  applyGlassPricesTranslations,
  applyThicknessTranslations,
} from "@/lib/translate/get-translated";
import { glassTypes } from "@/db/schema/glass_types";
import { glassPrices } from "@/db/schema/glass_prices";
import { thickness } from "@/db/schema/thickness";

async function getFallbackHero(locale: string) {
  const t = await getTranslations({ locale, namespace: "fallbackHero.calculator" });
  return {
    heroSectionId: "fallback",
    pageKey: "calculator",
    preHeading: null,
    mainHeading: t("mainHeading"),
    subHeading: t("subHeading"),
    description: t("description"),
    backgroundImageUrl: "",
    scrollIndicatorText: t("scrollIndicatorText"),
    scrollIndicatorVisible: true,
    breadcrumbItems: [
      { label: t("home"), href: "/" },
      { label: t("page"), href: "/calculator" },
    ] as { label: string; href: string }[],
  };
}

export default async function CalculatorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fallbackHero = await getFallbackHero(locale);
  const footerDataPromise = getFooterData(locale);

  const calculatorData = await cachedQuery(
    contentCacheKey("calculator", "page", locale),
    async () => {
      const [heroRow, glassTypeList, glassPriceList] = await Promise.all([
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
        }),
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
      ]);

      const translatedGlassTypes = await applyGlassTypesTranslations(
        glassTypeList,
        locale
      );
      const glassPricesWithIds = glassPriceList.map((row) => ({
        ...row,
        pricePerSqm: Number(row.pricePerSqm),
      }));
      const variantTranslated = await applyGlassPricesTranslations(
        glassPricesWithIds,
        locale
      );
      const fullyTranslatedPrices = await applyThicknessTranslations(
        variantTranslated,
        locale
      );

      return {
        heroRow,
        glassTypeList: translatedGlassTypes,
        glassPriceList: fullyTranslatedPrices,
      };
    }
  );

  const { heroRow, glassTypeList, glassPriceList } = calculatorData;

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
    : fallbackHero;

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
            glassPrices={glassPriceList}
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
