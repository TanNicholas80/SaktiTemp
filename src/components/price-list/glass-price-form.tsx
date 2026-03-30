"use client";

import * as React from "react";

import { Plus, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type GlassPriceRowInput = {
  rowId: string;
  thicknessId: string;
  composition: string;
  compositionDetail: string;
  pricePerSqm: string;
};

export type GlassPriceFormValues = {
  glassTypeId: string;
  variant: string;
  image: { url: string; publicId: string } | null;
  rows: GlassPriceRowInput[];
};

export type Option = { value: string; label: string };

type Props = {
  values: GlassPriceFormValues;
  onChange: (values: GlassPriceFormValues) => void;
  errors?: Record<string, string>;
  glassTypeOptions: Option[];
  thicknessOptions: Option[];
  /** Default: true (tambah harga). Edit satu baris = false */
  allowMultipleRows?: boolean;
};

export function newRow(thicknessOptions: Option[]): GlassPriceRowInput {
  return {
    rowId:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `row-${Date.now()}-${Math.random()}`,
    thicknessId: thicknessOptions[0]?.value ?? "",
    composition: "",
    compositionDetail: "",
    pricePerSqm: "",
  };
}

export function GlassPriceForm({
  values,
  onChange,
  errors,
  glassTypeOptions,
  thicknessOptions,
  allowMultipleRows = true,
}: Props) {
  const updateRow = React.useCallback(
    (index: number, patch: Partial<GlassPriceRowInput>) => {
      const rows = values.rows.map((r, i) =>
        i === index ? { ...r, ...patch } : r
      );
      onChange({ ...values, rows });
    },
    [onChange, values]
  );

  const addRow = React.useCallback(() => {
    if (!allowMultipleRows) return;
    onChange({
      ...values,
      rows: [...values.rows, newRow(thicknessOptions)],
    });
  }, [allowMultipleRows, onChange, values, thicknessOptions]);

  const removeRow = React.useCallback(
    (index: number) => {
      if (!allowMultipleRows || values.rows.length <= 1) return;
      const rows = values.rows.filter((_, i) => i !== index);
      onChange({ ...values, rows });
    },
    [allowMultipleRows, onChange, values]
  );

  const rowError = (i: number, field: string) =>
    errors?.[`rows.${i}.${field}`] ?? errors?.[`rows_${i}_${field}`];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-1">
          <Label>Tipe kaca</Label>
          <Select
            value={values.glassTypeId}
            onValueChange={(v) => onChange({ ...values, glassTypeId: v })}
          >
            <SelectTrigger className="w-full min-w-0">
              <SelectValue placeholder="Pilih tipe kaca" />
            </SelectTrigger>
            <SelectContent>
              {glassTypeOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.glassTypeId && (
            <p className="text-sm text-destructive">{errors.glassTypeId}</p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="variant">Variant</Label>
          <Input
            id="variant"
            value={values.variant}
            onChange={(e) => onChange({ ...values, variant: e.target.value })}
            placeholder="Contoh: Clear, Warna, Dark Grey"
          />
          {errors?.variant && (
            <p className="text-sm text-destructive">{errors.variant}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Gambar variant</Label>
        <div className="min-h-[48px]">
          <ImageUploadField
            value={values.image}
            onChange={(image) => onChange({ ...values, image })}
            folder="product"
            error={errors?.variantImageUrl || errors?.variantImagePublicId}
            size="compact"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <Label className="text-base">Ketebalan, komposisi & harga</Label>
            <p className="text-muted-foreground text-sm font-normal">
              Satu baris per ketebalan. Komposisi & detail opsional. Tipe,
              variant, dan gambar sama untuk semua baris.
            </p>
          </div>
          {allowMultipleRows && (
            <Button type="button" variant="outline" size="sm" onClick={addRow}>
              <Plus className="size-4" />
              Baris
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {values.rows.map((row, i) => (
            <div
              key={row.rowId}
              className="bg-card space-y-3 rounded-lg border p-4 shadow-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground text-sm font-medium">
                  Baris {i + 1}
                </span>
                {allowMultipleRows && values.rows.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeRow(i)}
                    aria-label="Hapus baris"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>Ketebalan</Label>
                  <Select
                    value={row.thicknessId}
                    onValueChange={(v) => updateRow(i, { thicknessId: v })}
                  >
                    <SelectTrigger className="w-full min-w-0">
                      <SelectValue placeholder="Pilih ketebalan" />
                    </SelectTrigger>
                    <SelectContent>
                      {thicknessOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {rowError(i, "thicknessId") && (
                    <p className="text-sm text-destructive">
                      {rowError(i, "thicknessId")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`comp-${row.rowId}`}>Komposisi (opsional)</Label>
                  <Input
                    id={`comp-${row.rowId}`}
                    value={row.composition}
                    onChange={(e) =>
                      updateRow(i, { composition: e.target.value })
                    }
                    placeholder="Opsional"
                  />
                  {rowError(i, "composition") && (
                    <p className="text-sm text-destructive">
                      {rowError(i, "composition")}
                    </p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <Label htmlFor={`compd-${row.rowId}`}>
                    Detail komposisi (opsional)
                  </Label>
                  <Input
                    id={`compd-${row.rowId}`}
                    value={row.compositionDetail}
                    onChange={(e) =>
                      updateRow(i, { compositionDetail: e.target.value })
                    }
                    placeholder="Opsional"
                  />
                  {rowError(i, "compositionDetail") && (
                    <p className="text-sm text-destructive">
                      {rowError(i, "compositionDetail")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`price-${row.rowId}`}>Harga per m²</Label>
                  <Input
                    id={`price-${row.rowId}`}
                    inputMode="decimal"
                    value={row.pricePerSqm}
                    onChange={(e) =>
                      updateRow(i, { pricePerSqm: e.target.value })
                    }
                    placeholder="Contoh: 125000"
                  />
                  {rowError(i, "pricePerSqm") && (
                    <p className="text-sm text-destructive">
                      {rowError(i, "pricePerSqm")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {errors?.rows && (
          <p className="text-sm text-destructive">{errors.rows}</p>
        )}
      </div>
    </div>
  );
}
