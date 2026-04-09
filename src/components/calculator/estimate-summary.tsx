"use client";

import * as React from "react";
import { FileText } from "lucide-react";

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
  heading = "Rincian Estimasi Sementara",
  hideBuiltInActions = false,
  onViewFinalClick,
  onOrderClick,
}: Props) {
  const {
    materialCost,
    dimensionSurcharge,
    addOnCosts,
    subtotal,
    ppn,
    grandTotal,
  } = breakdown;

  const hasAnyCost = grandTotal > 0;

  const materialLabel =
    glassTypeName && variant
      ? `${glassTypeName} (${variant}${thicknessLabel ? ", " + thicknessLabel : ""})`
      : "Material Dasar";

  const dimLabel =
    panjang && lebar ? `${panjang} mm x ${lebar} mm` : undefined;
  const hasDimSurcharge = dimensionSurcharge > 0;
  const dimRate = breakdown.dimensionSurchargeRate ?? 0;
  const dimSuffix = dimensionSurchargeLabel(dimRate);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-base font-bold text-primary">{heading}</h3>
      </div>

      <div className="px-5 py-4 space-y-0.5">
        {!hasAnyCost && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Lengkapi spesifikasi kaca untuk melihat estimasi harga.
          </p>
        )}

        {materialCost > 0 && (
          <SummaryLine
            label="Material Dasar"
            sublabel={materialLabel}
            amount={materialCost}
          />
        )}

        {hasDimSurcharge && (
          <SummaryLine
            label="Dimensi"
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
            label={`Add-On ${i + 1}`}
            sublabel={a.label}
            amount={a.cost}
          />
        ))}

        {hasAnyCost && (
          <>
            <Separator className="my-3" />
            <div className="flex items-center justify-between py-1.5">
              <span className="text-sm font-medium text-muted-foreground">Sub-Total:</span>
              <span className="text-sm font-semibold tabular-nums text-foreground">
                Rp {fmt(Math.round(subtotal))}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-sm font-medium text-muted-foreground">PPN (11%):</span>
              <span className="text-sm font-semibold tabular-nums text-foreground">
                Rp {fmt(Math.round(ppn))}
              </span>
            </div>
            <Separator className="my-3" />
            <div className="flex items-center justify-between py-1">
              <span className="text-base font-bold text-foreground">Estimasi Grand Total:</span>
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
              Lihat Rincian Akhir Pesanan
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
