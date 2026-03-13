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
};

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
export const db = drizzle({ client: pool, schema });