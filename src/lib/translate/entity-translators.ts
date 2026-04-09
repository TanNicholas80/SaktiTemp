import { eq, and } from "drizzle-orm";

import { db } from "@/db";
import { translateFields, ALL_STORED_LOCALES } from "./gemini-translate";
import {
  translatableTextsUnchanged,
  jsonFieldUnchanged,
  excellenceDescriptionsUnchanged,
  splitBlogContentForTranslation,
} from "./translation-optimize";

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
import { processingCategoriesTranslations } from "@/db/schema/processing-categories-translations";
import { processingPricesTranslations } from "@/db/schema/processing-prices-translations";
import { socialMediaTranslations } from "@/db/schema/social-media-translations";
import { thicknessTranslations } from "@/db/schema/thickness-translations";

type StringFields = Record<string, string | string[] | null>;

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function strOrNull(v: unknown): string | null {
  return v == null ? null : String(v);
}

function strArr(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : [];
}

// ---- Benefit ----
export async function translateAndSaveBenefit(
  data: {
    benefitId: string;
    benefitName: string;
    benefitDescription: string;
  },
  previous?: Partial<Pick<typeof data, "benefitName" | "benefitDescription">> | null
) {
  if (
    translatableTextsUnchanged(
      previous as Record<string, unknown> | null,
      data as Record<string, unknown>,
      ["benefitName", "benefitDescription"]
    )
  ) {
    return;
  }

  const result = await translateFields(
    { benefitName: data.benefitName, benefitDescription: data.benefitDescription },
    "company benefit/advantage section"
  );

  for (const locale of ALL_STORED_LOCALES) {
    const t = result[locale];
    await db
      .insert(benefitTranslations)
      .values({
        benefitId: data.benefitId,
        locale,
        benefitName: str(t.benefitName),
        benefitDescription: str(t.benefitDescription),
      })
      .onConflictDoUpdate({
        target: [benefitTranslations.benefitId, benefitTranslations.locale],
        set: {
          benefitName: str(t.benefitName),
          benefitDescription: str(t.benefitDescription),
        },
      });
  }
}

// ---- Blog ----
export async function translateAndSaveBlog(
  data: {
    blogId: string;
    blogTitle: string;
    blogExcerpt: string;
    blogContent: string;
  },
  previous?: Partial<Pick<typeof data, "blogTitle" | "blogExcerpt" | "blogContent">> | null
) {
  if (
    translatableTextsUnchanged(
      previous as Record<string, unknown> | null,
      data as Record<string, unknown>,
      ["blogTitle", "blogExcerpt", "blogContent"]
    )
  ) {
    return;
  }

  const chunks = splitBlogContentForTranslation(data.blogContent);
  const fields: Record<string, string | string[] | null> = {
    blogTitle: data.blogTitle,
    blogExcerpt: data.blogExcerpt,
  };
  if (chunks.length === 1) {
    fields.blogContent = chunks[0];
  } else {
    fields.blogContentParts = chunks;
  }

  const result = await translateFields(fields, "blog article");

  for (const locale of ALL_STORED_LOCALES) {
    const t = result[locale];
    const blogContent =
      Array.isArray(t.blogContentParts) && t.blogContentParts.length > 0
        ? (t.blogContentParts as string[]).join("")
        : str(t.blogContent);
    await db
      .insert(blogTranslations)
      .values({
        blogId: data.blogId,
        locale,
        blogTitle: str(t.blogTitle),
        blogExcerpt: str(t.blogExcerpt),
        blogContent,
      })
      .onConflictDoUpdate({
        target: [blogTranslations.blogId, blogTranslations.locale],
        set: {
          blogTitle: str(t.blogTitle),
          blogExcerpt: str(t.blogExcerpt),
          blogContent,
        },
      });
  }
}

// ---- Carousel ----
export async function translateAndSaveCarousel(
  data: {
    carouselId: string;
    carouselHeading: string;
    carouselSubheading: string;
    carouselDescription: string;
  },
  previous?: Partial<
    Pick<typeof data, "carouselHeading" | "carouselSubheading" | "carouselDescription">
  > | null
) {
  if (
    translatableTextsUnchanged(
      previous as Record<string, unknown> | null,
      data as Record<string, unknown>,
      ["carouselHeading", "carouselSubheading", "carouselDescription"]
    )
  ) {
    return;
  }

  const result = await translateFields(
    {
      carouselHeading: data.carouselHeading,
      carouselSubheading: data.carouselSubheading,
      carouselDescription: data.carouselDescription,
    },
    "homepage carousel/hero slide"
  );

  for (const locale of ALL_STORED_LOCALES) {
    const t = result[locale];
    await db
      .insert(carouselTranslations)
      .values({
        carouselId: data.carouselId,
        locale,
        carouselHeading: str(t.carouselHeading),
        carouselSubheading: str(t.carouselSubheading),
        carouselDescription: str(t.carouselDescription),
      })
      .onConflictDoUpdate({
        target: [carouselTranslations.carouselId, carouselTranslations.locale],
        set: {
          carouselHeading: str(t.carouselHeading),
          carouselSubheading: str(t.carouselSubheading),
          carouselDescription: str(t.carouselDescription),
        },
      });
  }
}

// ---- Category Blog ----
export async function translateAndSaveCategoryBlog(
  data: {
    categoryBlogId: string;
    categoryBlogName: string;
  },
  previous?: Partial<Pick<typeof data, "categoryBlogName">> | null
) {
  if (
    translatableTextsUnchanged(
      previous as Record<string, unknown> | null,
      data as Record<string, unknown>,
      ["categoryBlogName"]
    )
  ) {
    return;
  }

  const result = await translateFields(
    { categoryBlogName: data.categoryBlogName },
    "blog category name"
  );

  for (const locale of ALL_STORED_LOCALES) {
    const t = result[locale];
    await db
      .insert(categoryBlogTranslations)
      .values({
        categoryBlogId: data.categoryBlogId,
        locale,
        categoryBlogName: str(t.categoryBlogName),
      })
      .onConflictDoUpdate({
        target: [categoryBlogTranslations.categoryBlogId, categoryBlogTranslations.locale],
        set: { categoryBlogName: str(t.categoryBlogName) },
      });
  }
}

// ---- Category Portofolio ----
export async function translateAndSaveCategoryPortofolio(
  data: {
    categoryPortofolioId: string;
    categoryPortofolioName: string;
    categoryPortofolioDescription: string;
  },
  previous?: Partial<
    Pick<typeof data, "categoryPortofolioName" | "categoryPortofolioDescription">
  > | null
) {
  if (
    translatableTextsUnchanged(
      previous as Record<string, unknown> | null,
      data as Record<string, unknown>,
      ["categoryPortofolioName", "categoryPortofolioDescription"]
    )
  ) {
    return;
  }

  const result = await translateFields(
    {
      categoryPortofolioName: data.categoryPortofolioName,
      categoryPortofolioDescription: data.categoryPortofolioDescription,
    },
    "portfolio category"
  );

  for (const locale of ALL_STORED_LOCALES) {
    const t = result[locale];
    await db
      .insert(categoryPortofolioTranslations)
      .values({
        categoryPortofolioId: data.categoryPortofolioId,
        locale,
        categoryPortofolioName: str(t.categoryPortofolioName),
        categoryPortofolioDescription: str(t.categoryPortofolioDescription),
      })
      .onConflictDoUpdate({
        target: [
          categoryPortofolioTranslations.categoryPortofolioId,
          categoryPortofolioTranslations.locale,
        ],
        set: {
          categoryPortofolioName: str(t.categoryPortofolioName),
          categoryPortofolioDescription: str(t.categoryPortofolioDescription),
        },
      });
  }
}

// ---- Category Product ----
export async function translateAndSaveCategoryProduct(
  data: {
    categoryProductId: string;
    categoryProductName: string;
  },
  previous?: Partial<Pick<typeof data, "categoryProductName">> | null
) {
  if (
    translatableTextsUnchanged(
      previous as Record<string, unknown> | null,
      data as Record<string, unknown>,
      ["categoryProductName"]
    )
  ) {
    return;
  }

  const result = await translateFields(
    { categoryProductName: data.categoryProductName },
    "product category name"
  );

  for (const locale of ALL_STORED_LOCALES) {
    const t = result[locale];
    await db
      .insert(categoryProductTranslations)
      .values({
        categoryProductId: data.categoryProductId,
        locale,
        categoryProductName: str(t.categoryProductName),
      })
      .onConflictDoUpdate({
        target: [categoryProductTranslations.categoryProductId, categoryProductTranslations.locale],
        set: { categoryProductName: str(t.categoryProductName) },
      });
  }
}

// ---- Company Stat ----
export async function translateAndSaveCompanyStat(
  data: {
    companyStatId: string;
    label: string;
  },
  previous?: Partial<Pick<typeof data, "label">> | null
) {
  if (
    translatableTextsUnchanged(
      previous as Record<string, unknown> | null,
      data as Record<string, unknown>,
      ["label"]
    )
  ) {
    return;
  }

  const result = await translateFields(
    { label: data.label },
    "company statistics label (e.g. Years of Experience, Projects Completed)"
  );

  for (const locale of ALL_STORED_LOCALES) {
    const t = result[locale];
    await db
      .insert(companyStatTranslations)
      .values({
        companyStatId: data.companyStatId,
        locale,
        label: str(t.label),
      })
      .onConflictDoUpdate({
        target: [companyStatTranslations.companyStatId, companyStatTranslations.locale],
        set: { label: str(t.label) },
      });
  }
}

// ---- Contact ----
export async function translateAndSaveContact(
  data: {
    contactId: string;
    contactLabel: string;
    contactValue: string;
    contactValueExtra: string | null;
  },
  previous?: Partial<
    Pick<typeof data, "contactLabel" | "contactValue" | "contactValueExtra">
  > | null
) {
  if (
    translatableTextsUnchanged(
      previous as Record<string, unknown> | null,
      data as Record<string, unknown>,
      ["contactLabel", "contactValue", "contactValueExtra"]
    )
  ) {
    return;
  }

  const result = await translateFields(
    {
      contactLabel: data.contactLabel,
      contactValue: data.contactValue,
      contactValueExtra: data.contactValueExtra,
    },
    "contact information (phone, email, address, operational hours)"
  );

  for (const locale of ALL_STORED_LOCALES) {
    const t = result[locale];
    await db
      .insert(contactTranslations)
      .values({
        contactId: data.contactId,
        locale,
        contactLabel: str(t.contactLabel),
        contactValue: str(t.contactValue),
        contactValueExtra: strOrNull(t.contactValueExtra),
      })
      .onConflictDoUpdate({
        target: [contactTranslations.contactId, contactTranslations.locale],
        set: {
          contactLabel: str(t.contactLabel),
          contactValue: str(t.contactValue),
          contactValueExtra: strOrNull(t.contactValueExtra),
        },
      });
  }
}

// ---- Hero Section ----
export async function translateAndSaveHeroSection(
  data: {
    heroSectionId: string;
    preHeading: string | null;
    mainHeading: string;
    subHeading: string;
    description: string;
    scrollIndicatorText: string | null;
    breadcrumbItems: unknown;
  },
  previous?: Partial<{
    preHeading: string | null;
    mainHeading: string;
    subHeading: string;
    description: string;
    scrollIndicatorText: string | null;
    breadcrumbItems: unknown;
  }> | null
) {
  if (
    previous &&
    translatableTextsUnchanged(
      previous as Record<string, unknown>,
      data as Record<string, unknown>,
      [
        "preHeading",
        "mainHeading",
        "subHeading",
        "description",
        "scrollIndicatorText",
      ]
    ) &&
    jsonFieldUnchanged(
      previous as Record<string, unknown>,
      data as Record<string, unknown>,
      "breadcrumbItems"
    )
  ) {
    return;
  }

  const breadcrumbLabels: string[] = [];
  if (Array.isArray(data.breadcrumbItems)) {
    for (const item of data.breadcrumbItems) {
      if (item && typeof item === "object" && "label" in item) {
        breadcrumbLabels.push(String((item as { label: string }).label));
      }
    }
  }

  const result = await translateFields(
    {
      preHeading: data.preHeading,
      mainHeading: data.mainHeading,
      subHeading: data.subHeading,
      description: data.description,
      scrollIndicatorText: data.scrollIndicatorText,
      breadcrumbLabels: breadcrumbLabels.length > 0 ? breadcrumbLabels : null,
    },
    "hero section heading and description for a page"
  );

  for (const locale of ALL_STORED_LOCALES) {
    const t = result[locale];
    let translatedBreadcrumb = data.breadcrumbItems;
    if (Array.isArray(data.breadcrumbItems) && Array.isArray(t.breadcrumbLabels)) {
      translatedBreadcrumb = data.breadcrumbItems.map(
        (item: { label: string; href: string }, idx: number) => ({
          ...item,
          label: (t.breadcrumbLabels as string[])[idx] ?? item.label,
        })
      );
    }

    await db
      .insert(heroSectionTranslations)
      .values({
        heroSectionId: data.heroSectionId,
        locale,
        preHeading: strOrNull(t.preHeading),
        mainHeading: str(t.mainHeading),
        subHeading: str(t.subHeading),
        description: str(t.description),
        scrollIndicatorText: strOrNull(t.scrollIndicatorText),
        breadcrumbItems: translatedBreadcrumb,
      })
      .onConflictDoUpdate({
        target: [heroSectionTranslations.heroSectionId, heroSectionTranslations.locale],
        set: {
          preHeading: strOrNull(t.preHeading),
          mainHeading: str(t.mainHeading),
          subHeading: str(t.subHeading),
          description: str(t.description),
          scrollIndicatorText: strOrNull(t.scrollIndicatorText),
          breadcrumbItems: translatedBreadcrumb,
        },
      });
  }
}

// ---- Location ----
export async function translateAndSaveLocation(
  data: {
    locationId: string;
    locationCity: string;
    locationAddress: string;
  },
  previous?: Partial<Pick<typeof data, "locationCity" | "locationAddress">> | null
) {
  if (
    translatableTextsUnchanged(
      previous as Record<string, unknown> | null,
      data as Record<string, unknown>,
      ["locationCity", "locationAddress"]
    )
  ) {
    return;
  }

  const result = await translateFields(
    { locationCity: data.locationCity, locationAddress: data.locationAddress },
    "office/branch location"
  );

  for (const locale of ALL_STORED_LOCALES) {
    const t = result[locale];
    await db
      .insert(locationTranslations)
      .values({
        locationId: data.locationId,
        locale,
        locationCity: str(t.locationCity),
        locationAddress: str(t.locationAddress),
      })
      .onConflictDoUpdate({
        target: [locationTranslations.locationId, locationTranslations.locale],
        set: {
          locationCity: str(t.locationCity),
          locationAddress: str(t.locationAddress),
        },
      });
  }
}

// ---- Portofolio ----
export async function translateAndSavePortofolio(
  data: {
    portofolioId: string;
    portofolioName: string;
    portofolioShortDescription: string;
    portofolioAbout: string;
    portofolioClient: string;
    portofolioLocation: string;
  },
  previous?: Partial<
    Pick<
      typeof data,
      | "portofolioName"
      | "portofolioShortDescription"
      | "portofolioAbout"
      | "portofolioClient"
      | "portofolioLocation"
    >
  > | null
) {
  if (
    translatableTextsUnchanged(
      previous as Record<string, unknown> | null,
      data as Record<string, unknown>,
      [
        "portofolioName",
        "portofolioShortDescription",
        "portofolioAbout",
        "portofolioClient",
        "portofolioLocation",
      ]
    )
  ) {
    return;
  }

  const result = await translateFields(
    {
      portofolioName: data.portofolioName,
      portofolioShortDescription: data.portofolioShortDescription,
      portofolioAbout: data.portofolioAbout,
      portofolioClient: data.portofolioClient,
      portofolioLocation: data.portofolioLocation,
    },
    "portfolio/project showcase"
  );

  for (const locale of ALL_STORED_LOCALES) {
    const t = result[locale];
    await db
      .insert(portofolioTranslations)
      .values({
        portofolioId: data.portofolioId,
        locale,
        portofolioName: str(t.portofolioName),
        portofolioShortDescription: str(t.portofolioShortDescription),
        portofolioAbout: str(t.portofolioAbout),
        portofolioClient: str(t.portofolioClient),
        portofolioLocation: str(t.portofolioLocation),
      })
      .onConflictDoUpdate({
        target: [portofolioTranslations.portofolioId, portofolioTranslations.locale],
        set: {
          portofolioName: str(t.portofolioName),
          portofolioShortDescription: str(t.portofolioShortDescription),
          portofolioAbout: str(t.portofolioAbout),
          portofolioClient: str(t.portofolioClient),
          portofolioLocation: str(t.portofolioLocation),
        },
      });
  }
}

// ---- Portofolio Type ----
export async function translateAndSavePortofolioType(
  data: {
    portofolioTypeId: string;
    portofolioTypeName: string;
  },
  previous?: Partial<Pick<typeof data, "portofolioTypeName">> | null
) {
  if (
    translatableTextsUnchanged(
      previous as Record<string, unknown> | null,
      data as Record<string, unknown>,
      ["portofolioTypeName"]
    )
  ) {
    return;
  }

  const result = await translateFields(
    { portofolioTypeName: data.portofolioTypeName },
    "portfolio type/category (e.g. Office Building, Hotel)"
  );

  for (const locale of ALL_STORED_LOCALES) {
    const t = result[locale];
    await db
      .insert(portofolioTypeTranslations)
      .values({
        portofolioTypeId: data.portofolioTypeId,
        locale,
        portofolioTypeName: str(t.portofolioTypeName),
      })
      .onConflictDoUpdate({
        target: [portofolioTypeTranslations.portofolioTypeId, portofolioTypeTranslations.locale],
        set: { portofolioTypeName: str(t.portofolioTypeName) },
      });
  }
}

export type ProductWithExcellencesTranslateInput = {
  productId: string;
  productName: string;
  productShortDescription: string;
  productDescription: string;
  excellences: {
    productExellenceId: string;
    productExellenceDescription: string;
  }[];
};

export type ProductWithExcellencesPrevious = Partial<{
  productName: string;
  productShortDescription: string;
  productDescription: string;
  excellenceDescriptions: readonly string[];
}> | null;

/**
 * One Gemini call for product text + all excellence bullets; upserts product_translations and each product_exellence_translations row.
 */
export async function translateAndSaveProductWithExcellences(
  data: ProductWithExcellencesTranslateInput,
  previous?: ProductWithExcellencesPrevious
) {
  const currentDescs = data.excellences.map((e) => e.productExellenceDescription);
  if (previous) {
    const productUnchanged = translatableTextsUnchanged(
      previous as Record<string, unknown>,
      {
        productName: data.productName,
        productShortDescription: data.productShortDescription,
        productDescription: data.productDescription,
      } as Record<string, unknown>,
      ["productName", "productShortDescription", "productDescription"]
    );
    const excellencesUnchanged = excellenceDescriptionsUnchanged(
      previous.excellenceDescriptions,
      currentDescs
    );
    if (productUnchanged && excellencesUnchanged) {
      return;
    }
  }

  const descChunks = splitBlogContentForTranslation(data.productDescription);
  const fields: StringFields = {
    productName: data.productName,
    productShortDescription: data.productShortDescription,
    excellenceDescriptions: currentDescs,
  };
  if (descChunks.length === 1) {
    fields.productDescription = descChunks[0];
  } else {
    fields.productDescriptionParts = descChunks;
  }

  const result = await translateFields(
    fields,
    "tempered glass product and its bullet-point advantages (excellenceDescriptions aligned by index)"
  );

  for (const locale of ALL_STORED_LOCALES) {
    const t = result[locale];
    const productDescription =
      Array.isArray(t.productDescriptionParts) && t.productDescriptionParts.length > 0
        ? (t.productDescriptionParts as string[]).join("")
        : str(t.productDescription);

    await db
      .insert(productTranslations)
      .values({
        productId: data.productId,
        locale,
        productName: str(t.productName),
        productShortDescription: str(t.productShortDescription),
        productDescription,
      })
      .onConflictDoUpdate({
        target: [productTranslations.productId, productTranslations.locale],
        set: {
          productName: str(t.productName),
          productShortDescription: str(t.productShortDescription),
          productDescription,
        },
      });

    const translatedEx = strArr(t.excellenceDescriptions);
    for (let i = 0; i < data.excellences.length; i++) {
      const row = data.excellences[i];
      const desc = translatedEx[i] ?? row.productExellenceDescription;
      await db
        .insert(productExellenceTranslations)
        .values({
          productExellenceId: row.productExellenceId,
          locale,
          productExellenceDescription: desc,
        })
        .onConflictDoUpdate({
          target: [
            productExellenceTranslations.productExellenceId,
            productExellenceTranslations.locale,
          ],
          set: { productExellenceDescription: desc },
        });
    }
  }
}

// ---- Product (tanpa excellence; untuk kompatibilitas — disarankan pakai translateAndSaveProductWithExcellences) ----
export async function translateAndSaveProduct(
  data: {
    productId: string;
    productName: string;
    productShortDescription: string;
    productDescription: string;
  },
  previous?: Partial<
    Pick<typeof data, "productName" | "productShortDescription" | "productDescription">
  > | null
) {
  await translateAndSaveProductWithExcellences(
    { ...data, excellences: [] },
    previous ?? null
  );
}

// ---- Product Application ----
export async function translateAndSaveProductApplication(
  data: {
    productApplicationId: string;
    productApplicationName: string;
    productApplicationDescription: string;
  },
  previous?: Partial<
    Pick<typeof data, "productApplicationName" | "productApplicationDescription">
  > | null
) {
  if (
    translatableTextsUnchanged(
      previous as Record<string, unknown> | null,
      data as Record<string, unknown>,
      ["productApplicationName", "productApplicationDescription"]
    )
  ) {
    return;
  }

  const result = await translateFields(
    {
      productApplicationName: data.productApplicationName,
      productApplicationDescription: data.productApplicationDescription,
    },
    "product application area"
  );

  for (const locale of ALL_STORED_LOCALES) {
    const t = result[locale];
    await db
      .insert(productApplicationTranslations)
      .values({
        productApplicationId: data.productApplicationId,
        locale,
        productApplicationName: str(t.productApplicationName),
        productApplicationDescription: str(t.productApplicationDescription),
      })
      .onConflictDoUpdate({
        target: [
          productApplicationTranslations.productApplicationId,
          productApplicationTranslations.locale,
        ],
        set: {
          productApplicationName: str(t.productApplicationName),
          productApplicationDescription: str(t.productApplicationDescription),
        },
      });
  }
}

// ---- Product Exellence ----
export async function translateAndSaveProductExellence(
  data: {
    productExellenceId: string;
    productExellenceDescription: string;
  },
  previous?: Partial<Pick<typeof data, "productExellenceDescription">> | null
) {
  if (
    translatableTextsUnchanged(
      previous as Record<string, unknown> | null,
      data as Record<string, unknown>,
      ["productExellenceDescription"]
    )
  ) {
    return;
  }

  const result = await translateFields(
    { productExellenceDescription: data.productExellenceDescription },
    "product excellence/advantage point"
  );

  for (const locale of ALL_STORED_LOCALES) {
    const t = result[locale];
    await db
      .insert(productExellenceTranslations)
      .values({
        productExellenceId: data.productExellenceId,
        locale,
        productExellenceDescription: str(t.productExellenceDescription),
      })
      .onConflictDoUpdate({
        target: [
          productExellenceTranslations.productExellenceId,
          productExellenceTranslations.locale,
        ],
        set: { productExellenceDescription: str(t.productExellenceDescription) },
      });
  }
}

// ---- Service ----
export async function translateAndSaveService(
  data: {
    serviceId: string;
    serviceName: string;
    serviceDescription: string;
    servicePoints: unknown;
    serviceBtnText: string;
  },
  previous?: Partial<
    Pick<
      typeof data,
      "serviceName" | "serviceDescription" | "servicePoints" | "serviceBtnText"
    >
  > | null
) {
  if (
    previous &&
    translatableTextsUnchanged(
      previous as Record<string, unknown>,
      data as Record<string, unknown>,
      ["serviceName", "serviceDescription", "serviceBtnText"]
    ) &&
    jsonFieldUnchanged(
      previous as Record<string, unknown>,
      data as Record<string, unknown>,
      "servicePoints"
    )
  ) {
    return;
  }

  const points = Array.isArray(data.servicePoints)
    ? data.servicePoints.map(String)
    : [];

  const result = await translateFields(
    {
      serviceName: data.serviceName,
      serviceDescription: data.serviceDescription,
      servicePoints: points,
      serviceBtnText: data.serviceBtnText,
    },
    "service offering"
  );

  for (const locale of ALL_STORED_LOCALES) {
    const t = result[locale];
    await db
      .insert(serviceTranslations)
      .values({
        serviceId: data.serviceId,
        locale,
        serviceName: str(t.serviceName),
        serviceDescription: str(t.serviceDescription),
        servicePoints: Array.isArray(t.servicePoints) ? t.servicePoints : points,
        serviceBtnText: str(t.serviceBtnText),
      })
      .onConflictDoUpdate({
        target: [serviceTranslations.serviceId, serviceTranslations.locale],
        set: {
          serviceName: str(t.serviceName),
          serviceDescription: str(t.serviceDescription),
          servicePoints: Array.isArray(t.servicePoints) ? t.servicePoints : points,
          serviceBtnText: str(t.serviceBtnText),
        },
      });
  }
}

// ---- Certification ----
export async function translateAndSaveCertification(
  data: {
    certificationId: string;
    name: string;
  },
  previous?: Partial<Pick<typeof data, "name">> | null
) {
  if (
    translatableTextsUnchanged(
      previous as Record<string, unknown> | null,
      data as Record<string, unknown>,
      ["name"]
    )
  ) {
    return;
  }

  const result = await translateFields(
    { name: data.name },
    "certification/accreditation name"
  );

  for (const locale of ALL_STORED_LOCALES) {
    const t = result[locale];
    await db
      .insert(certificationTranslations)
      .values({
        certificationId: data.certificationId,
        locale,
        name: str(t.name),
      })
      .onConflictDoUpdate({
        target: [certificationTranslations.certificationId, certificationTranslations.locale],
        set: { name: str(t.name) },
      });
  }
}

// ---- Glass Types ----
export async function translateAndSaveGlassType(
  data: {
    glassTypeId: string;
    glassTypeName: string;
  },
  previous?: Partial<Pick<typeof data, "glassTypeName">> | null
) {
  if (
    translatableTextsUnchanged(
      previous as Record<string, unknown> | null,
      data as Record<string, unknown>,
      ["glassTypeName"]
    )
  ) {
    return;
  }

  const result = await translateFields(
    { glassTypeName: data.glassTypeName },
    "glass type name"
  );

  for (const locale of ALL_STORED_LOCALES) {
    const t = result[locale];
    await db
      .insert(glassTypesTranslations)
      .values({
        glassTypeId: data.glassTypeId,
        locale,
        glassTypeName: str(t.glassTypeName),
      })
      .onConflictDoUpdate({
        target: [glassTypesTranslations.glassTypeId, glassTypesTranslations.locale],
        set: { glassTypeName: str(t.glassTypeName) },
      });
  }
}

// ---- Glass Prices ----
export async function translateAndSaveGlassPrice(
  data: {
    glassPricesId: string;
    variant: string;
  },
  previous?: Partial<Pick<typeof data, "variant">> | null
) {
  if (
    translatableTextsUnchanged(
      previous as Record<string, unknown> | null,
      data as Record<string, unknown>,
      ["variant"]
    )
  ) {
    return;
  }

  const result = await translateFields(
    { variant: data.variant },
    "glass variant name"
  );

  for (const locale of ALL_STORED_LOCALES) {
    const t = result[locale];
    await db
      .insert(glassPricesTranslations)
      .values({
        glassPricesId: data.glassPricesId,
        locale,
        variant: str(t.variant),
      })
      .onConflictDoUpdate({
        target: [glassPricesTranslations.glassPricesId, glassPricesTranslations.locale],
        set: { variant: str(t.variant) },
      });
  }
}

// ---- Processing Categories ----
export async function translateAndSaveProcessingCategory(
  data: {
    processingCategoryId: string;
    categoryName: string;
  },
  previous?: Partial<Pick<typeof data, "categoryName">> | null
) {
  if (
    translatableTextsUnchanged(
      previous as Record<string, unknown> | null,
      data as Record<string, unknown>,
      ["categoryName"]
    )
  ) {
    return;
  }

  const result = await translateFields(
    { categoryName: data.categoryName },
    "glass processing category name"
  );

  for (const locale of ALL_STORED_LOCALES) {
    const t = result[locale];
    await db
      .insert(processingCategoriesTranslations)
      .values({
        processingCategoryId: data.processingCategoryId,
        locale,
        categoryName: str(t.categoryName),
      })
      .onConflictDoUpdate({
        target: [
          processingCategoriesTranslations.processingCategoryId,
          processingCategoriesTranslations.locale,
        ],
        set: { categoryName: str(t.categoryName) },
      });
  }
}

// ---- Processing Prices ----
export async function translateAndSaveProcessingPrice(
  data: {
    processingPricesId: string;
    serviceName: string;
  },
  previous?: Partial<Pick<typeof data, "serviceName">> | null
) {
  if (
    translatableTextsUnchanged(
      previous as Record<string, unknown> | null,
      data as Record<string, unknown>,
      ["serviceName"]
    )
  ) {
    return;
  }

  const result = await translateFields(
    { serviceName: data.serviceName },
    "glass processing service name"
  );

  for (const locale of ALL_STORED_LOCALES) {
    const t = result[locale];
    await db
      .insert(processingPricesTranslations)
      .values({
        processingPricesId: data.processingPricesId,
        locale,
        serviceName: str(t.serviceName),
      })
      .onConflictDoUpdate({
        target: [
          processingPricesTranslations.processingPricesId,
          processingPricesTranslations.locale,
        ],
        set: { serviceName: str(t.serviceName) },
      });
  }
}

// ---- Social Media ----
export async function translateAndSaveSocialMedia(
  data: {
    socialMediaId: string;
    platformName: string;
  },
  previous?: Partial<Pick<typeof data, "platformName">> | null
) {
  if (
    translatableTextsUnchanged(
      previous as Record<string, unknown> | null,
      data as Record<string, unknown>,
      ["platformName"]
    )
  ) {
    return;
  }

  const result = await translateFields(
    { platformName: data.platformName },
    "social media platform name"
  );

  for (const locale of ALL_STORED_LOCALES) {
    const t = result[locale];
    await db
      .insert(socialMediaTranslations)
      .values({
        socialMediaId: data.socialMediaId,
        locale,
        platformName: str(t.platformName),
      })
      .onConflictDoUpdate({
        target: [socialMediaTranslations.socialMediaId, socialMediaTranslations.locale],
        set: { platformName: str(t.platformName) },
      });
  }
}

// ---- Thickness ----
export async function translateAndSaveThickness(
  data: {
    thicknessId: string;
    thicknessUnit: string;
  },
  previous?: Partial<Pick<typeof data, "thicknessUnit">> | null
) {
  if (
    translatableTextsUnchanged(
      previous as Record<string, unknown> | null,
      data as Record<string, unknown>,
      ["thicknessUnit"]
    )
  ) {
    return;
  }

  const result = await translateFields(
    { thicknessUnit: data.thicknessUnit },
    "thickness unit of measurement"
  );

  for (const locale of ALL_STORED_LOCALES) {
    const t = result[locale];
    await db
      .insert(thicknessTranslations)
      .values({
        thicknessId: data.thicknessId,
        locale,
        thicknessUnit: str(t.thicknessUnit),
      })
      .onConflictDoUpdate({
        target: [thicknessTranslations.thicknessId, thicknessTranslations.locale],
        set: { thicknessUnit: str(t.thicknessUnit) },
      });
  }
}
