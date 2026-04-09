import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { eq } from "drizzle-orm";

import { ContactContentSection } from "@/components/contact";

import { FooterSection } from "@/components/footer";
import { PageHeroSection } from "@/components/hero-section";
import { LocationSection } from "@/components/location";
import { cachedQuery } from "@/lib/cache/content-cache-helpers";
import { contentCacheKey } from "@/lib/cache";
import { db } from "@/db";
import { contact } from "@/db/schema/contact";
import { heroSection } from "@/db/schema/hero-section";
import { location } from "@/db/schema/location";
import { socialMedia } from "@/db/schema/social-media";
import {
  applyCategoryProductTranslations,
  applyContactTranslations,
  applyHeroSectionTranslation,
  applyLocationTranslations,
} from "@/lib/translate/get-translated";

type Props = {
  params: Promise<{ locale: string }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.aboutContact" });
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
  const t = await getTranslations({
    locale,
    namespace: "fallbackHero.aboutContact",
  });
  return {
    heroSectionId: "fallback",
    pageKey: "contact",
    preHeading: t("preHeading"),
    mainHeading: t("mainHeading"),
    subHeading: t("subHeading"),
    description: t("description"),
    backgroundImageUrl: "",
    scrollIndicatorText: t("scrollIndicatorText"),
    scrollIndicatorVisible: true,
  };
}

export default async function AboutContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fallbackHero = await getFallbackHero(locale);

  const contactData = await cachedQuery(
    contentCacheKey("about", "contact"),
    async () => {
      const [heroRow, locationRows, contactRows, categoryProductRows, socialMediaRows] =
        await Promise.all([
          db.query.heroSection.findFirst({
            where: eq(heroSection.pageKey, "contact"),
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
        rawHero,
        rawLocations,
        rawContacts,
        rawCategoryProducts,
        rawSocialMedia,
      };
    }
  );

  const {
    rawHero,
    rawLocations,
    rawContacts,
    rawCategoryProducts,
    rawSocialMedia,
  } = contactData;

  const hero = await applyHeroSectionTranslation(rawHero, locale);

  const [locations, contacts, categories] = await Promise.all([
    applyLocationTranslations(rawLocations, locale),
    applyContactTranslations(rawContacts, locale),
    applyCategoryProductTranslations(rawCategoryProducts, locale),
  ]);

  return (
    <div className="w-full">
      <PageHeroSection hero={hero!} />
      <ContactContentSection
        locations={locations}
        contacts={contacts}
        socialMedia={rawSocialMedia}
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
