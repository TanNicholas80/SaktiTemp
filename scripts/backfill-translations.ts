/**
 * One-time script to backfill translations for all existing content.
 * Run with: npx tsx scripts/backfill-translations.ts
 */

import "dotenv/config";
import { asc } from "drizzle-orm";

import { db } from "../src/db";
import { benefit } from "../src/db/schema/benefit";
import { blog } from "../src/db/schema/blog";
import { carousel } from "../src/db/schema/carousel";
import { categoryBlog } from "../src/db/schema/category-blog";
import { categoryPortofolio } from "../src/db/schema/category-portofolio";
import { categoryProduct } from "../src/db/schema/category-product";
import { companyStat } from "../src/db/schema/company-stat";
import { contact } from "../src/db/schema/contact";
import { heroSection } from "../src/db/schema/hero-section";
import { location } from "../src/db/schema/location";
import { portofolio } from "../src/db/schema/portofolio";
import { portofolioType } from "../src/db/schema/portofolio-type";
import { product } from "../src/db/schema/product";
import { productApplication } from "../src/db/schema/product-application";
import { productExellence } from "../src/db/schema/product-exellence";
import { service } from "../src/db/schema/service";
import { certification } from "../src/db/schema/certification";
import { glassTypes } from "../src/db/schema/glass_types";
import { glassPrices } from "../src/db/schema/glass_prices";
import { socialMedia } from "../src/db/schema/social-media";
import { thickness } from "../src/db/schema/thickness";

import {
  translateAndSaveBenefit,
  translateAndSaveBlog,
  translateAndSaveCarousel,
  translateAndSaveCategoryBlog,
  translateAndSaveCategoryPortofolio,
  translateAndSaveCategoryProduct,
  translateAndSaveCompanyStat,
  translateAndSaveContact,
  translateAndSaveHeroSection,
  translateAndSaveLocation,
  translateAndSavePortofolio,
  translateAndSavePortofolioType,
  translateAndSaveProductWithExcellences,
  translateAndSaveProductApplication,
  translateAndSaveService,
  translateAndSaveCertification,
  translateAndSaveGlassType,
  translateAndSaveGlassPrice,
  translateAndSaveSocialMedia,
  translateAndSaveThickness,
} from "../src/lib/translate/entity-translators";

import { pool } from "../src/db";

async function translateEntity<T>(
  entityName: string,
  items: T[],
  translateFn: (item: T) => Promise<void>
) {
  console.log(`\n--- ${entityName}: ${items.length} items ---`);
  let success = 0;
  let failed = 0;
  for (const item of items) {
    try {
      await translateFn(item);
      success++;
      process.stdout.write(`  [${success + failed}/${items.length}] OK\r`);
    } catch (err) {
      failed++;
      console.error(`  Failed:`, err instanceof Error ? err.message : err);
    }
  }
  console.log(`  Done: ${success} ok, ${failed} failed`);
}

async function main() {
  console.log("=== Backfill Translations ===\n");

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set. Exiting.");
    process.exit(1);
  }

  const benefits = await db.select().from(benefit);
  await translateEntity("Benefits", benefits, (b) =>
    translateAndSaveBenefit({ benefitId: b.benefitId, benefitName: b.benefitName, benefitDescription: b.benefitDescription })
  );

  const blogs = await db.select().from(blog);
  await translateEntity("Blogs", blogs, (b) =>
    translateAndSaveBlog({ blogId: b.blogId, blogTitle: b.blogTitle, blogExcerpt: b.blogExcerpt, blogContent: b.blogContent })
  );

  const carousels = await db.select().from(carousel);
  await translateEntity("Carousels", carousels, (c) =>
    translateAndSaveCarousel({
      carouselId: c.carouselId,
      carouselHeading: c.carouselHeading,
      carouselSubheading: c.carouselSubheading,
      carouselDescription: c.carouselDescription,
    })
  );

  const catBlogs = await db.select().from(categoryBlog);
  await translateEntity("Category Blogs", catBlogs, (c) =>
    translateAndSaveCategoryBlog({ categoryBlogId: c.categoryBlogId, categoryBlogName: c.categoryBlogName })
  );

  const catPortofolios = await db.select().from(categoryPortofolio);
  await translateEntity("Category Portofolios", catPortofolios, (c) =>
    translateAndSaveCategoryPortofolio({
      categoryPortofolioId: c.categoryPortofolioId,
      categoryPortofolioName: c.categoryPortofolioName,
      categoryPortofolioDescription: c.categoryPortofolioDescription,
    })
  );

  const catProducts = await db.select().from(categoryProduct);
  await translateEntity("Category Products", catProducts, (c) =>
    translateAndSaveCategoryProduct({ categoryProductId: c.categoryProductId, categoryProductName: c.categoryProductName })
  );

  const stats = await db.select().from(companyStat);
  await translateEntity("Company Stats", stats, (s) =>
    translateAndSaveCompanyStat({ companyStatId: s.companyStatId, label: s.label })
  );

  const contacts = await db.select().from(contact);
  await translateEntity("Contacts", contacts, (c) =>
    translateAndSaveContact({
      contactId: c.contactId,
      contactLabel: c.contactLabel,
      contactValue: c.contactValue,
      contactValueExtra: c.contactValueExtra,
    })
  );

  const heros = await db.select().from(heroSection);
  await translateEntity("Hero Sections", heros, (h) =>
    translateAndSaveHeroSection({
      heroSectionId: h.heroSectionId,
      preHeading: h.preHeading,
      mainHeading: h.mainHeading,
      subHeading: h.subHeading,
      description: h.description,
      scrollIndicatorText: h.scrollIndicatorText,
      breadcrumbItems: h.breadcrumbItems,
    })
  );

  const locations = await db.select().from(location);
  await translateEntity("Locations", locations, (l) =>
    translateAndSaveLocation({ locationId: l.locationId, locationCity: l.locationCity, locationAddress: l.locationAddress })
  );

  const portofolios = await db.select().from(portofolio);
  await translateEntity("Portofolios", portofolios, (p) =>
    translateAndSavePortofolio({
      portofolioId: p.portofolioId,
      portofolioName: p.portofolioName,
      portofolioShortDescription: p.portofolioShortDescription,
      portofolioAbout: p.portofolioAbout,
      portofolioLocation: p.portofolioLocation,
    })
  );

  const portofolioTypes = await db.select().from(portofolioType);
  await translateEntity("Portofolio Types", portofolioTypes, (pt) =>
    translateAndSavePortofolioType({ portofolioTypeId: pt.portofolioTypeId, portofolioTypeName: pt.portofolioTypeName })
  );

  const products = await db.select().from(product);
  const allExcellences = await db
    .select()
    .from(productExellence)
    .orderBy(asc(productExellence.productId), asc(productExellence.createdAt));
  const excellencesByProductId = new Map<
    string,
    { productExellenceId: string; productExellenceDescription: string }[]
  >();
  for (const e of allExcellences) {
    if (!e.productId) continue;
    const list = excellencesByProductId.get(e.productId) ?? [];
    list.push({
      productExellenceId: e.productExellenceId,
      productExellenceDescription: e.productExellenceDescription,
    });
    excellencesByProductId.set(e.productId, list);
  }

  await translateEntity("Products", products, (p) =>
    translateAndSaveProductWithExcellences({
      productId: p.productId,
      productName: p.productName,
      productShortDescription: p.productShortDescription,
      productDescription: p.productDescription,
      excellences: excellencesByProductId.get(p.productId) ?? [],
    })
  );

  const productApps = await db.select().from(productApplication);
  await translateEntity("Product Applications", productApps, (pa) =>
    translateAndSaveProductApplication({
      productApplicationId: pa.productApplicationId,
      productApplicationName: pa.productApplicationName,
      productApplicationDescription: pa.productApplicationDescription,
    })
  );

  const services = await db.select().from(service);
  await translateEntity("Services", services, (s) =>
    translateAndSaveService({
      serviceId: s.serviceId,
      serviceName: s.serviceName,
      serviceDescription: s.serviceDescription,
      servicePoints: s.servicePoints,
      serviceBtnText: s.serviceBtnText,
    })
  );

  const certs = await db.select().from(certification);
  await translateEntity("Certifications", certs, (c) =>
    translateAndSaveCertification({ certificationId: c.certificationId, name: c.name })
  );

  const glassTypeRows = await db.select().from(glassTypes);
  await translateEntity("Glass Types", glassTypeRows, (g) =>
    translateAndSaveGlassType({ glassTypeId: g.glassTypeId, glassTypeName: g.glassTypeName })
  );

  const glassPriceRows = await db.select().from(glassPrices);
  await translateEntity("Glass Prices", glassPriceRows, (g) =>
    translateAndSaveGlassPrice({ glassPricesId: g.glassPricesId, variant: g.variant })
  );

  const socials = await db.select().from(socialMedia);
  await translateEntity("Social Media", socials, (s) =>
    translateAndSaveSocialMedia({ socialMediaId: s.socialMediaId, platformName: s.platformName })
  );

  const thicknesses = await db.select().from(thickness);
  await translateEntity("Thicknesses", thicknesses, (t) =>
    translateAndSaveThickness({ thicknessId: t.thicknessId, thicknessUnit: t.thicknessUnit })
  );

  console.log("\n=== Backfill Complete ===");
  await pool.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
