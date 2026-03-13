"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ProductFilterToolbar } from "./product-filter-toolbar";
import type {
  CategoryOption,
  ThicknessOption,
  PortofolioTypeOption,
} from "./product-filter-toolbar";

gsap.registerPlugin(ScrollTrigger);

export type ProductFilterSectionProps = {
  search: string;
  categoryId: string;
  thicknessId: string;
  portofolioTypeId: string;
  onSearchChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onThicknessChange: (v: string) => void;
  onPortofolioTypeChange: (v: string) => void;
  categories: CategoryOption[];
  thicknesses: ThicknessOption[];
  portofolioTypes: PortofolioTypeOption[];
};

export function ProductFilterSection({
  search,
  categoryId,
  thicknessId,
  portofolioTypeId,
  onSearchChange,
  onCategoryChange,
  onThicknessChange,
  onPortofolioTypeChange,
  categories,
  thicknesses,
  portofolioTypes,
}: ProductFilterSectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      if (sectionRef.current) {
        gsap.fromTo(
          sectionRef.current,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white py-6 sm:py-8 shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProductFilterToolbar
          search={search}
          categoryId={categoryId}
          thicknessId={thicknessId}
          portofolioTypeId={portofolioTypeId}
          onSearchChange={onSearchChange}
          onCategoryChange={onCategoryChange}
          onThicknessChange={onThicknessChange}
          onPortofolioTypeChange={onPortofolioTypeChange}
          categories={categories}
          thicknesses={thicknesses}
          portofolioTypes={portofolioTypes}
        />
      </div>
    </section>
  );
}
