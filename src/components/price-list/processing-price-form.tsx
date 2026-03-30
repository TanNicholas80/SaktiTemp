"use client";

import * as React from "react";

import { Plus, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Option } from "@/components/price-list/glass-price-form";

export type ProcessingUnit = "m1" | "pcs" | "sqm" | "none";

const UNIT_LABELS: Record<ProcessingUnit, string> = {
  m1: "m¹ (per meter)",
  pcs: "pcs",
  sqm: "m²",
  none: "Tanpa satuan",
};

export type ProcessingPriceRowInput = {
  rowId: string;
  mode: "range" | "single";
  thickness: string;
  minThickness: string;
  maxThickness: string;
  price: string;
};

export type ProcessingPriceFormValues = {
  categoryId: string;
  serviceName: string;
  unit: ProcessingUnit;
  rows: ProcessingPriceRowInput[];
};

type Props = {
  values: ProcessingPriceFormValues;
  onChange: (values: ProcessingPriceFormValues) => void;
  errors?: Record<string, string>;
  categoryOptions: Option[];
  allowMultipleRows?: boolean;
};

export function newProcessingPriceRow(): ProcessingPriceRowInput {
  return {
    rowId:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `row-${Date.now()}-${Math.random()}`,
    mode: "range",
    thickness: "",
    minThickness: "",
    maxThickness: "",
    price: "",
  };
}

export function ProcessingPriceForm({
  values,
  onChange,
  errors,
  categoryOptions,
  allowMultipleRows = true,
}: Props) {
  const updateRow = React.useCallback(
    (index: number, patch: Partial<ProcessingPriceRowInput>) => {
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
      rows: [...values.rows, newProcessingPriceRow()],
    });
  }, [allowMultipleRows, onChange, values]);

  const removeRow = React.useCallback(
    (index: number) => {
      if (!allowMultipleRows || values.rows.length <= 1) return;
      onChange({
        ...values,
        rows: values.rows.filter((_, i) => i !== index),
      });
    },
    [allowMultipleRows, onChange, values]
  );

  const rowError = (i: number, field: string) =>
    errors?.[`rows.${i}.${field}`];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Kategori</Label>
        <Select
          value={values.categoryId}
          onValueChange={(v) => onChange({ ...values, categoryId: v })}
        >
          <SelectTrigger className="w-full min-w-0">
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.categoryId && (
          <p className="text-sm text-destructive">{errors.categoryId}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="serviceName">Nama layanan / jenis proses</Label>
        <Input
          id="serviceName"
          value={values.serviceName}
          onChange={(e) =>
            onChange({ ...values, serviceName: e.target.value })
          }
          placeholder="Contoh: Polish lurus"
        />
        {errors?.serviceName && (
          <p className="text-sm text-destructive">{errors.serviceName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Satuan</Label>
        <Select
          value={values.unit}
          onValueChange={(v) =>
            onChange({ ...values, unit: v as ProcessingUnit })
          }
        >
          <SelectTrigger className="w-full min-w-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(UNIT_LABELS) as ProcessingUnit[]).map((u) => (
              <SelectItem key={u} value={u}>
                {UNIT_LABELS[u]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.unit && (
          <p className="text-sm text-destructive">{errors.unit}</p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <Label className="text-base">Ketebalan & harga</Label>
            <p className="text-muted-foreground text-sm font-normal">
              Beberapa baris ketebalan (mode range min–max atau tunggal) dan
              harga. Kategori, layanan, dan satuan sama untuk semua baris.
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

              <div className="space-y-2">
                <Label>Jenis ketebalan</Label>
                <Select
                  value={row.mode}
                  onValueChange={(v) =>
                    updateRow(i, { mode: v as "range" | "single" })
                  }
                >
                  <SelectTrigger className="w-full min-w-0">
                    <SelectValue placeholder="Pilih mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="range">Range (min-max)</SelectItem>
                    <SelectItem value="single">Tunggal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {row.mode === "range" ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor={`minTh-${row.rowId}`}>
                      Ketebalan min (mm)
                    </Label>
                    <Input
                      id={`minTh-${row.rowId}`}
                      inputMode="decimal"
                      value={row.minThickness}
                      onChange={(e) =>
                        updateRow(i, { minThickness: e.target.value })
                      }
                      placeholder="0"
                    />
                    {rowError(i, "minThickness") && (
                      <p className="text-sm text-destructive">
                        {rowError(i, "minThickness")}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`maxTh-${row.rowId}`}>
                      Ketebalan max (mm)
                    </Label>
                    <Input
                      id={`maxTh-${row.rowId}`}
                      inputMode="decimal"
                      value={row.maxThickness}
                      onChange={(e) =>
                        updateRow(i, { maxThickness: e.target.value })
                      }
                      placeholder="12"
                    />
                    {rowError(i, "maxThickness") && (
                      <p className="text-sm text-destructive">
                        {rowError(i, "maxThickness")}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`price-${row.rowId}`}>Harga</Label>
                    <Input
                      id={`price-${row.rowId}`}
                      inputMode="decimal"
                      value={row.price}
                      onChange={(e) =>
                        updateRow(i, { price: e.target.value })
                      }
                      placeholder="Contoh: 15000"
                    />
                    {rowError(i, "price") && (
                      <p className="text-sm text-destructive">
                        {rowError(i, "price")}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`th-${row.rowId}`}>Ketebalan (mm)</Label>
                    <Input
                      id={`th-${row.rowId}`}
                      inputMode="decimal"
                      value={row.thickness}
                      onChange={(e) => updateRow(i, { thickness: e.target.value })}
                      placeholder="Contoh: 10"
                    />
                    {rowError(i, "thickness") && (
                      <p className="text-sm text-destructive">
                        {rowError(i, "thickness")}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`price-${row.rowId}`}>Harga</Label>
                    <Input
                      id={`price-${row.rowId}`}
                      inputMode="decimal"
                      value={row.price}
                      onChange={(e) => updateRow(i, { price: e.target.value })}
                      placeholder="Contoh: 15000"
                    />
                    {rowError(i, "price") && (
                      <p className="text-sm text-destructive">
                        {rowError(i, "price")}
                      </p>
                    )}
                  </div>
                </div>
              )}
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
