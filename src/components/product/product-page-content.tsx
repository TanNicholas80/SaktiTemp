"use client";

import * as React from "react";

import { ProductFilterSection } from "./product-filter-section";
import { ProductListSection } from "./product-list-section";
import type { ProductListCardData } from "./product-list-card";
import type {
  CategoryOption,
  ThicknessOption,
  PortofolioTypeOption,
} from "./product-filter-toolbar";

export type ProductPageContentProps = {
  products: ProductListCardData[];
  categories: CategoryOption[];
  thicknesses: ThicknessOption[];
  portofolioTypes: PortofolioTypeOption[];
  productPortofolioTypeIds: Record<string, string[]>;
};

export function ProductPageContent({
  products,
  categories,
  thicknesses,
  portofolioTypes,
  productPortofolioTypeIds,
}: ProductPageContentProps) {
  const [search, setSearch] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("all");
  const [thicknessId, setThicknessId] = React.useState("all");
  const [portofolioTypeId, setPortofolioTypeId] = React.useState("all");

  return (
    <>
      <ProductFilterSection
        search={search}
        categoryId={categoryId}
        thicknessId={thicknessId}
        portofolioTypeId={portofolioTypeId}
        onSearchChange={setSearch}
        onCategoryChange={setCategoryId}
        onThicknessChange={setThicknessId}
        onPortofolioTypeChange={setPortofolioTypeId}
        categories={categories}
        thicknesses={thicknesses}
        portofolioTypes={portofolioTypes}
      />
      <ProductListSection
        products={products}
        thicknesses={thicknesses}
        productPortofolioTypeIds={productPortofolioTypeIds}
        search={search}
        categoryId={categoryId}
        thicknessId={thicknessId}
        portofolioTypeId={portofolioTypeId}
      />
    </>
  );
}
