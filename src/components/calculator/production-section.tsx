"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ProductionState } from "./types";

type Props = {
  state: ProductionState;
  onChange: (state: ProductionState) => void;
  defaultOpen?: boolean;
};

type RadioOption<T extends string> = {
  value: T;
  label: string;
  description: string;
};

function RadioGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: RadioOption<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">{label}</Label>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <Button
            key={opt.value}
            type="button"
            variant="outline"
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={cn(
              "flex cursor-pointer items-start gap-2.5 rounded-lg border px-3.5 py-2.5 transition-all",
              "h-auto whitespace-normal text-left hover:border-primary/60 hover:shadow-sm",
              value === opt.value
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-background"
            )}
          >
            <span
              className={cn(
                "mt-0.5 size-3.5 shrink-0 rounded-full border",
                value === opt.value ? "border-primary bg-primary" : "border-muted-foreground/40"
              )}
              aria-hidden
            />
            <div>
              <div className="text-sm font-medium text-foreground">{opt.label}</div>
              {opt.description && (
                <div className="text-xs text-muted-foreground">{opt.description}</div>
              )}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}

export function ProductionSection({ state, onChange, defaultOpen = false }: Props) {
  const t = useTranslations("calculatorSection.production");
  const CUTTING_OPTIONS: RadioOption<ProductionState["cuttingShape"]>[] = [
    { value: "regular", label: t("cutting.regularLabel"), description: t("cutting.regularDesc") },
    { value: "irregular", label: t("cutting.irregularLabel"), description: t("cutting.irregularDesc") },
  ];
  const PATTERN_OPTIONS: RadioOption<ProductionState["patternMethod"]>[] = [
    { value: "standard", label: t("pattern.standardLabel"), description: t("pattern.standardDesc") },
    { value: "custom", label: t("pattern.customLabel"), description: t("pattern.customDesc") },
  ];
  const SPEED_OPTIONS: RadioOption<ProductionState["productionSpeed"]>[] = [
    { value: "normal", label: t("speed.normalLabel"), description: t("speed.normalDesc") },
    { value: "express", label: t("speed.expressLabel"), description: t("speed.expressDesc") },
  ];
  const CITY_OPTIONS: RadioOption<ProductionState["departureCity"]>[] = [
    { value: "semarang", label: t("city.semarang"), description: "" },
    { value: "jakarta", label: t("city.jakarta"), description: "" },
  ];
  const distKm = parseFloat(state.distanceKm);
  const weightKg = parseFloat(state.weightKg);
  const shippingCost = !isNaN(distKm) && distKm > 0 ? distKm * 5000 : 0;
  const packingCost = !isNaN(weightKg) && weightKg > 0
    ? Math.floor(weightKg / 250) * 300_000 + (weightKg % 250) * 1_000
    : 0;

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? "production" : undefined}
      className="w-full"
    >
      <AccordionItem
        value="production"
        className="rounded-xl border border-border bg-card shadow-sm border-b-0"
      >
        <AccordionTrigger className="px-5 py-4 text-base font-bold text-primary hover:no-underline">
          {t("title")}
        </AccordionTrigger>
        <AccordionContent className="space-y-5 px-5 pb-6 text-[0.9375rem]">
            <RadioGroup
              label={t("cutting.title")}
              options={CUTTING_OPTIONS}
              value={state.cuttingShape}
              onChange={(v) => onChange({ ...state, cuttingShape: v })}
            />

            <RadioGroup
              label={t("pattern.title")}
              options={PATTERN_OPTIONS}
              value={state.patternMethod}
              onChange={(v) => onChange({ ...state, patternMethod: v })}
            />

            <RadioGroup
              label={t("speed.title")}
              options={SPEED_OPTIONS}
              value={state.productionSpeed}
              onChange={(v) => onChange({ ...state, productionSpeed: v })}
            />

            <RadioGroup
              label={t("city.title")}
              options={CITY_OPTIONS}
              value={state.departureCity}
              onChange={(v) => onChange({ ...state, departureCity: v })}
            />

            {/* Jarak */}
            <div className="space-y-1.5">
              <Label htmlFor="prod-distance" className="text-sm font-semibold">
                {t("distance.title")}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t("distance.hint")}
                {shippingCost > 0 && (
                  <span className="ml-2 font-semibold text-foreground">
                    = Rp {shippingCost.toLocaleString("id-ID")}
                  </span>
                )}
              </p>
              <div className="flex items-center gap-1.5">
                <Input
                  id="prod-distance"
                  type="number"
                  min={0}
                  placeholder="0"
                  className="w-32"
                  value={state.distanceKm}
                  onChange={(e) => onChange({ ...state, distanceKm: e.target.value })}
                />
                <span className="text-sm text-muted-foreground">{t("distance.unit")}</span>
              </div>
            </div>

            {/* Berat */}
            <div className="space-y-1.5">
              <Label htmlFor="prod-weight" className="text-sm font-semibold">
                {t("weight.title")}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t("weight.hint")}
                {packingCost > 0 && (
                  <span className="ml-2 font-semibold text-foreground">
                    = Rp {packingCost.toLocaleString("id-ID")}
                  </span>
                )}
              </p>
              <div className="flex items-center gap-1.5">
                <Input
                  id="prod-weight"
                  type="number"
                  min={0}
                  placeholder="0"
                  className="w-32"
                  value={state.weightKg}
                  onChange={(e) => onChange({ ...state, weightKg: e.target.value })}
                />
                <span className="text-sm text-muted-foreground">{t("weight.unit")}</span>
              </div>
            </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
