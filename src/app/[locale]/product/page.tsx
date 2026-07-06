import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { desc, eq, inArray, isNotNull, or } from "drizzle-orm";

import { FooterSection } from "@/components/footer";
import { PageHeroSection } from "@/components/hero-section";
import { ProductPageContent } from "@/components/product/product-page-content";
import { ServiceSection } from "@/components/service";
import { cachedQuery } from "@/lib/cache/content-cache-helpers";
import { contentCacheKey } from "@/lib/cache";
import { db } from "@/db";
import { categoryProduct } from "@/db/schema/category-product";
import { contact } from "@/db/schema/contact";
import { heroSection } from "@/db/schema/hero-section";
import { portofolio } from "@/db/schema/portofolio";
import { product } from "@/db/schema/product";
import { productApplication } from "@/db/schema/product-application";
import { productApplicationPortofolio } from "@/db/schema/product-application-portofolio";
import { productExellence } from "@/db/schema/product-exellence";
import { productThickness } from "@/db/schema/product-thickness";
import { service } from "@/db/schema/service";
import { socialMedia } from "@/db/schema/social-media";
import { thickness } from "@/db/schema/thickness";
import {
  applyCategoryProductTranslations,
  applyContactTranslations,
  applyHeroSectionTranslation,
  applyPortofolioTypeTranslations,
  applyProductTranslations,
  applyServiceTranslations,
} from "@/lib/translate/get-translated";
import type { ProductListCardData } from "@/components/product/product-list-card";
import type {
  CategoryOption,
  ThicknessOption,
  PortofolioTypeOption,
} from "@/components/product/product-filter-toolbar";

export const revalidate = 300;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.product" });
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
  const t = await getTranslations({ locale, namespace: "fallbackHero.product" });
  return {
    heroSectionId: "fallback",
    pageKey: "products",
    preHeading: null,
    mainHeading: t("mainHeading"),
    subHeading: t("subHeading"),
    description: t("description"),
    backgroundImageUrl: "",
    scrollIndicatorText: t("scrollIndicatorText"),
    scrollIndicatorVisible: true,
    breadcrumbItems: [
      { label: t("home"), href: "/" },
      { label: t("page"), href: "/product" },
    ] as { label: string; href: string }[],
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fallbackHero = await getFallbackHero(locale);

  const {
    heroRow,
    productRows,
    categoryRows,
    thicknessRows,
    portofolioTypeRows,
    serviceRows,
    contactRows,
    socialMediaRows,
    thicknessByProduct,
    excellenceByProduct,
    productPortofolioTypeIds,
  } = await cachedQuery(contentCacheKey("product", "list"), async () => {
    const [
      heroRaw,
      productRaw,
      categoryRaw,
      thicknessRaw,
      portofolioTypeRaw,
      serviceRaw,
      contactRaw,
      socialMediaRaw,
    ] = await Promise.all([
      db.query.heroSection.findFirst({
        where: or(
          eq(heroSection.pageKey, "products"),
          eq(heroSection.pageKey, "product")
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
      db
        .select({
          productId: product.productId,
          productName: product.productName,
          productSlug: product.productSlug,
          productShortDescription: product.productShortDescription,
          productImageUrl: product.productImageUrl,
          categoryProductId: product.categoryProductId,
          categoryProductName: categoryProduct.categoryProductName,
          categoryProductSlug: categoryProduct.categoryProductSlug,
          productViews: product.productViews,
        })
        .from(product)
        .leftJoin(
          categoryProduct,
          eq(product.categoryProductId, categoryProduct.categoryProductId)
        )
        .where(eq(product.productIsPublished, true))
        .orderBy(desc(product.productViews), desc(product.productIsPublishedAt)),
      db.query.categoryProduct.findMany({
        columns: {
          categoryProductId: true,
          categoryProductName: true,
          categoryProductSlug: true,
        },
      }),
      db.query.thickness.findMany({
        columns: {
          thicknessId: true,
          thicknessValue: true,
          thicknessUnit: true,
        },
        orderBy: (t, { asc }) => [asc(t.thicknessValue)],
      }),
      db.query.portofolioType.findMany({
        columns: {
          portofolioTypeId: true,
          portofolioTypeName: true,
          portofolioTypeSlug: true,
        },
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
    ]);

    const productIds = productRaw.map((r) => r.productId);

    const [thicknessJunctionRows, excellenceRows, productPortofolioTypeRows] =
      await Promise.all([
        productIds.length > 0
          ? db
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
              .where(inArray(productThickness.productId, productIds))
          : [],
        productIds.length > 0
          ? db
              .select()
              .from(productExellence)
              .where(inArray(productExellence.productId, productIds))
          : [],
        db
          .select({
            productId: productApplication.productId,
            portofolioTypeId: portofolio.portofolioTypeId,
          })
          .from(productApplication)
          .innerJoin(
            productApplicationPortofolio,
            eq(
              productApplication.productApplicationId,
              productApplicationPortofolio.productApplicationId
            )
          )
          .innerJoin(
            portofolio,
            eq(productApplicationPortofolio.portofolioId, portofolio.portofolioId)
          )
          .where(isNotNull(portofolio.portofolioTypeId)),
      ]);

    const productPortofolioTypeIdsMap = new Map<string, string[]>();
    for (const r of productPortofolioTypeRows) {
      if (r.productId && r.portofolioTypeId) {
        const arr = productPortofolioTypeIdsMap.get(r.productId) ?? [];
        if (!arr.includes(r.portofolioTypeId)) arr.push(r.portofolioTypeId);
        productPortofolioTypeIdsMap.set(r.productId, arr);
      }
    }
    const productPortofolioTypeIdsResult = Object.fromEntries(
      productPortofolioTypeIdsMap
    ) as Record<string, string[]>;

    const thicknessByProductResult: Record<
      string,
      { productThicknessValue: number; productThicknessUnit: string }[]
    > = {};
    for (const t of thicknessJunctionRows) {
      if (t.productId) {
        const arr = thicknessByProductResult[t.productId] ?? [];
        arr.push({
          productThicknessValue: t.thicknessValue,
          productThicknessUnit: t.thicknessUnit,
        });
        thicknessByProductResult[t.productId] = arr;
      }
    }

    const excellenceByProductResult: Record<string, string[]> = {};
    for (const e of excellenceRows) {
      if (e.productId) {
        const arr = excellenceByProductResult[e.productId] ?? [];
        arr.push(e.productExellenceDescription);
        excellenceByProductResult[e.productId] = arr;
      }
    }

    return {
      heroRow: heroRaw,
      productRows: productRaw,
      categoryRows: categoryRaw,
      thicknessRows: thicknessRaw,
      portofolioTypeRows: portofolioTypeRaw,
      serviceRows: serviceRaw,
      contactRows: contactRaw,
      socialMediaRows: socialMediaRaw,
      thicknessByProduct: thicknessByProductResult,
      excellenceByProduct: excellenceByProductResult,
      productPortofolioTypeIds: productPortofolioTypeIdsResult,
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
        breadcrumbItems: (heroRow.breadcrumbItems as { label: string; href: string }[] | null) ?? null,
      }
    : fallbackHero;

  const hero = (await applyHeroSectionTranslation(rawHero, locale)) ?? rawHero;

  const translatedProducts = await applyProductTranslations(
    productRows.map((r) => ({
      productId: r.productId,
      productName: r.productName,
      productShortDescription: r.productShortDescription,
      productDescription: "",
    })),
    locale
  );

  const categories = await applyCategoryProductTranslations(
    categoryRows.map((c) => ({
      categoryProductId: c.categoryProductId,
      categoryProductName: c.categoryProductName,
      categoryProductSlug: c.categoryProductSlug,
    })),
    locale
  );

  const categoryMap = new Map(
    categories.map((c) => [c.categoryProductId, c.categoryProductName])
  );

  const products: ProductListCardData[] = productRows.map((r, i) => {
    const t = translatedProducts[i];
    return {
      productId: r.productId,
      productName: t?.productName ?? r.productName,
      productSlug: r.productSlug,
      productShortDescription:
        t?.productShortDescription ?? r.productShortDescription,
      productImageUrl: r.productImageUrl,
      categoryProductId: r.categoryProductId,
      categoryName: r.categoryProductId
        ? categoryMap.get(r.categoryProductId) ?? r.categoryProductName
        : r.categoryProductName,
      thicknesses: thicknessByProduct[r.productId] ?? [],
      excellences: excellenceByProduct[r.productId] ?? [],
    };
  });

  const thicknesses: ThicknessOption[] = thicknessRows.map((t) => ({
    thicknessId: t.thicknessId,
    thicknessValue: t.thicknessValue,
    thicknessUnit: t.thicknessUnit,
  }));

  const portofolioTypes = await applyPortofolioTypeTranslations(
    portofolioTypeRows.map((pt) => ({
      portofolioTypeId: pt.portofolioTypeId,
      portofolioTypeName: pt.portofolioTypeName,
      portofolioTypeSlug: pt.portofolioTypeSlug,
    })),
    locale
  );

  const categoryOptions: CategoryOption[] = categories.map((c) => ({
    categoryProductId: c.categoryProductId,
    categoryProductName: c.categoryProductName,
    categoryProductSlug: c.categoryProductSlug,
  }));

  const portofolioTypeOptions: PortofolioTypeOption[] = portofolioTypes.map(
    (pt) => ({
      portofolioTypeId: pt.portofolioTypeId,
      portofolioTypeName: pt.portofolioTypeName,
      portofolioTypeSlug: pt.portofolioTypeSlug,
    })
  );

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
  const services = await applyServiceTranslations(rawServices, locale);

  const contacts = await applyContactTranslations(
    contactRows.map((r) => ({
      contactId: r.contactId,
      contactType: r.contactType,
      contactLabel: r.contactLabel,
      contactValue: r.contactValue,
      contactValueExtra: r.contactValueExtra,
      contactIcon: r.contactIcon,
    })),
    locale
  );

  const categoriesForFooter = await applyCategoryProductTranslations(
    categoryRows.map((c) => ({
      categoryProductId: c.categoryProductId,
      categoryProductName: c.categoryProductName,
      categoryProductSlug: c.categoryProductSlug,
    })),
    locale
  );

  return (
    <div className="w-full">
      <PageHeroSection hero={hero} />
      <ProductPageContent
        products={products}
        categories={categoryOptions}
        thicknesses={thicknesses}
        portofolioTypes={portofolioTypeOptions}
        productPortofolioTypeIds={productPortofolioTypeIds}
      />
      <ServiceSection
        services={services}
        hideCtaBanner
        variant="gray-white"
      />
      <FooterSection
        contacts={contacts}
        socialMedia={socialMediaRows.map((r) => ({
          socialMediaId: r.socialMediaId,
          platformName: r.platformName,
          profileUrl: r.profileUrl,
          iconName: r.iconName,
        }))}
        categories={categoriesForFooter}
      />
    </div>
  );
}
