import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { eq, inArray } from "drizzle-orm";

import { FooterSection } from "@/components/footer";
import { ProductDetailSection } from "@/components/product/product-detail-section";
import { db } from "@/db";
import { categoryProduct } from "@/db/schema/category-product";
import { contact } from "@/db/schema/contact";
import { portofolio } from "@/db/schema/portofolio";
import { portofolioType } from "@/db/schema/portofolio-type";
import { product } from "@/db/schema/product";
import { productApplication } from "@/db/schema/product-application";
import { productApplicationPortofolio } from "@/db/schema/product-application-portofolio";
import { productExellence } from "@/db/schema/product-exellence";
import { productThickness } from "@/db/schema/product-thickness";
import { thickness } from "@/db/schema/thickness";
import {
  applyCategoryProductTranslations,
  applyContactTranslations,
  applyPortofolioTranslations,
  applyPortofolioTypeTranslations,
  applyProductTranslations,
} from "@/lib/translate/get-translated";
import type { ProductDetailData } from "@/components/product/types";
import { routing } from "@/i18n/routing";
import { ProductJsonLd } from "@/components/seo/json-ld";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const rows = await db.query.product.findMany({
    where: (p, { eq: eqFn }) => eqFn(p.productIsPublished, true),
    columns: { productSlug: true },
  });
  return rows.flatMap((r) =>
    routing.locales.map((locale) => ({ locale, slug: r.productSlug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const row = await db
    .select({
      productName: product.productName,
      productShortDescription: product.productShortDescription,
      productImageUrl: product.productImageUrl,
      categoryProductName: categoryProduct.categoryProductName,
    })
    .from(product)
    .leftJoin(
      categoryProduct,
      eq(product.categoryProductId, categoryProduct.categoryProductId)
    )
    .where(eq(product.productSlug, slug))
    .limit(1)
    .then((rows) => rows[0]);

  if (!row) {
    return { title: "Produk tidak ditemukan", robots: { index: false, follow: false } };
  }

  const baseKeywords = [
    "produk kaca tempered",
    "jenis kaca tempered",
    "kaca tempered bangunan",
    "kaca tempered interior",
    "kaca tempered eksterior",
  ];

  const dynamicKeywords: string[] = [
    row.productName,
    row.categoryProductName ?? "",
  ].filter(Boolean);

  return {
    title: row.productName,
    description: row.productShortDescription ?? undefined,
    openGraph: {
      title: `${row.productName} | SAKTITEMP®`,
      description: row.productShortDescription ?? undefined,
      images: row.productImageUrl
        ? [{ url: row.productImageUrl, width: 1200, height: 630 }]
        : [{ url: "/og-default.jpg", width: 1200, height: 630 }],
    },
    keywords: [...baseKeywords, ...dynamicKeywords],
    alternates: { canonical: `/product/${slug}` },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const productRow = await db
    .select({
      productId: product.productId,
      productName: product.productName,
      productSlug: product.productSlug,
      productShortDescription: product.productShortDescription,
      productDescription: product.productDescription,
      productImageUrl: product.productImageUrl,
      productIsPublished: product.productIsPublished,
      productIsPublishedAt: product.productIsPublishedAt,
      categoryProductId: product.categoryProductId,
      categoryProductName: categoryProduct.categoryProductName,
      categoryProductSlug: categoryProduct.categoryProductSlug,
    })
    .from(product)
    .leftJoin(
      categoryProduct,
      eq(product.categoryProductId, categoryProduct.categoryProductId)
    )
    .where(eq(product.productSlug, slug))
    .limit(1)
    .then((rows) => rows[0]);

  if (!productRow || !productRow.productIsPublished) {
    notFound();
  }

  const [thicknessRows, excellenceRows, productApplicationRows, categoryRowsForFooter] =
    await Promise.all([
      db
        .select({
          thicknessId: thickness.thicknessId,
          thicknessValue: thickness.thicknessValue,
          thicknessUnit: thickness.thicknessUnit,
        })
        .from(productThickness)
        .innerJoin(
          thickness,
          eq(productThickness.thicknessId, thickness.thicknessId)
        )
        .where(eq(productThickness.productId, productRow.productId)),
      db
        .select()
        .from(productExellence)
        .where(eq(productExellence.productId, productRow.productId)),
      db
        .select({
          productApplicationId: productApplication.productApplicationId,
          productApplicationName: productApplication.productApplicationName,
        })
        .from(productApplication)
        .where(eq(productApplication.productId, productRow.productId)),
      db.query.categoryProduct.findMany({
        columns: {
          categoryProductId: true,
          categoryProductName: true,
          categoryProductSlug: true,
        },
      }),
    ]);

  const productApplicationIds = productApplicationRows
    .map((a) => a.productApplicationId)
    .filter((id): id is string => id != null);

  const portofolioIds =
    productApplicationIds.length > 0
      ? [
          ...new Set(
            (
              await db
                .select({
                  portofolioId: productApplicationPortofolio.portofolioId,
                })
                .from(productApplicationPortofolio)
                .where(
                  inArray(
                    productApplicationPortofolio.productApplicationId,
                    productApplicationIds
                  )
                )
            )
              .map((p) => p.portofolioId)
              .filter((id): id is string => id != null)
          ),
        ]
      : [];

  const filteredPortofolios =
    portofolioIds.length > 0
      ? await db
          .select({
            portofolioId: portofolio.portofolioId,
            portofolioName: portofolio.portofolioName,
            portofolioSlug: portofolio.portofolioSlug,
            portofolioLocation: portofolio.portofolioLocation,
            portofolioImageUrl: portofolio.portofolioImageUrl,
            portofolioTypeId: portofolio.portofolioTypeId,
            portofolioTypeName: portofolioType.portofolioTypeName,
            portofolioTypeSlug: portofolioType.portofolioTypeSlug,
          })
          .from(portofolio)
          .leftJoin(
            portofolioType,
            eq(portofolio.portofolioTypeId, portofolioType.portofolioTypeId)
          )
          .where(inArray(portofolio.portofolioId, portofolioIds))
      : [];

  const portofolioTypesMap = new Map<
    string,
    {
      portofolioTypeId: string;
      portofolioTypeName: string;
      portofolioTypeSlug: string;
    }
  >();
  for (const p of filteredPortofolios) {
    if (
      p.portofolioTypeId &&
      p.portofolioTypeName &&
      !portofolioTypesMap.has(p.portofolioTypeId)
    ) {
      portofolioTypesMap.set(p.portofolioTypeId, {
        portofolioTypeId: p.portofolioTypeId,
        portofolioTypeName: p.portofolioTypeName,
        portofolioTypeSlug: p.portofolioTypeSlug ?? "",
      });
    }
  }
  const portofolioTypes = Array.from(portofolioTypesMap.values());

  const [
    translatedProducts,
    translatedPortofolioTypes,
    translatedPortofolios,
    translatedCategories,
    translatedCategoriesFooter,
    contactRows,
    socialMediaRows,
  ] = await Promise.all([
    applyProductTranslations(
      [
        {
          productId: productRow.productId,
          productName: productRow.productName,
          productShortDescription: productRow.productShortDescription ?? "",
          productDescription: productRow.productDescription,
        },
      ],
      locale
    ),
    applyPortofolioTypeTranslations(
      portofolioTypes.map((t) => ({
        portofolioTypeId: t.portofolioTypeId,
        portofolioTypeName: t.portofolioTypeName,
        portofolioTypeSlug: t.portofolioTypeSlug,
      })),
      locale
    ),
    applyPortofolioTranslations(
      filteredPortofolios.map((p) => ({
        portofolioId: p.portofolioId,
        portofolioName: p.portofolioName,
        portofolioSlug: p.portofolioSlug,
        portofolioShortDescription: "",
        portofolioLocation: p.portofolioLocation ?? "",
        portofolioImageUrl: p.portofolioImageUrl ?? "",
        portofolioIsPublishedAt: "",
        categoryName: null,
        categorySlug: null,
      })),
      locale
    ),
    productRow.categoryProductId
      ? applyCategoryProductTranslations(
          [
            {
              categoryProductId: productRow.categoryProductId,
              categoryProductName: productRow.categoryProductName ?? "",
              categoryProductSlug: productRow.categoryProductSlug ?? "",
            },
          ],
          locale
        )
      : Promise.resolve([]),
    applyCategoryProductTranslations(
      categoryRowsForFooter.map((c) => ({
        categoryProductId: c.categoryProductId,
        categoryProductName: c.categoryProductName,
        categoryProductSlug: c.categoryProductSlug,
      })),
      locale
    ),
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
    }),
  ]);

  const tProduct = translatedProducts[0];
  const tCategory = translatedCategories[0];

  const productDetail: ProductDetailData = {
    productId: productRow.productId,
    productName: tProduct?.productName ?? productRow.productName,
    productSlug: productRow.productSlug,
    productDescription:
      tProduct?.productDescription ?? productRow.productDescription,
    productImageUrl: productRow.productImageUrl,
    productIsPublished: productRow.productIsPublished,
    productIsPublishedAt:
      productRow.productIsPublishedAt?.toISOString() ?? "",
    category: productRow.categoryProductId
      ? {
          name:
            tCategory?.categoryProductName ??
            productRow.categoryProductName ??
            "",
          slug:
            tCategory?.categoryProductSlug ??
            productRow.categoryProductSlug ??
            "",
        }
      : null,
    thicknesses: thicknessRows.map((t) => ({
      productThicknessValue: t.thicknessValue,
      productThicknessUnit: t.thicknessUnit,
    })),
    excellences: excellenceRows.map((e) => ({
      productExellenceDescription: e.productExellenceDescription,
    })),
    productApplications: productApplicationRows.map((a) => ({
      productApplicationId: a.productApplicationId ?? "",
      productApplicationName: a.productApplicationName ?? "",
    })),
    portofolioTypes: translatedPortofolioTypes.map((t) => ({
      portofolioTypeId: t.portofolioTypeId,
      portofolioTypeName: t.portofolioTypeName,
      portofolioTypeSlug: t.portofolioTypeSlug,
    })),
    portofolios: translatedPortofolios.map((p) => ({
      portofolioId: p.portofolioId,
      portofolioName: p.portofolioName,
      portofolioSlug: p.portofolioSlug,
      portofolioLocation: p.portofolioLocation,
      portofolioImageUrl: p.portofolioImageUrl,
    })),
  };

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

  const pageUrl = `https://www.saktitemp.com/product/${slug}`;

  return (
    <div className="w-full bg-white">
      <ProductJsonLd product={productDetail} url={pageUrl} />
      <ProductDetailSection product={productDetail} />
      <FooterSection
        contacts={contacts}
        socialMedia={socialMediaRows.map((r) => ({
          socialMediaId: r.socialMediaId,
          platformName: r.platformName,
          profileUrl: r.profileUrl,
          iconName: r.iconName,
        }))}
        categories={translatedCategoriesFooter}
      />
    </div>
  );
}
