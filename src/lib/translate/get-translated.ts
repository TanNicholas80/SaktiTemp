import { eq, and, inArray } from "drizzle-orm";

import { db } from "@/db";

import { benefitTranslations } from "@/db/schema/benefit-translations";
import { blogTranslations } from "@/db/schema/blog-translations";
import { carouselTranslations } from "@/db/schema/carousel-translations";
import { categoryBlogTranslations } from "@/db/schema/category-blog-translations";
import { categoryPortofolioTranslations } from "@/db/schema/category-portofolio-translations";
import { categoryProductTranslations } from "@/db/schema/category-product-translations";
import { companyStatTranslations } from "@/db/schema/company-stat-translations";
import { contactTranslations } from "@/db/schema/contact-translations";
import { heroSectionTranslations } from "@/db/schema/hero-section-translations";
import { locationTranslations } from "@/db/schema/location-translations";
import { portofolioTranslations } from "@/db/schema/portofolio-translations";
import { portofolioTypeTranslations } from "@/db/schema/portofolio-type-translations";
import { productTranslations } from "@/db/schema/product-translations";
import { productApplicationTranslations } from "@/db/schema/product-application-translations";
import { productExellenceTranslations } from "@/db/schema/product-exellence-translations";
import { serviceTranslations } from "@/db/schema/service-translations";
import { certificationTranslations } from "@/db/schema/certification-translations";
import { glassTypesTranslations } from "@/db/schema/glass-types-translations";
import { glassPricesTranslations } from "@/db/schema/glass-prices-translations";
import { modificationTranslations } from "@/db/schema/modification-translations";
import { processingCategoriesTranslations } from "@/db/schema/processing-categories-translations";
import { processingPricesTranslations } from "@/db/schema/processing-prices-translations";
import { socialMediaTranslations } from "@/db/schema/social-media-translations";
import { thicknessTranslations } from "@/db/schema/thickness-translations";

// Locale "id" | "en" | "zh": prefer row in *_translations; fallback to main table if missing.

// ---- Carousel ----
export async function applyCarouselTranslations<
  T extends { carouselId: string; carouselHeading: string; carouselSubheading: string; carouselDescription: string },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map((i) => i.carouselId);
  const rows = await db
    .select()
    .from(carouselTranslations)
    .where(and(inArray(carouselTranslations.carouselId, ids), eq(carouselTranslations.locale, locale)));
  const m = new Map(rows.map((r) => [r.carouselId, r]));
  return items.map((item) => {
    const tr = m.get(item.carouselId);
    if (!tr) return item;
    return { ...item, carouselHeading: tr.carouselHeading, carouselSubheading: tr.carouselSubheading, carouselDescription: tr.carouselDescription };
  });
}

// ---- Benefit ----
export async function applyBenefitTranslations<
  T extends { benefitId: string; benefitName: string; benefitDescription: string },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map((i) => i.benefitId);
  const rows = await db
    .select()
    .from(benefitTranslations)
    .where(and(inArray(benefitTranslations.benefitId, ids), eq(benefitTranslations.locale, locale)));
  const m = new Map(rows.map((r) => [r.benefitId, r]));
  return items.map((item) => {
    const tr = m.get(item.benefitId);
    if (!tr) return item;
    return { ...item, benefitName: tr.benefitName, benefitDescription: tr.benefitDescription };
  });
}

// ---- Company Stat ----
export async function applyCompanyStatTranslations<
  T extends { companyStatId: string; label: string },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map((i) => i.companyStatId);
  const rows = await db
    .select()
    .from(companyStatTranslations)
    .where(and(inArray(companyStatTranslations.companyStatId, ids), eq(companyStatTranslations.locale, locale)));
  const m = new Map(rows.map((r) => [r.companyStatId, r]));
  return items.map((item) => {
    const tr = m.get(item.companyStatId);
    if (!tr) return item;
    return { ...item, label: tr.label };
  });
}

// ---- Blog ----
export async function applyBlogTranslations<
  T extends { blogId: string; blogTitle: string; blogExcerpt: string },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map((i) => i.blogId);
  const rows = await db
    .select()
    .from(blogTranslations)
    .where(and(inArray(blogTranslations.blogId, ids), eq(blogTranslations.locale, locale)));
  const m = new Map(rows.map((r) => [r.blogId, r]));
  return items.map((item) => {
    const tr = m.get(item.blogId);
    if (!tr) return item;
    return { ...item, blogTitle: tr.blogTitle, blogExcerpt: tr.blogExcerpt };
  });
}

export async function applyBlogDetailTranslations<
  T extends { blogId: string; blogTitle: string; blogExcerpt: string; blogContent: string },
>(item: T, locale: string): Promise<T> {
  const rows = await db
    .select()
    .from(blogTranslations)
    .where(and(eq(blogTranslations.blogId, item.blogId), eq(blogTranslations.locale, locale)))
    .limit(1);
  const tr = rows[0];
  if (!tr) return item;
  return { ...item, blogTitle: tr.blogTitle, blogExcerpt: tr.blogExcerpt, blogContent: tr.blogContent };
}

// ---- Category Blog ----
export async function applyCategoryBlogTranslations<
  T extends { categoryBlogId: string; categoryBlogName: string },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map((i) => i.categoryBlogId);
  const rows = await db
    .select()
    .from(categoryBlogTranslations)
    .where(and(inArray(categoryBlogTranslations.categoryBlogId, ids), eq(categoryBlogTranslations.locale, locale)));
  const m = new Map(rows.map((r) => [r.categoryBlogId, r]));
  return items.map((item) => {
    const tr = m.get(item.categoryBlogId);
    if (!tr) return item;
    return { ...item, categoryBlogName: tr.categoryBlogName };
  });
}

// ---- Blog list items with inline category name ----
export async function applyBlogWithCategoryTranslations<
  T extends { blogId: string; blogTitle: string; blogExcerpt: string },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const blogIds = items.map((i) => i.blogId);
  const blogRows = await db
    .select()
    .from(blogTranslations)
    .where(and(inArray(blogTranslations.blogId, blogIds), eq(blogTranslations.locale, locale)));
  const blogMap = new Map(blogRows.map((r) => [r.blogId, r]));

  return items.map((item) => {
    const tr = blogMap.get(item.blogId);
    if (!tr) return item;
    return { ...item, blogTitle: tr.blogTitle, blogExcerpt: tr.blogExcerpt };
  });
}

// ---- Portofolio ----
export async function applyPortofolioTranslations<
  T extends {
    portofolioId: string;
    portofolioName: string;
    portofolioShortDescription: string;
    portofolioLocation: string;
  },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map((i) => i.portofolioId);
  const rows = await db
    .select()
    .from(portofolioTranslations)
    .where(and(inArray(portofolioTranslations.portofolioId, ids), eq(portofolioTranslations.locale, locale)));
  const m = new Map(rows.map((r) => [r.portofolioId, r]));
  return items.map((item) => {
    const tr = m.get(item.portofolioId);
    if (!tr) return item;
    return {
      ...item,
      portofolioName: tr.portofolioName,
      portofolioShortDescription: tr.portofolioShortDescription,
      portofolioLocation: tr.portofolioLocation,
    };
  });
}

export async function applyPortofolioDetailTranslations<
  T extends {
    portofolioId: string;
    portofolioName: string;
    portofolioShortDescription: string;
    portofolioAbout: string;
    portofolioClient: string;
    portofolioLocation: string;
  },
>(item: T, locale: string): Promise<T> {
  const rows = await db
    .select()
    .from(portofolioTranslations)
    .where(and(eq(portofolioTranslations.portofolioId, item.portofolioId), eq(portofolioTranslations.locale, locale)))
    .limit(1);
  const tr = rows[0];
  if (!tr) return item;
  return {
    ...item,
    portofolioName: tr.portofolioName,
    portofolioShortDescription: tr.portofolioShortDescription,
    portofolioAbout: tr.portofolioAbout,
    portofolioClient: tr.portofolioClient,
    portofolioLocation: tr.portofolioLocation,
  };
}

// ---- Category Portofolio ----
export async function applyCategoryPortofolioTranslations<
  T extends { categoryPortofolioId: string; categoryPortofolioName: string },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map((i) => i.categoryPortofolioId);
  const rows = await db
    .select()
    .from(categoryPortofolioTranslations)
    .where(
      and(inArray(categoryPortofolioTranslations.categoryPortofolioId, ids), eq(categoryPortofolioTranslations.locale, locale))
    );
  const m = new Map(rows.map((r) => [r.categoryPortofolioId, r]));
  return items.map((item) => {
    const tr = m.get(item.categoryPortofolioId);
    if (!tr) return item;
    return { ...item, categoryPortofolioName: tr.categoryPortofolioName };
  });
}

// ---- Portofolio Type ----
export async function applyPortofolioTypeTranslations<
  T extends { portofolioTypeId: string; portofolioTypeName: string },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map((i) => i.portofolioTypeId);
  const rows = await db
    .select()
    .from(portofolioTypeTranslations)
    .where(and(inArray(portofolioTypeTranslations.portofolioTypeId, ids), eq(portofolioTypeTranslations.locale, locale)));
  const m = new Map(rows.map((r) => [r.portofolioTypeId, r]));
  return items.map((item) => {
    const tr = m.get(item.portofolioTypeId);
    if (!tr) return item;
    return { ...item, portofolioTypeName: tr.portofolioTypeName };
  });
}

// ---- Contact ----
export async function applyContactTranslations<
  T extends { contactId: string; contactLabel: string; contactValue: string },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map((i) => i.contactId);
  const rows = await db
    .select()
    .from(contactTranslations)
    .where(and(inArray(contactTranslations.contactId, ids), eq(contactTranslations.locale, locale)));
  const m = new Map(rows.map((r) => [r.contactId, r]));
  return items.map((item) => {
    const tr = m.get(item.contactId);
    if (!tr) return item;
    const baseExtra =
      "contactValueExtra" in item
        ? (item as T & { contactValueExtra?: string | null }).contactValueExtra
        : undefined;
    return {
      ...item,
      contactLabel: tr.contactLabel,
      contactValue: tr.contactValue,
      contactValueExtra: tr.contactValueExtra ?? baseExtra ?? null,
    };
  });
}

// ---- Location ----
export async function applyLocationTranslations<
  T extends { locationId: string; locationCity: string; locationAddress: string },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map((i) => i.locationId);
  const rows = await db
    .select()
    .from(locationTranslations)
    .where(and(inArray(locationTranslations.locationId, ids), eq(locationTranslations.locale, locale)));
  const m = new Map(rows.map((r) => [r.locationId, r]));
  return items.map((item) => {
    const tr = m.get(item.locationId);
    if (!tr) return item;
    return { ...item, locationCity: tr.locationCity, locationAddress: tr.locationAddress };
  });
}

// ---- Category Product ----
export async function applyCategoryProductTranslations<
  T extends { categoryProductId: string; categoryProductName: string },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map((i) => i.categoryProductId);
  const rows = await db
    .select()
    .from(categoryProductTranslations)
    .where(and(inArray(categoryProductTranslations.categoryProductId, ids), eq(categoryProductTranslations.locale, locale)));
  const m = new Map(rows.map((r) => [r.categoryProductId, r]));
  return items.map((item) => {
    const tr = m.get(item.categoryProductId);
    if (!tr) return item;
    return { ...item, categoryProductName: tr.categoryProductName };
  });
}

// ---- Hero Section Overloads ----
/** Input cukup berisi field teks hero; field lain (breadcrumb, gambar, dll.) opsional. */
export async function applyHeroSectionTranslation<
  T extends {
    heroSectionId: string;
    preHeading: string | null;
    mainHeading: string;
    subHeading: string;
    description: string;
    scrollIndicatorText: string | null;
  },
>(item: T, locale: string): Promise<T>;
export async function applyHeroSectionTranslation<
  T extends {
    heroSectionId: string;
    preHeading: string | null;
    mainHeading: string;
    subHeading: string;
    description: string;
    scrollIndicatorText: string | null;
  },
>(item: null, locale: string): Promise<null>;
export async function applyHeroSectionTranslation<
  T extends {
    heroSectionId: string;
    preHeading: string | null;
    mainHeading: string;
    subHeading: string;
    description: string;
    scrollIndicatorText: string | null;
  },
>(item: T | null, locale: string): Promise<T | null> {
  if (!item) return item;
  const rows = await db
    .select()
    .from(heroSectionTranslations)
    .where(and(eq(heroSectionTranslations.heroSectionId, item.heroSectionId), eq(heroSectionTranslations.locale, locale)))
    .limit(1);
  const tr = rows[0];
  if (!tr) return item;
  const baseCrumb =
    "breadcrumbItems" in item ? (item as T & { breadcrumbItems?: unknown }).breadcrumbItems : undefined;
  const nextCrumb = tr.breadcrumbItems ?? baseCrumb;
  return {
    ...item,
    preHeading: tr.preHeading,
    mainHeading: tr.mainHeading,
    subHeading: tr.subHeading,
    description: tr.description,
    scrollIndicatorText: tr.scrollIndicatorText,
    ...(nextCrumb !== undefined ? { breadcrumbItems: nextCrumb } : {}),
  } as T;
}

// ---- Product ----
export async function applyProductTranslations<
  T extends { productId: string; productName: string; productShortDescription: string; productDescription: string },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map((i) => i.productId);
  const rows = await db
    .select()
    .from(productTranslations)
    .where(and(inArray(productTranslations.productId, ids), eq(productTranslations.locale, locale)));
  const m = new Map(rows.map((r) => [r.productId, r]));
  return items.map((item) => {
    const tr = m.get(item.productId);
    if (!tr) return item;
    return {
      ...item,
      productName: tr.productName,
      productShortDescription: tr.productShortDescription,
      productDescription: tr.productDescription,
    };
  });
}

// ---- Product Application ----
export async function applyProductApplicationTranslations<
  T extends { productApplicationId: string; productApplicationName: string; productApplicationDescription: string },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map((i) => i.productApplicationId);
  const rows = await db
    .select()
    .from(productApplicationTranslations)
    .where(
      and(inArray(productApplicationTranslations.productApplicationId, ids), eq(productApplicationTranslations.locale, locale))
    );
  const m = new Map(rows.map((r) => [r.productApplicationId, r]));
  return items.map((item) => {
    const tr = m.get(item.productApplicationId);
    if (!tr) return item;
    return {
      ...item,
      productApplicationName: tr.productApplicationName,
      productApplicationDescription: tr.productApplicationDescription,
    };
  });
}

// ---- Product Exellence ----
export async function applyProductExellenceTranslations<
  T extends { productExellenceId: string; productExellenceDescription: string },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map((i) => i.productExellenceId);
  const rows = await db
    .select()
    .from(productExellenceTranslations)
    .where(
      and(inArray(productExellenceTranslations.productExellenceId, ids), eq(productExellenceTranslations.locale, locale))
    );
  const m = new Map(rows.map((r) => [r.productExellenceId, r]));
  return items.map((item) => {
    const tr = m.get(item.productExellenceId);
    if (!tr) return item;
    return { ...item, productExellenceDescription: tr.productExellenceDescription };
  });
}

// ---- Service ----
export async function applyServiceTranslations<
  T extends { serviceId: string; serviceName: string; serviceDescription: string },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map((i) => i.serviceId);
  const rows = await db
    .select()
    .from(serviceTranslations)
    .where(and(inArray(serviceTranslations.serviceId, ids), eq(serviceTranslations.locale, locale)));
  const m = new Map(rows.map((r) => [r.serviceId, r]));
  return items.map((item) => {
    const tr = m.get(item.serviceId);
    if (!tr) return item;
    const basePoints =
      "servicePoints" in item ? (item as T & { servicePoints?: unknown }).servicePoints : undefined;
    const baseBtn =
      "serviceBtnText" in item ? (item as T & { serviceBtnText?: string }).serviceBtnText : undefined;
    return {
      ...item,
      serviceName: tr.serviceName,
      serviceDescription: tr.serviceDescription,
      servicePoints: tr.servicePoints ?? basePoints,
      serviceBtnText: tr.serviceBtnText ?? baseBtn ?? "",
    };
  });
}

// ---- Certification ----
export async function applyCertificationTranslations<
  T extends { certificationId: string; name: string },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map((i) => i.certificationId);
  const rows = await db
    .select()
    .from(certificationTranslations)
    .where(and(inArray(certificationTranslations.certificationId, ids), eq(certificationTranslations.locale, locale)));
  const m = new Map(rows.map((r) => [r.certificationId, r]));
  return items.map((item) => {
    const tr = m.get(item.certificationId);
    if (!tr) return item;
    return { ...item, name: tr.name };
  });
}

// ---- Glass Types ----
export async function applyGlassTypesTranslations<
  T extends { glassTypeId: string; glassTypeName: string },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map((i) => i.glassTypeId);
  const rows = await db
    .select()
    .from(glassTypesTranslations)
    .where(and(inArray(glassTypesTranslations.glassTypeId, ids), eq(glassTypesTranslations.locale, locale)));
  const m = new Map(rows.map((r) => [r.glassTypeId, r]));
  return items.map((item) => {
    const tr = m.get(item.glassTypeId);
    if (!tr) return item;
    return { ...item, glassTypeName: tr.glassTypeName };
  });
}

// ---- Glass Prices ----
export async function applyGlassPricesTranslations<
  T extends { glassPricesId: string; variant: string },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map((i) => i.glassPricesId);
  const rows = await db
    .select()
    .from(glassPricesTranslations)
    .where(and(inArray(glassPricesTranslations.glassPricesId, ids), eq(glassPricesTranslations.locale, locale)));
  const m = new Map(rows.map((r) => [r.glassPricesId, r]));
  return items.map((item) => {
    const tr = m.get(item.glassPricesId);
    if (!tr) return item;
    return { ...item, variant: tr.variant };
  });
}

// ---- Modification ----
export async function applyModificationTranslations<
  T extends { modificationId: string; name: string },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map((i) => i.modificationId);
  const rows = await db
    .select()
    .from(modificationTranslations)
    .where(and(inArray(modificationTranslations.modificationId, ids), eq(modificationTranslations.locale, locale)));
  const m = new Map(rows.map((r) => [r.modificationId, r]));
  return items.map((item) => {
    const tr = m.get(item.modificationId);
    if (!tr) return item;
    return { ...item, name: tr.name };
  });
}

// ---- Processing Categories ----
export async function applyProcessingCategoriesTranslations<
  T extends { processingCategoryId: string; categoryName: string },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map((i) => i.processingCategoryId);
  const rows = await db
    .select()
    .from(processingCategoriesTranslations)
    .where(
      and(
        inArray(processingCategoriesTranslations.processingCategoryId, ids),
        eq(processingCategoriesTranslations.locale, locale)
      )
    );
  const m = new Map(rows.map((r) => [r.processingCategoryId, r]));
  return items.map((item) => {
    const tr = m.get(item.processingCategoryId);
    if (!tr) return item;
    return { ...item, categoryName: tr.categoryName };
  });
}

// ---- Processing Prices ----
export async function applyProcessingPricesTranslations<
  T extends { processingPricesId: string; serviceName: string },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map((i) => i.processingPricesId);
  const rows = await db
    .select()
    .from(processingPricesTranslations)
    .where(
      and(inArray(processingPricesTranslations.processingPricesId, ids), eq(processingPricesTranslations.locale, locale))
    );
  const m = new Map(rows.map((r) => [r.processingPricesId, r]));
  return items.map((item) => {
    const tr = m.get(item.processingPricesId);
    if (!tr) return item;
    return { ...item, serviceName: tr.serviceName };
  });
}

// ---- Social Media ----
export async function applySocialMediaTranslations<
  T extends { socialMediaId: string; platformName: string },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map((i) => i.socialMediaId);
  const rows = await db
    .select()
    .from(socialMediaTranslations)
    .where(and(inArray(socialMediaTranslations.socialMediaId, ids), eq(socialMediaTranslations.locale, locale)));
  const m = new Map(rows.map((r) => [r.socialMediaId, r]));
  return items.map((item) => {
    const tr = m.get(item.socialMediaId);
    if (!tr) return item;
    return { ...item, platformName: tr.platformName };
  });
}

// ---- Thickness ----
export async function applyThicknessTranslations<
  T extends { thicknessId: string; thicknessUnit: string },
>(items: T[], locale: string): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map((i) => i.thicknessId);
  const rows = await db
    .select()
    .from(thicknessTranslations)
    .where(and(inArray(thicknessTranslations.thicknessId, ids), eq(thicknessTranslations.locale, locale)));
  const m = new Map(rows.map((r) => [r.thicknessId, r]));
  return items.map((item) => {
    const tr = m.get(item.thicknessId);
    if (!tr) return item;
    return { ...item, thicknessUnit: tr.thicknessUnit };
  });
}
