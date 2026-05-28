import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as blogSchema from "./schema/blog";
import * as carouselSchema from "./schema/carousel";
import * as categoryBlogSchema from "./schema/category-blog";
import * as categoryPortofolioSchema from "./schema/category-portofolio";
import * as categoryProductSchema from "./schema/category-product";
import * as locationSchema from "./schema/location";
import * as portofolioSchema from "./schema/portofolio";
import * as portofolioTypeSchema from "./schema/portofolio-type";
import * as productSchema from "./schema/product";
import * as productExellenceSchema from "./schema/product-exellence";
import * as thicknessSchema from "./schema/thickness";
import * as productThicknessSchema from "./schema/product-thickness";
import * as benefitSchema from "./schema/benefit";
import * as serviceSchema from "./schema/service";
import * as authSchema from "./schema/auth";
import * as socialMediaSchema from "./schema/social-media";
import * as certificationSchema from "./schema/certification";
import * as companyStatSchema from "./schema/company-stat";
import * as contactSchema from "./schema/contact";
import * as heroSectionSchema from "./schema/hero-section";
import * as productApplicationSchema from "./schema/product-application";
import * as productApplicationPortofolioSchema from "./schema/product-application-portofolio";
import * as contentCacheSchema from "./schema/content-cache";
import * as glassTypesSchema from "./schema/glass_types";
import * as glassPricesSchema from "./schema/glass_prices";

import * as benefitTranslationsSchema from "./schema/benefit-translations";
import * as blogTranslationsSchema from "./schema/blog-translations";
import * as carouselTranslationsSchema from "./schema/carousel-translations";
import * as categoryBlogTranslationsSchema from "./schema/category-blog-translations";
import * as categoryPortofolioTranslationsSchema from "./schema/category-portofolio-translations";
import * as categoryProductTranslationsSchema from "./schema/category-product-translations";
import * as companyStatTranslationsSchema from "./schema/company-stat-translations";
import * as contactTranslationsSchema from "./schema/contact-translations";
import * as heroSectionTranslationsSchema from "./schema/hero-section-translations";
import * as locationTranslationsSchema from "./schema/location-translations";
import * as portofolioTranslationsSchema from "./schema/portofolio-translations";
import * as portofolioTypeTranslationsSchema from "./schema/portofolio-type-translations";
import * as productTranslationsSchema from "./schema/product-translations";
import * as productApplicationTranslationsSchema from "./schema/product-application-translations";
import * as productExellenceTranslationsSchema from "./schema/product-exellence-translations";
import * as serviceTranslationsSchema from "./schema/service-translations";
import * as certificationTranslationsSchema from "./schema/certification-translations";
import * as glassTypesTranslationsSchema from "./schema/glass-types-translations";
import * as glassPricesTranslationsSchema from "./schema/glass-prices-translations";
import * as socialMediaTranslationsSchema from "./schema/social-media-translations";
import * as thicknessTranslationsSchema from "./schema/thickness-translations";

const schema = {
  ...blogSchema,
  ...carouselSchema,
  ...categoryBlogSchema,
  ...categoryPortofolioSchema,
  ...categoryProductSchema,
  ...locationSchema,
  ...portofolioSchema,
  ...portofolioTypeSchema,
  ...productSchema,
  ...productExellenceSchema,
  ...thicknessSchema,
  ...productThicknessSchema,
  ...benefitSchema,
  ...serviceSchema,
  ...authSchema,
  ...socialMediaSchema,
  ...certificationSchema,
  ...companyStatSchema,
  ...contactSchema,
  ...heroSectionSchema,
  ...productApplicationSchema,
  ...productApplicationPortofolioSchema,
  ...contentCacheSchema,
  ...glassTypesSchema,
  ...glassPricesSchema,

  ...benefitTranslationsSchema,
  ...blogTranslationsSchema,
  ...carouselTranslationsSchema,
  ...categoryBlogTranslationsSchema,
  ...categoryPortofolioTranslationsSchema,
  ...categoryProductTranslationsSchema,
  ...companyStatTranslationsSchema,
  ...contactTranslationsSchema,
  ...heroSectionTranslationsSchema,
  ...locationTranslationsSchema,
  ...portofolioTranslationsSchema,
  ...portofolioTypeTranslationsSchema,
  ...productTranslationsSchema,
  ...productApplicationTranslationsSchema,
  ...productExellenceTranslationsSchema,
  ...serviceTranslationsSchema,
  ...certificationTranslationsSchema,
  ...glassTypesTranslationsSchema,
  ...glassPricesTranslationsSchema,
  ...socialMediaTranslationsSchema,
  ...thicknessTranslationsSchema,
};

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
export const db = drizzle({ client: pool, schema });
