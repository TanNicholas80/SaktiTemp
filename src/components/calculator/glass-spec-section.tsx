"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  GLASS_DIM_MM,
  getDimensionSurchargeRate,
  validateGlassDimensions,
} from "./dimension-rules";
import type { GlassType, GlassPrice, GlassSpec } from "./types";

type Props = {
  glassTypes: GlassType[];
  glassPrices: GlassPrice[];
  spec: GlassSpec;
  onChange: (spec: GlassSpec) => void;
  defaultOpen?: boolean;
  /** Pesan error dimensi (di luar rentang min/max) */
  dimensionError?: string | null;
};

export function GlassSpecSection({
  glassTypes,
  glassPrices,
  spec,
  onChange,
  defaultOpen = true,
  dimensionError = null,
}: Props) {
  // Compute available variants for selected glass type
  const availableVariants = React.useMemo(() => {
    if (!spec.glassTypeId) return [];
    const pricesForType = glassPrices.filter(
      (p) => p.glassTypeId === spec.glassTypeId
    );
    const seen = new Set<string>();
    const variants: Array<{ variant: string; variantImageUrl: string }> = [];
    for (const p of pricesForType) {
      if (!seen.has(p.variant)) {
        seen.add(p.variant);
        variants.push({ variant: p.variant, variantImageUrl: p.variantImageUrl });
      }
    }
    return variants;
  }, [spec.glassTypeId, glassPrices]);

  // Compute available thicknesses for selected glass type + variant
  const availableThicknesses = React.useMemo(() => {
    if (!spec.glassTypeId || !spec.variant) return [];
    return glassPrices
      .filter(
        (p) =>
          p.glassTypeId === spec.glassTypeId && p.variant === spec.variant
      )
      .sort((a, b) => a.thicknessValue - b.thicknessValue)
      .map((p) => ({
        thicknessId: p.thicknessId,
        thicknessValue: p.thicknessValue,
        thicknessUnit: p.thicknessUnit,
      }));
  }, [spec.glassTypeId, spec.variant, glassPrices]);

  function handleTypeSelect(id: string) {
    onChange({ ...spec, glassTypeId: id, variant: null, thicknessId: null });
  }

  function handleVariantSelect(variant: string) {
    onChange({ ...spec, variant, thicknessId: null });
  }

  function handleThicknessChange(thicknessId: string) {
    onChange({ ...spec, thicknessId });
  }

  const panjangNum = parseFloat(spec.panjang);
  const lebarNum = parseFloat(spec.lebar);
  const dimsFilled =
    !isNaN(panjangNum) &&
    !isNaN(lebarNum) &&
    panjangNum > 0 &&
    lebarNum > 0;
  const dimsOk = dimsFilled && validateGlassDimensions(panjangNum, lebarNum).ok;
  const surchargeRate =
    dimsOk ? getDimensionSurchargeRate(panjangNum, lebarNum) : 0;

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? "glass-spec" : undefined}
      className="w-full"
    >
      <AccordionItem
        value="glass-spec"
        className="rounded-xl border border-border bg-card shadow-sm border-b-0"
      >
        <AccordionTrigger className="px-5 py-4 text-base font-bold text-primary hover:no-underline">
          Spesifikasi Dasar Kaca
        </AccordionTrigger>
        <AccordionContent className="space-y-6 px-5 pb-6 text-[0.9375rem]">
            {/* Jenis Kaca */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Pilih Jenis Kaca</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {glassTypes.map((gt) => (
                  <button
                    key={gt.glassTypeId}
                    type="button"
                    onClick={() => handleTypeSelect(gt.glassTypeId)}
                    className={cn(
                      "flex flex-col items-center rounded-lg border p-2 text-center transition-all",
                      "hover:border-primary/60 hover:shadow-sm",
                      spec.glassTypeId === gt.glassTypeId
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-background"
                    )}
                  >
                    <div className="relative mb-2 aspect-[4/3] w-full overflow-hidden rounded-md bg-muted">
                      {gt.glassTypeImageUrl ? (
                        <Image
                          src={gt.glassTypeImageUrl}
                          alt={gt.glassTypeName}
                          fill
                          sizes="(max-width: 640px) 45vw, 160px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted" />
                      )}
                    </div>
                    <span className="text-xs font-medium leading-tight text-foreground">
                      {gt.glassTypeName}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Varian Model */}
            {spec.glassTypeId && availableVariants.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Varian Model</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3">
                  {availableVariants.map((v) => (
                    <button
                      key={v.variant}
                      type="button"
                      onClick={() => handleVariantSelect(v.variant)}
                      className={cn(
                        "flex flex-col items-center rounded-lg border p-2 text-center transition-all",
                        "hover:border-primary/60 hover:shadow-sm",
                        spec.variant === v.variant
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-background"
                      )}
                    >
                      <div className="relative mb-2 aspect-[4/3] w-full overflow-hidden rounded-md bg-muted">
                        {v.variantImageUrl ? (
                          <Image
                            src={v.variantImageUrl}
                            alt={v.variant}
                            fill
                            sizes="(max-width: 640px) 45vw, 160px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-muted" />
                        )}
                      </div>
                      <span className="text-xs font-medium leading-tight text-foreground">
                        {v.variant}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ketebalan */}
            {spec.variant && availableThicknesses.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="glass-thickness" className="text-sm font-semibold">
                  Ketebalan (Mm)
                </Label>
                <Select
                  value={spec.thicknessId ?? ""}
                  onValueChange={handleThicknessChange}
                >
                  <SelectTrigger id="glass-thickness" className="w-full sm:w-64">
                    <SelectValue placeholder="Pilih ketebalan..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableThicknesses.map((t) => (
                      <SelectItem key={t.thicknessId} value={t.thicknessId}>
                        {t.thicknessValue} {t.thicknessUnit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Dimensi */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Dimensi Kaca (Panjang X Lebar)
              </Label>
              <p className="text-xs text-muted-foreground">
                Minimal {GLASS_DIM_MM.MIN_PANJANG} mm × {GLASS_DIM_MM.MIN_LEBAR} mm; maks.{" "}
                {GLASS_DIM_MM.MAX_PANJANG} mm × {GLASS_DIM_MM.MAX_LEBAR} mm. Di atas{" "}
                {GLASS_DIM_MM.STD_PANJANG} × {GLASS_DIM_MM.STD_LEBAR} mm hingga{" "}
                {GLASS_DIM_MM.TIER1_MAX_PANJANG} × {GLASS_DIM_MM.TIER1_MAX_LEBAR} mm:{" "}
                tambahan 10% dari material. Lebar di atas {GLASS_DIM_MM.TIER1_MAX_LEBAR} mm
                (sampai {GLASS_DIM_MM.TIER2_MAX_LEBAR} mm): tambahan 20%.
                {dimsOk && surchargeRate > 0 && (
                  <span className="ml-1 font-semibold text-primary">
                    (Surcharge{" "}
                    {surchargeRate === 0.2 ? "20%" : "10%"} aktif pada estimasi)
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="dim-panjang" className="text-xs text-muted-foreground">
                    Panjang
                  </Label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      id="dim-panjang"
                      type="number"
                      min={GLASS_DIM_MM.MIN_PANJANG}
                      placeholder="0"
                      className={cn(
                        "w-32",
                        dimensionError && "border-destructive aria-invalid"
                      )}
                      aria-invalid={!!dimensionError}
                      value={spec.panjang}
                      onChange={(e) =>
                        onChange({ ...spec, panjang: e.target.value })
                      }
                    />
                    <span className="text-sm text-muted-foreground">mm</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="dim-lebar" className="text-xs text-muted-foreground">
                    Lebar
                  </Label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      id="dim-lebar"
                      type="number"
                      min={GLASS_DIM_MM.MIN_LEBAR}
                      placeholder="0"
                      className={cn(
                        "w-32",
                        dimensionError && "border-destructive aria-invalid"
                      )}
                      aria-invalid={!!dimensionError}
                      value={spec.lebar}
                      onChange={(e) =>
                        onChange({ ...spec, lebar: e.target.value })
                      }
                    />
                    <span className="text-sm text-muted-foreground">mm</span>
                  </div>
                </div>
              </div>
              {dimensionError && (
                <p className="text-sm text-destructive font-medium">{dimensionError}</p>
              )}
            </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
