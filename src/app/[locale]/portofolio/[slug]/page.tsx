import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

import { and, desc, eq, inArray, ne } from "drizzle-orm";

import { FooterSection } from "@/components/footer";
import {
  PortofolioDetailContent,
  PortofolioDetailHero,
  PortofolioDetailSidebar,
  PortofolioDetailSuggestions,
} from "@/components/portofolio";
import type { PortofolioDetailData } from "@/components/portofolio/types";
import type { SuggestionCardData } from "@/components/portofolio/portofolio-detail-suggestions";
import { db } from "@/db";
import { categoryPortofolio } from "@/db/schema/category-portofolio";
import { contact } from "@/db/schema/contact";
import { portofolio } from "@/db/schema/portofolio";
import { productApplication } from "@/db/schema/product-application";
import { productApplicationPortofolio } from "@/db/schema/product-application-portofolio";
import { productThickness } from "@/db/schema/product-thickness";
import { product } from "@/db/schema/product";
import { socialMedia } from "@/db/schema/social-media";
import { thickness } from "@/db/schema/thickness";
import {
  applyCategoryProductTranslations,
  applyContactTranslations,
  applyPortofolioTranslations,
  applyPortofolioDetailTranslations,
  applyProductApplicationTranslations,
  applyProductTranslations,
} from "@/lib/translate/get-translated";
import { routing } from "@/i18n/routing";
import { PortofolioJsonLd } from "@/components/seo/json-ld";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const rows = await db.query.portofolio.findMany({
    where: (p, { eq: eqFn }) => eqFn(p.portofolioIsPublished, true),
    columns: { portofolioSlug: true },
  });
  return rows.flatMap((r) =>
    routing.locales.map((locale) => ({ locale, slug: r.portofolioSlug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "seo.portofolioDetail" });
  const row = await db
    .select({
      portofolioName: portofolio.portofolioName,
      portofolioShortDescription: portofolio.portofolioShortDescription,
      portofolioLocation: portofolio.portofolioLocation,
      portofolioImageUrl: portofolio.portofolioImageUrl,
      categoryPortofolioName: categoryPortofolio.categoryPortofolioName,
    })
    .from(portofolio)
    .leftJoin(
      categoryPortofolio,
      eq(portofolio.categoryPortofolioId, categoryPortofolio.categoryPortofolioId)
    )
    .where(eq(portofolio.portofolioSlug, slug))
    .limit(1)
    .then((rows) => rows[0]);

  if (!row) {
    return { title: t("notFoundTitle"), robots: { index: false, follow: false } };
  }

  const description = row.portofolioShortDescription
    ?? t("descriptionFallback", {
      name: row.portofolioName,
      location: row.portofolioLocation ?? t("defaultLocation"),
    });

  const baseKeywords = t("baseKeywords").split(",");

  const dynamicKeywords: string[] = [
    row.portofolioName,
    row.portofolioLocation ?? "",
    row.categoryPortofolioName ?? "",
  ].filter(Boolean);

  return {
    title: row.portofolioName,
    description,
    openGraph: {
      title: t("ogTitleTemplate", { name: row.portofolioName }),
      description,
      images: row.portofolioImageUrl
        ? [{ url: row.portofolioImageUrl, width: 1200, height: 630 }]
        : [{ url: "/og-default.jpg", width: 1200, height: 630 }],
    },
    keywords: [...baseKeywords, ...dynamicKeywords],
    alternates: { canonical: `/portofolio/${slug}` },
  };
}

export default async function PortofolioDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const rows = await db
    .select({
      portofolioId: portofolio.portofolioId,
      portofolioName: portofolio.portofolioName,
      portofolioSlug: portofolio.portofolioSlug,
      portofolioAbout: portofolio.portofolioAbout,
      portofolioGalleryImages: portofolio.portofolioGalleryImages,
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
    .where(
      and(
        eq(portofolio.portofolioSlug, slug),
        eq(portofolio.portofolioIsPublished, true)
      )
    )
    .limit(1);

  const dbRow = rows[0];
  if (!dbRow) {
    notFound();
  }

  const translatedPortofolio = await applyPortofolioDetailTranslations(
    {
      portofolioId: dbRow.portofolioId,
      portofolioName: dbRow.portofolioName,
      portofolioShortDescription: "",
      portofolioAbout: dbRow.portofolioAbout,
      portofolioLocation: dbRow.portofolioLocation ?? "",
    },
    locale
  );

  const row = {
    ...dbRow,
    portofolioName: translatedPortofolio.portofolioName,
    portofolioAbout: translatedPortofolio.portofolioAbout,
    portofolioLocation: translatedPortofolio.portofolioLocation || dbRow.portofolioLocation,
  };

  const papLinks = await db
    .select({ productApplicationId: productApplicationPortofolio.productApplicationId })
    .from(productApplicationPortofolio)
    .where(eq(productApplicationPortofolio.portofolioId, row.portofolioId));

  const productApplicationIds = papLinks
    .map((p) => p.productApplicationId)
    .filter((id): id is string => id != null);

  let productApplications: PortofolioDetailData["productApplications"] = [];

  if (productApplicationIds.length > 0) {
    const paRows = await db
      .select({
        productApplicationId: productApplication.productApplicationId,
        productApplicationName: productApplication.productApplicationName,
        productApplicationDescription: productApplication.productApplicationDescription,
        productApplicationImageUrl: productApplication.productApplicationImageUrl,
        productId: productApplication.productId,
        productName: product.productName,
        productSlug: product.productSlug,
      })
      .from(productApplication)
      .leftJoin(product, eq(productApplication.productId, product.productId))
      .where(inArray(productApplication.productApplicationId, productApplicationIds));

    const productIds = paRows
      .map((r) => r.productId)
      .filter((id): id is string => id != null);
    const uniqueProductIds = [...new Set(productIds)];

    const thicknessRows =
      uniqueProductIds.length > 0
        ? await db
            .select({
              productId: productThickness.productId,
              thicknessValue: thickness.thicknessValue,
              thicknessUnit: thickness.thicknessUnit,
            })
            .from(productThickness)
            .innerJoin(
              thickness,
              eq(productThickness.thicknessId, thickness.thicknessId)
            )
            .where(inArray(productThickness.productId, uniqueProductIds))
        : [];

    const thicknessByProduct = new Map<
      string,
      { productThicknessValue: number; productThicknessUnit: string }[]
    >();
    for (const t of thicknessRows) {
      if (t.productId) {
        const arr = thicknessByProduct.get(t.productId) ?? [];
        arr.push({
          productThicknessValue: t.thicknessValue,
          productThicknessUnit: t.thicknessUnit,
        });
        thicknessByProduct.set(t.productId, arr);
      }
    }

    const translatedPaRows = await applyProductApplicationTranslations(
      paRows.map((r) => ({
        productApplicationId: r.productApplicationId,
        productApplicationName: r.productApplicationName,
        productApplicationDescription: r.productApplicationDescription,
      })),
      locale
    );

    const paTranslationMap = new Map(
      translatedPaRows.map((tr) => [tr.productApplicationId, tr])
    );

    const uniqueProducts = Array.from(
      new Map(
        paRows
          .filter((r) => r.productId != null)
          .map((r) => [
            r.productId,
            {
              productId: r.productId!,
              productName: r.productName ?? "-",
              productShortDescription: "",
              productDescription: "",
            },
          ])
      ).values()
    );

    const translatedProducts = uniqueProducts.length > 0
      ? await applyProductTranslations(uniqueProducts, locale)
      : [];

    const productTranslationMap = new Map(
      translatedProducts.map((p) => [p.productId, p.productName])
    );

    productApplications = paRows.map((r) => {
      const paTr = paTranslationMap.get(r.productApplicationId);
      const translatedProductName = r.productId ? productTranslationMap.get(r.productId) : undefined;
      return {
        productApplicationId: r.productApplicationId,
        productApplicationName: paTr?.productApplicationName ?? r.productApplicationName,
        productApplicationDescription: paTr?.productApplicationDescription ?? r.productApplicationDescription,
        productApplicationImageUrl: r.productApplicationImageUrl,
        product: {
          productId: r.productId ?? "",
          productName: translatedProductName ?? r.productName ?? "-",
          productSlug: r.productSlug ?? "",
          thicknesses: r.productId
            ? thicknessByProduct.get(r.productId) ?? []
            : [],
        },
      };
    });
  }

  const portofolioDetail: PortofolioDetailData = {
    portofolioId: row.portofolioId,
    portofolioName: row.portofolioName,
    portofolioSlug: row.portofolioSlug,
    portofolioAbout: row.portofolioAbout,
    portofolioGalleryImages: Array.isArray(row.portofolioGalleryImages)
      ? row.portofolioGalleryImages
      : [],
    portofolioLocation: row.portofolioLocation,
    portofolioImageUrl: row.portofolioImageUrl,
    portofolioIsPublishedAt: row.portofolioIsPublishedAt.toISOString(),
    category: row.categoryPortofolioName
      ? {
          name: row.categoryPortofolioName,
          slug: row.categoryPortofolioSlug ?? "",
        }
      : null,
    productApplications,
  };

  const suggestionRows = await db
    .select({
      portofolioId: portofolio.portofolioId,
      portofolioName: portofolio.portofolioName,
      portofolioSlug: portofolio.portofolioSlug,
      portofolioImageUrl: portofolio.portofolioImageUrl,
      portofolioLocation: portofolio.portofolioLocation,
      categoryPortofolioName: categoryPortofolio.categoryPortofolioName,
    })
    .from(portofolio)
    .leftJoin(
      categoryPortofolio,
      eq(portofolio.categoryPortofolioId, categoryPortofolio.categoryPortofolioId)
    )
    .where(
      and(
        eq(portofolio.portofolioIsPublished, true),
        ne(portofolio.portofolioId, row.portofolioId)
      )
    )
    .orderBy(desc(portofolio.portofolioIsPublishedAt))
    .limit(6);

  const rawSuggestions = suggestionRows.map((r) => ({
    portofolioId: r.portofolioId,
    portofolioName: r.portofolioName,
    portofolioSlug: r.portofolioSlug,
    portofolioImageUrl: r.portofolioImageUrl,
    portofolioLocation: r.portofolioLocation,
    categoryName: r.categoryPortofolioName,
  }));

  const translatedSuggestions = await applyPortofolioTranslations(
    rawSuggestions.map((p) => ({
      portofolioId: p.portofolioId,
      portofolioName: p.portofolioName,
      portofolioSlug: p.portofolioSlug,
      portofolioShortDescription: "",
      portofolioLocation: p.portofolioLocation ?? "",
      portofolioImageUrl: p.portofolioImageUrl,
      portofolioIsPublishedAt: "",
      categoryName: p.categoryName,
      categorySlug: null,
    })),
    locale
  );

  const suggestions: SuggestionCardData[] = translatedSuggestions.map((p) => ({
    portofolioId: p.portofolioId,
    portofolioName: p.portofolioName,
    portofolioSlug: p.portofolioSlug,
    portofolioImageUrl: p.portofolioImageUrl,
    portofolioLocation: p.portofolioLocation,
    categoryName: p.categoryName,
  }));

  const [contactRows, socialMediaRows, categoryProductRows] = await Promise.all([
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

  const [contacts, categories] = await Promise.all([
    applyContactTranslations(
      contactRows.map((r) => ({
        contactId: r.contactId,
        contactType: r.contactType,
        contactLabel: r.contactLabel,
        contactValue: r.contactValue,
        contactValueExtra: r.contactValueExtra,
        contactIcon: r.contactIcon,
      })),
      locale
    ),
    applyCategoryProductTranslations(
      categoryProductRows.map((r) => ({
        categoryProductId: r.categoryProductId,
        categoryProductName: r.categoryProductName,
        categoryProductSlug: r.categoryProductSlug,
      })),
      locale
    ),
  ]);

  const t = await getTranslations("portofolioSection");

  const pageUrl = `https://www.saktitemp.com/portofolio/${slug}`;

  return (
    <div className="w-full bg-white">
      <PortofolioJsonLd portofolio={portofolioDetail} url={pageUrl} />
      <PortofolioDetailHero portofolio={portofolioDetail} variant="landing" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-10 xl:gap-12">
          <div className="min-w-0">
            <PortofolioDetailContent
              portofolio={portofolioDetail}
              variant="landing"
            />
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <PortofolioDetailSidebar
              portofolio={portofolioDetail}
              variant="landing"
            />
          </aside>
        </div>
      </div>

      <PortofolioDetailSuggestions
        suggestions={suggestions}
        title={t("relatedTitle")}
        viewAllText={t("viewAllProjects")}
        emptyTitle={t("relatedEmpty")}
        emptyDescription={t("relatedEmptyDesc")}
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
