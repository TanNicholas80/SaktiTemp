// Re-export DB-based translation helpers
export {
  applyCarouselTranslations,
  applyBenefitTranslations,
  applyCompanyStatTranslations,
  applyBlogTranslations,
  applyBlogDetailTranslations,
  applyBlogWithCategoryTranslations,
  applyCategoryBlogTranslations,
  applyCategoryPortofolioTranslations,
  applyCategoryProductTranslations,
  applyContactTranslations,
  applyLocationTranslations,
  applyHeroSectionTranslation,
  applyPortofolioTranslations,
  applyPortofolioCategoryNameTranslations,
  applyPortofolioDetailTranslations,
  applyPortofolioTypeTranslations,
  applyProductTranslations,
  applyProductApplicationTranslations,
  applyProductExellenceTranslations,
  applyServiceTranslations,
  applyCertificationTranslations,
  applyGlassTypesTranslations,
  applyGlassPricesTranslations,
  applySocialMediaTranslations,
  applyThicknessTranslations,
} from "./get-translated";

// Re-export entity translators (used by admin API routes)
export {
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
  translateAndSaveProduct,
  translateAndSaveProductWithExcellences,
  translateAndSaveProductApplication,
  translateAndSaveProductExellence,
  translateAndSaveService,
  translateAndSaveCertification,
  translateAndSaveGlassType,
  translateAndSaveGlassPrice,
  translateAndSaveSocialMedia,
  translateAndSaveThickness,
} from "./entity-translators";

// Backward-compatible type aliases used by components
export type BenefitInput = { benefitId: string; benefitName: string; benefitDescription: string; benefitIcon: string };
export type BenefitOutput = BenefitInput;

export type CompanyStatInput = { companyStatId: string; value: string; label: string; displayOrder: number };
export type CompanyStatOutput = CompanyStatInput;

export type BlogInput = {
  blogId: string; blogTitle: string; blogSlug: string; blogExcerpt: string;
  blogImageUrl: string; blogIsPublishedAt: string;
  categoryName: string | null; categorySlug: string | null;
};
export type BlogOutput = BlogInput;

export type BlogDetailInput = {
  blogId: string; blogTitle: string; blogSlug: string; blogExcerpt: string;
  blogContent: string; blogImageUrl: string; blogIsPublishedAt: string;
  categoryName: string | null; categorySlug: string | null;
};
export type BlogDetailOutput = BlogDetailInput;

export type CategoryBlogInput = { categoryBlogId: string; categoryBlogName: string };
export type CategoryBlogOutput = CategoryBlogInput;

export type CategoryProductInput = { categoryProductId: string; categoryProductName: string; categoryProductSlug: string };
export type CategoryProductOutput = CategoryProductInput;

export type CategoryPortofolioInput = {
  categoryPortofolioId: string;
  categoryPortofolioName: string;
  categoryPortofolioSlug: string;
  categoryPortofolioIcon: string;
  categoryPortofolioImage: string;
  categoryPortofolioDescription?: string;
};
export type CategoryPortofolioOutput = CategoryPortofolioInput;

export type ContactInput = {
  contactId: string; contactType: string; contactLabel: string;
  contactValue: string; contactValueExtra: string | null; contactIcon: string;
};
export type ContactOutput = ContactInput;

export type LocationInput = {
  locationId: string;
  locationCity: string;
  locationType: "branch" | "head";
  locationAddress: string;
  locationMapUrl: string;
  locationMapEmbedUrl: string;
};
export type LocationOutput = LocationInput;

/** Item breadcrumb hero (sesuai jsonb di DB). */
export type HeroBreadcrumbItem = { label: string; href: string };

export type HeroSectionInput = {
  heroSectionId: string;
  pageKey: string;
  preHeading: string | null;
  mainHeading: string;
  subHeading: string;
  description: string;
  backgroundImageUrl: string;
  backgroundImagePublicId?: string | null;
  breadcrumbItems?: HeroBreadcrumbItem[] | null;
  scrollIndicatorText: string | null;
  scrollIndicatorVisible: boolean;
  isPublished?: boolean;
};
export type HeroSectionOutput = HeroSectionInput;

export type PortofolioInput = {
  portofolioId: string; portofolioName: string; portofolioSlug: string;
  portofolioShortDescription: string; portofolioLocation: string;
  portofolioImageUrl: string; portofolioIsPublishedAt: string;
  categoryName: string | null; categorySlug: string | null;
  /** Untuk menerjemahkan label kategori lewat `category_portofolio_translations`. */
  categoryPortofolioId?: string | null;
};
export type PortofolioOutput = PortofolioInput;

export type PortofolioTypeInput = { portofolioTypeId: string; portofolioTypeName: string; portofolioTypeSlug: string };
export type PortofolioTypeOutput = PortofolioTypeInput;

export type ProductInput = {
  productId: string; productName: string; productShortDescription: string; productDescription: string;
};
export type ProductOutput = ProductInput;

export type ServiceInput = {
  serviceId: string;
  serviceName: string;
  serviceDescription: string;
  serviceIcon: string;
  serviceIsPublished: boolean;
  servicePoints: string[];
  serviceBtnText: string;
  serviceBtnLink: string;
};
export type ServiceOutput = ServiceInput;

export type CertificationInput = {
  certificationId: string;
  name: string;
  image: string;
  displayOrder: number;
};
export type CertificationOutput = CertificationInput;

export type CarouselSlideInput = {
  carouselId: string; carouselHeading: string; carouselSubheading: string;
  carouselDescription: string; carouselImageUrl: string; carouselOrder: number;
};
export type CarouselSlideOutput = CarouselSlideInput;
