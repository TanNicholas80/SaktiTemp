"use client";

import * as React from "react";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { dimensionSurchargeLabel } from "./dimension-rules";
import type { CalcBreakdown } from "./types";

type Props = {
  breakdown: CalcBreakdown;
  glassTypeName?: string;
  variant?: string;
  thicknessLabel?: string;
  panjang?: string;
  lebar?: string;
  /** Judul kartu (default: ringkasan sementara di kalkulator) */
  heading?: string;
  /** Sembunyikan tombol di dalam kartu (mis. halaman rincian pakai tombol di luar) */
  hideBuiltInActions?: boolean;
  /** Menuju halaman rincian penawaran */
  onViewFinalClick?: () => void;
  onOrderClick?: () => void;
};

function fmt(n: number) {
  return n.toLocaleString("id-ID");
}

type LineProps = {
  label: string;
  sublabel?: string;
  amount: number;
  highlight?: boolean;
  muted?: boolean;
};

function SummaryLine({ label, sublabel, amount, highlight, muted }: LineProps) {
  return (
    <div className={cn("flex items-start justify-between gap-3 py-2", muted && "opacity-60")}>
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "text-sm leading-snug",
            highlight ? "font-semibold text-foreground" : "font-medium text-foreground"
          )}
        >
          {label}
        </div>
        {sublabel && (
          <div className="mt-0.5 text-xs text-muted-foreground leading-snug">
            {sublabel}
          </div>
        )}
      </div>
      <div
        className={cn(
          "shrink-0 text-sm tabular-nums",
          highlight ? "font-bold text-foreground" : "font-medium text-foreground"
        )}
      >
        Rp {fmt(Math.round(amount))}
      </div>
    </div>
  );
}

export function EstimateSummary({
  breakdown,
  glassTypeName,
  variant,
  thicknessLabel,
  panjang,
  lebar,
  heading,
  hideBuiltInActions = false,
  onViewFinalClick,
  onOrderClick,
}: Props) {
  const t = useTranslations("calculatorSection.summary");
  const tDimensionRules = useTranslations("calculatorSection.dimensionRules");
  const resolvedHeading = heading ?? t("defaultHeading");
  const {
    materialCost,
    dimensionSurcharge,
    addOnCosts,
    modificationCosts,
    patternSurchargeAmount,
    speedSurchargeAmount,
    shippingCost,
    packingCost,
    subtotal,
    ppn,
    grandTotal,
  } = breakdown;

  const hasAnyCost = grandTotal > 0;

  const materialLabel =
    glassTypeName && variant
      ? `${glassTypeName} (${variant}${thicknessLabel ? ", " + thicknessLabel : ""})`
      : t("materialDefaultLabel");

  const dimLabel =
    panjang && lebar ? `${panjang} mm x ${lebar} mm` : undefined;
  const hasDimSurcharge = dimensionSurcharge > 0;
  const dimRate = breakdown.dimensionSurchargeRate ?? 0;
  const dimSuffix = dimensionSurchargeLabel(dimRate, tDimensionRules);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-base font-bold text-primary">{resolvedHeading}</h3>
      </div>

      <div className="px-5 py-4 space-y-0.5">
        {!hasAnyCost && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t("emptyState")}
          </p>
        )}

        {materialCost > 0 && (
          <SummaryLine
            label={t("materialLabel")}
            sublabel={materialLabel}
            amount={materialCost}
          />
        )}

        {hasDimSurcharge && (
          <SummaryLine
            label={t("dimensionLabel")}
            sublabel={
              dimLabel
                ? `${dimLabel} ${dimSuffix}`.trim()
                : dimSuffix
            }
            amount={dimensionSurcharge}
          />
        )}

        {addOnCosts.map((a, i) => (
          <SummaryLine
            key={i}
            label={t("addOnLabel", { index: i + 1 })}
            sublabel={a.label}
            amount={a.cost}
          />
        ))}

        {modificationCosts.map((m, i) => (
          <SummaryLine
            key={i}
            label={t("modificationLabel")}
            sublabel={m.label}
            amount={m.cost}
          />
        ))}

        {patternSurchargeAmount > 0 && (
          <SummaryLine
            label={t("customPatternSurchargeLabel")}
            amount={patternSurchargeAmount}
          />
        )}

        {speedSurchargeAmount > 0 && (
          <SummaryLine
            label={t("expressSurchargeLabel")}
            amount={speedSurchargeAmount}
          />
        )}

        {(shippingCost > 0 || packingCost > 0) && (
          <SummaryLine
            label={t("logisticLabel")}
            sublabel={[
              shippingCost > 0
                ? t("shippingLabel", { amount: fmt(shippingCost) })
                : null,
              packingCost > 0
                ? t("packingLabel", { amount: fmt(packingCost) })
                : null,
            ]
              .filter(Boolean)
              .join(" & ")}
            amount={shippingCost + packingCost}
          />
        )}

        {hasAnyCost && (
          <>
            <Separator className="my-3" />
            <div className="flex items-center justify-between py-1.5">
              <span className="text-sm font-medium text-muted-foreground">{t("subTotalLabel")}</span>
              <span className="text-sm font-semibold tabular-nums text-foreground">
                Rp {fmt(Math.round(subtotal))}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-sm font-medium text-muted-foreground">{t("ppnLabel")}</span>
              <span className="text-sm font-semibold tabular-nums text-foreground">
                Rp {fmt(Math.round(ppn))}
              </span>
            </div>
            <Separator className="my-3" />
            <div className="flex items-center justify-between py-1">
              <span className="text-base font-bold text-foreground">{t("grandTotalLabel")}</span>
              <span className="text-base font-bold tabular-nums text-primary">
                Rp {fmt(Math.round(grandTotal))}
              </span>
            </div>
          </>
        )}
      </div>

      {hasAnyCost &&
        !hideBuiltInActions &&
        (onViewFinalClick || onOrderClick) && (
        <div className="space-y-2 px-5 pb-5">
          {onViewFinalClick && (
            <Button
              type="button"
              className="w-full gap-2 bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
              onClick={onViewFinalClick}
            >
              <FileText className="size-4" />
              {t("viewFinalButton")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
