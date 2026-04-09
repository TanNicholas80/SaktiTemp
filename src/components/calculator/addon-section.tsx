"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Trash2, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type {
  ProcessingCategory,
  ProcessingPrice,
  AddOnItem,
} from "./types";

type Props = {
  processingCategories: ProcessingCategory[];
  processingPrices: ProcessingPrice[];
  items: AddOnItem[];
  onChange: (items: AddOnItem[]) => void;
  defaultOpen?: boolean;
};

function createEmptyAddon(): AddOnItem {
  return {
    id: crypto.randomUUID(),
    categoryId: null,
    serviceName: null,
    thicknessValue: "",
    quantity: "",
  };
}

function getUnitLabel(unit: ProcessingPrice["unit"], t: ReturnType<typeof useTranslations>) {
  switch (unit) {
    case "m1":
      return t("unitMeter");
    case "pcs":
      return t("unitPcs");
    case "sqm":
      return t("unitSqm");
    default:
      return null;
  }
}

function matchProcessingPrice(
  prices: ProcessingPrice[],
  categoryId: string,
  serviceName: string,
  thicknessVal: number
): ProcessingPrice | undefined {
  return prices.find((p) => {
    if (p.categoryId !== categoryId || p.serviceName !== serviceName) return false;
    if (p.thickness !== null) {
      return p.thickness === thicknessVal;
    }
    if (p.minThickness !== null && p.maxThickness !== null) {
      return thicknessVal >= p.minThickness && thicknessVal <= p.maxThickness;
    }
    return false;
  });
}

type AddonTabProps = {
  index: number;
  item: AddOnItem;
  processingCategories: ProcessingCategory[];
  processingPrices: ProcessingPrice[];
  onChange: (item: AddOnItem) => void;
  onRemove: () => void;
  canRemove: boolean;
  t: ReturnType<typeof useTranslations>;
};

function AddonTab({
  index,
  item,
  processingCategories,
  processingPrices,
  onChange,
  onRemove,
  canRemove,
  t,
}: AddonTabProps) {
  // Service names for selected category
  const serviceNames = React.useMemo(() => {
    if (!item.categoryId) return [];
    const seen = new Set<string>();
    const names: string[] = [];
    for (const p of processingPrices) {
      if (p.categoryId === item.categoryId && !seen.has(p.serviceName)) {
        seen.add(p.serviceName);
        names.push(p.serviceName);
      }
    }
    return names.sort();
  }, [item.categoryId, processingPrices]);

  // Current matched price based on category + service + thickness
  const matchedPrice = React.useMemo(() => {
    if (!item.categoryId || !item.serviceName || !item.thicknessValue) return undefined;
    const tv = parseFloat(item.thicknessValue);
    if (isNaN(tv)) return undefined;
    return matchProcessingPrice(
      processingPrices,
      item.categoryId,
      item.serviceName,
      tv
    );
  }, [item.categoryId, item.serviceName, item.thicknessValue, processingPrices]);

  const unitLabel = matchedPrice ? getUnitLabel(matchedPrice.unit, t) : null;
  const isNoneUnit = matchedPrice?.unit === "none";
  const isSqmUnit = matchedPrice?.unit === "sqm";
  const thicknessNum = parseFloat(item.thicknessValue);
  const hasUnavailableThicknessWarning =
    !!item.categoryId &&
    !!item.serviceName &&
    item.thicknessValue.trim() !== "" &&
    !Number.isNaN(thicknessNum) &&
    !matchedPrice;

  const selectedCategory = processingCategories.find(
    (c) => c.processingCategoryId === item.categoryId
  );

  function handleCategorySelect(categoryId: string) {
    onChange({ ...item, categoryId, serviceName: null, thicknessValue: "", quantity: "" });
  }

  function handleServiceChange(serviceName: string) {
    onChange({ ...item, serviceName, thicknessValue: "", quantity: "" });
  }

  return (
    <div className="rounded-lg border border-border bg-background p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          {t("addOnItemLabel", { index: index + 1 })}
          {selectedCategory && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              — {selectedCategory.categoryName}
              {item.serviceName && ` (${item.serviceName})`}
            </span>
          )}
        </span>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="size-3.5" />
          </Button>
        )}
      </div>

      {/* Kategori Add-On */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {t("categoryLabel")}
        </Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {processingCategories.map((cat) => (
            <button
              key={cat.processingCategoryId}
              type="button"
              onClick={() => handleCategorySelect(cat.processingCategoryId)}
              className={cn(
                "flex flex-col items-center rounded-lg border p-2 text-center transition-all",
                "hover:border-primary/60 hover:shadow-sm",
                item.categoryId === cat.processingCategoryId
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-background"
              )}
            >
              <div className="relative mb-1.5 aspect-[4/3] w-full overflow-hidden rounded-md bg-muted">
                {cat.categoryImageUrl ? (
                  <Image
                    src={cat.categoryImageUrl}
                    alt={cat.categoryName}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
              </div>
              <span className="text-xs font-medium leading-tight text-foreground line-clamp-2">
                {cat.categoryName}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tipe Pengerjaan */}
      {item.categoryId && serviceNames.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("serviceTypeLabel")}
          </Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {serviceNames.map((sn) => (
              <button
                key={sn}
                type="button"
                onClick={() => handleServiceChange(sn)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs font-medium transition-all text-center",
                  "hover:border-primary/60 hover:shadow-sm",
                  item.serviceName === sn
                    ? "border-primary bg-primary/5 shadow-sm text-primary"
                    : "border-border bg-background text-foreground"
                )}
              >
                {sn}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ketebalan */}
      {item.serviceName && (
        <div className="space-y-1.5">
          <Label htmlFor={`addon-thickness-${item.id}`} className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("thicknessLabel")}
          </Label>
          <div className="flex items-center gap-1.5">
            <Input
              id={`addon-thickness-${item.id}`}
              type="number"
              min={1}
              step={0.5}
              placeholder={t("thicknessExample")}
              className={cn("w-28", hasUnavailableThicknessWarning && "border-destructive")}
              aria-invalid={hasUnavailableThicknessWarning}
              value={item.thicknessValue}
              onChange={(e) => onChange({ ...item, thicknessValue: e.target.value, quantity: "" })}
            />
            <span className="text-sm text-muted-foreground">{t("mmUnit")}</span>
            {matchedPrice && (
              <span className="ml-1 text-xs text-muted-foreground">
                Rp {matchedPrice.price.toLocaleString("id-ID")}
                {matchedPrice.unit !== "none" && ` / ${matchedPrice.unit}`}
              </span>
            )}
            {item.thicknessValue && !matchedPrice && (
              <span className="ml-1 text-xs text-destructive">
                {t("thicknessUnavailable")}
              </span>
            )}
          </div>
        </div>
      )}

      {hasUnavailableThicknessWarning && (
        <Alert variant="destructive" className="border-destructive/40 bg-destructive/5">
          <TriangleAlert />
          <AlertTitle>{t("thicknessUnavailableTitle")}</AlertTitle>
          <AlertDescription>
            {t("thicknessUnavailableDescription")}
          </AlertDescription>
        </Alert>
      )}

      {/* Quantity — only show if unit is m1 or pcs */}
      {matchedPrice && !isNoneUnit && !isSqmUnit && (
        <div className="space-y-1.5">
          <Label htmlFor={`addon-qty-${item.id}`} className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("quantityLabel", { unit: unitLabel ?? "-" })}
          </Label>
          <div className="flex items-center gap-1.5">
            <Input
              id={`addon-qty-${item.id}`}
              type="number"
              min={0}
              step={matchedPrice.unit === "m1" ? 0.1 : 1}
              placeholder="0"
              className="w-28"
              value={item.quantity}
              onChange={(e) => onChange({ ...item, quantity: e.target.value })}
            />
            <span className="text-sm text-muted-foreground">{unitLabel}</span>
          </div>
        </div>
      )}

      {/* SanBlast notice */}
      {isNoneUnit && matchedPrice && (
        <p className="text-xs text-muted-foreground rounded-md bg-muted px-3 py-2">
          {t("sandblastNotice")}
          <span className="ml-1 font-semibold text-foreground">
            Rp {matchedPrice.price.toLocaleString("id-ID")}
          </span>
        </p>
      )}

      {/* sqm info */}
      {isSqmUnit && matchedPrice && (
        <p className="text-xs text-muted-foreground rounded-md bg-muted px-3 py-2">
          {t("sqmNotice")}
          <span className="ml-1 font-semibold text-foreground">
            Rp {matchedPrice.price.toLocaleString("id-ID")} / m²
          </span>
        </p>
      )}
    </div>
  );
}

export function AddonSection({
  processingCategories,
  processingPrices,
  items,
  onChange,
  defaultOpen = false,
}: Props) {
  const t = useTranslations("calculatorSection.addOn");
  function handleItemChange(index: number, item: AddOnItem) {
    const next = [...items];
    next[index] = item;
    onChange(next);
  }

  function handleRemove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function handleAdd() {
    onChange([...items, createEmptyAddon()]);
  }

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? "addon" : undefined}
      className="w-full"
    >
      <AccordionItem
        value="addon"
        className="rounded-xl border border-border bg-card shadow-sm border-b-0"
      >
        <AccordionTrigger className="px-5 py-4 text-base font-bold text-primary hover:no-underline">
          <div className="flex items-center gap-2">
            <span>{t("title")}</span>
            {items.length > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {items.length}
              </span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 px-5 pb-6 text-[0.9375rem]">
            {items.map((item, idx) => (
              <AddonTab
                key={item.id}
                index={idx}
                item={item}
                processingCategories={processingCategories}
                processingPrices={processingPrices}
                t={t}
                onChange={(updated) => handleItemChange(idx, updated)}
                onRemove={() => handleRemove(idx)}
                canRemove={items.length > 1}
              />
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full gap-2 border-dashed border-primary/40 text-primary hover:bg-primary/5 hover:text-primary"
              onClick={handleAdd}
            >
              <Plus className="size-4" />
              {t("addButton")}
            </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
