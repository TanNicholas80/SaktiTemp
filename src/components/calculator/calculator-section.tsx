"use client";

import * as React from "react";

import { GlassSpecSection } from "./glass-spec-section";
import { AddonSection } from "./addon-section";
import { ModificationSection } from "./modification-section";
import { ProductionSection } from "./production-section";
import { EstimateSummary } from "./estimate-summary";
import {
  validateGlassDimensions,
  getDimensionSurchargeRate,
} from "./dimension-rules";
import {
  saveCalculatorRincianPayload,
  buildCalculatorWhatsAppLines,
} from "./calculator-payload";
import type {
  CalculatorSectionProps,
  GlassSpec,
  AddOnItem,
  ModificationItem,
  ProductionState,
  CalcBreakdown,
  ProcessingPrice,
} from "./types";
import { useRouter } from "@/i18n/navigation";
import { createCalculatorSectionEntrance } from "./calculator-gsap";

function createEmptyAddon(): AddOnItem {
  return {
    id: crypto.randomUUID(),
    categoryId: null,
    serviceName: null,
    thicknessValue: "",
    quantity: "",
  };
}

function createEmptyModification(): ModificationItem {
  return {
    id: crypto.randomUUID(),
    modificationName: null,
    thicknessId: null,
    sides: "1",
  };
}

function matchProcessingPrice(
  prices: ProcessingPrice[],
  categoryId: string,
  serviceName: string,
  thicknessVal: number
): ProcessingPrice | undefined {
  return prices.find((p) => {
    if (p.categoryId !== categoryId || p.serviceName !== serviceName) return false;
    if (p.thickness !== null) return p.thickness === thicknessVal;
    if (p.minThickness !== null && p.maxThickness !== null) {
      return thicknessVal >= p.minThickness && thicknessVal <= p.maxThickness;
    }
    return false;
  });
}

export function CalculatorSection({
  glassTypes,
  glassPrices,
  processingCategories,
  processingPrices,
  modifications,
}: CalculatorSectionProps) {
  const router = useRouter();
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ctx = createCalculatorSectionEntrance(el);
    return () => {
      ctx.revert();
    };
  }, []);

  const [glassSpec, setGlassSpec] = React.useState<GlassSpec>({
    glassTypeId: null,
    variant: null,
    thicknessId: null,
    panjang: "",
    lebar: "",
  });

  const [addons, setAddons] = React.useState<AddOnItem[]>([createEmptyAddon()]);
  const [mods, setMods] = React.useState<ModificationItem[]>([createEmptyModification()]);
  const [production, setProduction] = React.useState<ProductionState>({
    cuttingShape: "regular",
    patternMethod: "standard",
    productionSpeed: "normal",
    departureCity: "semarang",
    distanceKm: "",
    weightKg: "",
  });

  // --- Derived values for summary labels ---
  const selectedGlassType = glassTypes.find(
    (gt) => gt.glassTypeId === glassSpec.glassTypeId
  );
  const selectedGlassPrice = glassPrices.find(
    (gp) =>
      gp.glassTypeId === glassSpec.glassTypeId &&
      gp.variant === glassSpec.variant &&
      gp.thicknessId === glassSpec.thicknessId
  );
  const thicknessLabel = selectedGlassPrice
    ? `${selectedGlassPrice.thicknessValue} ${selectedGlassPrice.thicknessUnit}`
    : undefined;

  // --- Calculation ---
  const breakdown = React.useMemo<CalcBreakdown>(() => {
    const panjangNum = parseFloat(glassSpec.panjang);
    const lebarNum = parseFloat(glassSpec.lebar);

    const dimValid =
      !isNaN(panjangNum) &&
      !isNaN(lebarNum) &&
      panjangNum > 0 &&
      lebarNum > 0 &&
      validateGlassDimensions(panjangNum, lebarNum).ok;

    const sqm =
      dimValid
        ? (panjangNum / 1000) * (lebarNum / 1000)
        : 0;

    const dimSurchargeRate: 0 | 0.1 | 0.2 = dimValid
      ? getDimensionSurchargeRate(panjangNum, lebarNum)
      : 0;

    const pricePerSqm = selectedGlassPrice?.pricePerSqm ?? 0;
    const materialBase = pricePerSqm * sqm;
    const dimensionSurcharge = materialBase * dimSurchargeRate;
    const materialCost = materialBase;

    // Add-on costs
    const addOnCosts: CalcBreakdown["addOnCosts"] = [];
    for (const addon of addons) {
      if (!addon.categoryId || !addon.serviceName) continue;
      const tv = parseFloat(addon.thicknessValue);
      if (isNaN(tv)) continue;
      const price = matchProcessingPrice(
        processingPrices,
        addon.categoryId,
        addon.serviceName,
        tv
      );
      if (!price) continue;

      let cost = 0;
      if (price.unit === "none") {
        cost = price.price;
      } else if (price.unit === "sqm") {
        cost = price.price * sqm;
      } else {
        const qty = parseFloat(addon.quantity);
        if (!isNaN(qty) && qty > 0) {
          cost = price.price * qty;
        }
      }

      const category = processingCategories.find(
        (c) => c.processingCategoryId === addon.categoryId
      );
      addOnCosts.push({
        label: `${category?.categoryName ?? ""} (${addon.serviceName})`,
        cost,
      });
    }

    // Modification costs
    const modificationCosts: CalcBreakdown["modificationCosts"] = [];
    for (const mod of mods) {
      if (!mod.modificationName || !mod.thicknessId) continue;
      const sides = parseInt(mod.sides);
      if (isNaN(sides) || sides <= 0) continue;
      const modData = modifications.find(
        (m) => m.name === mod.modificationName && m.thicknessId === mod.thicknessId
      );
      if (!modData) continue;
      const cost = modData.pricePerSide * sides;
      modificationCosts.push({
        label: `${mod.modificationName} (${sides} Sisi)`,
        cost,
      });
    }

    // Base before production surcharges (material + surcharge dimensi + addons + modifications)
    const materialSubtotal = materialCost + dimensionSurcharge;
    const base =
      materialSubtotal +
      addOnCosts.reduce((s, a) => s + a.cost, 0) +
      modificationCosts.reduce((s, m) => s + m.cost, 0);

    // Pattern surcharge (applied to base)
    const patternSurchargeAmount =
      production.patternMethod === "custom" ? base * 0.1 : 0;
    const afterPattern = base + patternSurchargeAmount;

    // Speed surcharge (applied after pattern)
    const speedSurchargeAmount =
      production.productionSpeed === "express" ? afterPattern * 0.2 : 0;
    const processedTotal = afterPattern + speedSurchargeAmount;

    // Logistics
    const distKm = parseFloat(production.distanceKm);
    const weightKg = parseFloat(production.weightKg);
    const shippingCost =
      !isNaN(distKm) && distKm > 0 ? distKm * 5_000 : 0;
    const packingCost =
      !isNaN(weightKg) && weightKg > 0
        ? Math.floor(weightKg / 250) * 300_000 + (weightKg % 250) * 1_000
        : 0;

    const subtotal = processedTotal + shippingCost + packingCost;
    const ppn = subtotal * 0.11;
    const grandTotal = subtotal + ppn;

    return {
      materialCost,
      dimensionSurcharge,
      dimensionSurchargeRate: dimSurchargeRate,
      addOnCosts,
      modificationCosts,
      patternSurchargeAmount,
      speedSurchargeAmount,
      shippingCost,
      packingCost,
      subtotal,
      ppn,
      grandTotal,
    };
  }, [
    glassSpec,
    selectedGlassPrice,
    addons,
    mods,
    production,
    processingPrices,
    processingCategories,
    modifications,
  ]);

  function handleOrderClick() {
    const lines = buildCalculatorWhatsAppLines({
      selectedGlassTypeName: selectedGlassType?.glassTypeName,
      glassSpec: {
        variant: glassSpec.variant,
        thicknessLabel,
        panjang: glassSpec.panjang,
        lebar: glassSpec.lebar,
      },
      breakdown,
      production,
    });
    const waText = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/6282137056377?text=${waText}`, "_blank");
  }

  function handleViewFinalClick() {
    if (breakdown.grandTotal <= 0) return;
    saveCalculatorRincianPayload({
      breakdown,
      glassTypeName: selectedGlassType?.glassTypeName,
      variant: glassSpec.variant ?? undefined,
      thicknessLabel,
      panjang: glassSpec.panjang,
      lebar: glassSpec.lebar,
      production,
    });
    router.push("/calculator/rincian");
  }

  return (
    <div
      ref={rootRef}
      className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] xl:gap-8"
    >
      {/* Left: Accordion Sections */}
      <div className="space-y-4" data-calculator-left>
        <GlassSpecSection
          glassTypes={glassTypes}
          glassPrices={glassPrices}
          spec={glassSpec}
          onChange={setGlassSpec}
          defaultOpen
          dimensionError={
            glassSpec.panjang !== "" &&
            glassSpec.lebar !== "" &&
            !isNaN(parseFloat(glassSpec.panjang)) &&
            !isNaN(parseFloat(glassSpec.lebar))
              ? (() => {
                  const p = parseFloat(glassSpec.panjang);
                  const l = parseFloat(glassSpec.lebar);
                  const r = validateGlassDimensions(p, l);
                  return r.ok ? null : r.message;
                })()
              : null
          }
        />
        <AddonSection
          processingCategories={processingCategories}
          processingPrices={processingPrices}
          items={addons}
          onChange={setAddons}
        />
        <ModificationSection
          modifications={modifications}
          items={mods}
          onChange={setMods}
        />
        <ProductionSection
          state={production}
          onChange={setProduction}
        />
      </div>

      {/* Right: Sticky Summary */}
      <div
        className="lg:sticky lg:top-24 lg:self-start"
        data-calculator-right
      >
        <EstimateSummary
          breakdown={breakdown}
          glassTypeName={selectedGlassType?.glassTypeName}
          variant={glassSpec.variant ?? undefined}
          thicknessLabel={thicknessLabel}
          panjang={glassSpec.panjang}
          lebar={glassSpec.lebar}
          onViewFinalClick={handleViewFinalClick}
          onOrderClick={handleOrderClick}
        />
      </div>
    </div>
  );
}
