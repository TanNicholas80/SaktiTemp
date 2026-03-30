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

import type { Option } from "@/components/price-list/glass-price-form";

export type ModificationRowInput = {
  rowId: string;
  thicknessId: string;
  pricePerSide: string;
};

export type ModificationFormValues = {
  name: string;
  image: { url: string; publicId: string } | null;
  rows: ModificationRowInput[];
};

type Props = {
  values: ModificationFormValues;
  onChange: (values: ModificationFormValues) => void;
  errors?: Record<string, string>;
  thicknessOptions: Option[];
  allowMultipleRows?: boolean;
};

export function newModificationRow(thicknessOptions: Option[]): ModificationRowInput {
  return {
    rowId:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `row-${Date.now()}-${Math.random()}`,
    thicknessId: thicknessOptions[0]?.value ?? "",
    pricePerSide: "",
  };
}

export function ModificationForm({
  values,
  onChange,
  errors,
  thicknessOptions,
  allowMultipleRows = true,
}: Props) {
  const updateRow = React.useCallback(
    (index: number, patch: Partial<ModificationRowInput>) => {
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
      rows: [...values.rows, newModificationRow(thicknessOptions)],
    });
  }, [allowMultipleRows, onChange, values, thicknessOptions]);

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
        <Label htmlFor="modName">Nama modifikasi</Label>
        <Input
          id="modName"
          value={values.name}
          onChange={(e) => onChange({ ...values, name: e.target.value })}
          placeholder="Contoh: Deco-Lami, Stopsol"
        />
        {errors?.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Gambar modifikasi</Label>
        <ImageUploadField
          value={values.image}
          onChange={(image) => onChange({ ...values, image })}
          folder="category"
          error={
            errors?.modificationImageUrl ||
            errors?.modificationImagePublicId
          }
        />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <Label className="text-base">Ketebalan & harga per sisi</Label>
            <p className="text-muted-foreground text-sm font-normal">
              Satu baris per ketebalan. Nama dan gambar sama untuk semua baris
              (seperti pricelist kaca).
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

              <div className="grid gap-3 sm:grid-cols-2">
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
                  <Label htmlFor={`price-${row.rowId}`}>Harga per sisi</Label>
                  <Input
                    id={`price-${row.rowId}`}
                    inputMode="decimal"
                    value={row.pricePerSide}
                    onChange={(e) =>
                      updateRow(i, { pricePerSide: e.target.value })
                    }
                    placeholder="Contoh: 50000"
                  />
                  {rowError(i, "pricePerSide") && (
                    <p className="text-sm text-destructive">
                      {rowError(i, "pricePerSide")}
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
