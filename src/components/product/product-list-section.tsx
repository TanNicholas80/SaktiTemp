"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

import { ProductListCard } from "./product-list-card";
import type { ProductListCardData } from "./product-list-card";
import type { ThicknessOption } from "./product-filter-toolbar";

gsap.registerPlugin(ScrollTrigger);

export type ProductListSectionProps = {
  products: ProductListCardData[];
  thicknesses: ThicknessOption[];
  productPortofolioTypeIds: Record<string, string[]>;
  search: string;
  categoryId: string;
  thicknessId: string;
  portofolioTypeId: string;
};

export function ProductListSection({
  products,
  thicknesses,
  productPortofolioTypeIds,
  search,
  categoryId,
  thicknessId,
  portofolioTypeId,
}: ProductListSectionProps) {
  const t = useTranslations("productSection");
  const sectionRef = React.useRef<HTMLElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);

  const filtered = React.useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search.trim() ||
        p.productName.toLowerCase().includes(search.toLowerCase().trim()) ||
        (p.productShortDescription &&
          p.productShortDescription
            .toLowerCase()
            .includes(search.toLowerCase().trim()));
      const matchCategory =
        categoryId === "all" || p.categoryProductId === categoryId;
      const matchThickness =
        thicknessId === "all" ||
        p.thicknesses.some((t) => {
          const th = thicknesses.find((x) => x.thicknessId === thicknessId);
          return th && t.productThicknessValue === th.thicknessValue;
        });
      const matchPortofolioType =
        portofolioTypeId === "all" ||
        (productPortofolioTypeIds[p.productId] ?? []).includes(portofolioTypeId);

      return matchSearch && matchCategory && matchThickness && matchPortofolioType;
    });
  }, [
    products,
    search,
    categoryId,
    thicknessId,
    portofolioTypeId,
    thicknesses,
    productPortofolioTypeIds,
  ]);

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            delay: i * 0.06,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [filtered]);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-muted/50 py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-bold text-foreground sm:text-2xl">
          {filtered.length > 0
            ? t("displayingCount", { count: filtered.length })
            : t("recommendedTitle")}
        </h2>

        {filtered.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((product, i) => (
              <div
                key={product.productId}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
              >
                <ProductListCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-muted-foreground">
            {t("noProducts")}
          </p>
        )}
      </div>
    </section>
  );
}
