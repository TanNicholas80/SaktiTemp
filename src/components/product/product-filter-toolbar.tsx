"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type CategoryOption = {
  categoryProductId: string;
  categoryProductName: string;
  categoryProductSlug: string;
};

export type ThicknessOption = {
  thicknessId: string;
  thicknessValue: number;
  thicknessUnit: string;
};

export type PortofolioTypeOption = {
  portofolioTypeId: string;
  portofolioTypeName: string;
  portofolioTypeSlug: string;
};

export type ProductFilterState = {
  search: string;
  categoryId: string;
  thicknessId: string;
  portofolioTypeId: string;
};

type ProductFilterToolbarProps = {
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
  className?: string;
};

export function ProductFilterToolbar({
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
  className,
}: ProductFilterToolbarProps) {
  const t = useTranslations("productSection");

  return (
    <div
      className={cn(
        "flex flex-col gap-3 w-full min-w-0",
        "lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-4",
        className
      )}
    >
      {/* Search */}
      <div className="relative w-full min-w-0 shrink-0 lg:max-w-sm">
        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-12 w-full rounded-xl border-0 bg-neutral-100 pl-11 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/20 lg:h-14"
          aria-label={t("searchPlaceholder")}
        />
      </div>

      {/* Filters */}
      <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:w-auto lg:grid-cols-none lg:flex-wrap">
        <Select value={categoryId} onValueChange={onCategoryChange}>
          <SelectTrigger
            className="h-12 w-full min-h-12 rounded-xl border-0 bg-neutral-100 text-base text-foreground shadow-none hover:bg-neutral-200/80 focus:ring-2 focus:ring-primary/20 [&>svg]:size-4 lg:w-[200px]"
            aria-label={t("filterCategory")}
          >
            <SelectValue placeholder={t("filterCategory")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filterAll")}</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.categoryProductId} value={c.categoryProductId}>
                {c.categoryProductName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={thicknessId} onValueChange={onThicknessChange}>
          <SelectTrigger
            className="h-12 min-h-12 w-full rounded-xl border-0 bg-neutral-100 text-base text-foreground shadow-none hover:bg-neutral-200/80 focus:ring-2 focus:ring-primary/20 [&>svg]:size-4 lg:w-[200px]"
            aria-label={t("filterThickness")}
          >
            <SelectValue placeholder={t("filterThickness")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filterAllThickness")}</SelectItem>
            {thicknesses.map((th) => (
              <SelectItem key={th.thicknessId} value={th.thicknessId}>
                {th.thicknessValue} {th.thicknessUnit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={portofolioTypeId} onValueChange={onPortofolioTypeChange}>
          <SelectTrigger
            className="h-12 min-h-12 w-full rounded-xl border-0 bg-neutral-100 text-base text-foreground shadow-none hover:bg-neutral-200/80 focus:ring-2 focus:ring-primary/20 [&>svg]:size-4 lg:w-[200px]"
            aria-label={t("filterUsage")}
          >
            <SelectValue placeholder={t("filterUsage")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filterAllUsage")}</SelectItem>
            {portofolioTypes.map((pt) => (
              <SelectItem key={pt.portofolioTypeId} value={pt.portofolioTypeId}>
                {pt.portofolioTypeName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
