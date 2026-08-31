export type CategoryPortofolioOption = {
  categoryPortofolioId: string;
  categoryPortofolioName: string;
  categoryPortofolioSlug: string;
};

export type PortofolioTypeOption = {
  portofolioTypeId: string;
  portofolioTypeName: string;
  portofolioTypeSlug: string;
};

export type ProductOption = {
  productId: string;
  productName: string;
  productSlug: string;
  productDescription?: string;
  productImageUrl?: string;
  thicknesses?: { productThicknessValue: number; productThicknessUnit: string }[];
};

export type PortofolioCardData = {
  portofolioId: string;
  portofolioName: string;
  portofolioSlug: string;
  portofolioShortDescription?: string;
  portofolioLocation: string;
  portofolioImageUrl: string;
  portofolioIsPublishedAt: string;
  category: { name: string; slug: string } | null;
};

export type ProductApplicationOption = {
  productApplicationId: string;
  productApplicationName: string;
  productName: string | null;
};

/** Aplikasi kaca yang dipakai di portofolio (dari product-application + product) */
export type ProductApplication = {
  productApplicationId: string;
  productApplicationName: string;
  productApplicationDescription: string;
  productApplicationImageUrl: string;
  product: {
    productId: string;
    productName: string;
    productSlug: string;
    thicknesses: { productThicknessValue: number; productThicknessUnit: string }[];
  };
};

export type PortofolioDetailData = {
  portofolioId: string;
  portofolioName: string;
  portofolioSlug: string;
  portofolioShortDescription?: string;
  portofolioGalleryImages: { url: string; publicId: string }[];
  portofolioLocation: string;
  portofolioApplicators?: string[];
  portofolioImageUrl: string;
  portofolioIsPublishedAt: string;
  category: { name: string; slug: string } | null;
  productApplications: ProductApplication[];
};
