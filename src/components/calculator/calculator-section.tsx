"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { GlassSpecSection } from "./glass-spec-section";
import { EstimateSummary } from "./estimate-summary";
import {
  dimensionValidationMessage,
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
  CalcBreakdown,
} from "./types";
import { useRouter } from "@/i18n/navigation";
import { WHATSAPP_ME_URL } from "@/lib/constants/whatsapp";
import { createCalculatorSectionEntrance } from "./calculator-gsap";

export function CalculatorSection({
  glassTypes,
  glassPrices,
}: CalculatorSectionProps) {
  const tDimensionRules = useTranslations("calculatorSection.dimensionRules");
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
    quantity: "1",
  });

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

    const flatPolishEdgingIncluded =
      !!selectedGlassPrice && dimValid && materialBase > 0;

    const parsedQty = parseInt(glassSpec.quantity, 10);
    const quantity =
      Number.isFinite(parsedQty) && parsedQty >= 1 ? Math.floor(parsedQty) : 0;

    const subtotalPerSheet = materialCost + dimensionSurcharge;
    const subtotal = subtotalPerSheet * quantity;
    const ppn = subtotal * 0.11;
    const grandTotal = subtotal + ppn;

    return {
      materialCost,
      dimensionSurcharge,
      dimensionSurchargeRate: dimSurchargeRate,
      flatPolishEdgingIncluded,
      quantity,
      subtotalPerSheet,
      subtotal,
      ppn,
      grandTotal,
    };
  }, [glassSpec, selectedGlassPrice]);

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
    });
    const waText = encodeURIComponent(lines.join("\n"));
    window.open(`${WHATSAPP_ME_URL}?text=${waText}`, "_blank");
  }

  function handleViewFinalClick() {
    if (breakdown.grandTotal <= 0) return;
    saveCalculatorRincianPayload({
      breakdown,
      glassTypeId: selectedGlassType?.glassTypeId,
      glassTypeName: selectedGlassType?.glassTypeName,
      glassPricesId: selectedGlassPrice?.glassPricesId,
      variant: selectedGlassPrice?.variant ?? (glassSpec.variant ?? undefined),
      thicknessId: selectedGlassPrice?.thicknessId,
      thicknessValue: selectedGlassPrice?.thicknessValue,
      thicknessUnit: selectedGlassPrice?.thicknessUnit,
      thicknessLabel,
      panjang: glassSpec.panjang,
      lebar: glassSpec.lebar,
    });
    router.push("/calculator/rincian");
  }

  return (
    <div
      ref={rootRef}
      className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] xl:gap-8"
    >
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
                  return dimensionValidationMessage(r, tDimensionRules);
                })()
              : null
          }
        />
      </div>

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
