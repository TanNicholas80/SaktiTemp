export type CategoryProductOption = {
  categoryProductId: string;
  categoryProductName: string;
  categoryProductSlug: string;
};

export type ProductOption = {
  productId: string;
  productName: string;
  productSlug: string;
};

export type ThicknessItem = {
  productThicknessId?: string;
  productThicknessValue: number;
  productThicknessUnit: string;
};

export type ExcellenceItem = {
  productExellenceId?: string;
  productExellenceDescription: string;
};

export type PortofolioOption = {
  portofolioId: string;
  portofolioName: string;
  portofolioSlug: string;
  portofolioLocation: string;
  portofolioImageUrl: string;
};

export type ProductApplicationOption = {
  productApplicationId: string;
  productApplicationName: string;
};

export type PortofolioTypeOption = {
  portofolioTypeId: string;
  portofolioTypeName: string;
};

export type ProductCardData = {
  productId: string;
  productName: string;
  productSlug: string;
  productShortDescription?: string;
  productDescription: string;
  productImageUrl: string;
  productIsPublished: boolean;
  productIsPublishedAt: string;
  category: { name: string; slug: string } | null;
  thicknesses: { productThicknessValue: number; productThicknessUnit: string }[];
  excellences: { productExellenceDescription: string }[];
};

export type ProductDetailData = {
  productId: string;
  productName: string;
  productSlug: string;
  productDescription: string;
  productImageUrl: string;
  productIsPublished: boolean;
  productIsPublishedAt: string;
  category: { name: string; slug: string } | null;
  thicknesses: { productThicknessValue: number; productThicknessUnit: string }[];
  excellences: { productExellenceDescription: string }[];
  productApplications?: ProductApplicationOption[];
  portofolioTypes?: PortofolioTypeOption[];
  portofolios: PortofolioOption[];
};
