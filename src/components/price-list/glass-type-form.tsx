"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/shared/image-upload-field";

export type GlassTypeFormValues = {
  glassTypeName: string;
  image: { url: string; publicId: string } | null;
};

type Props = {
  values: GlassTypeFormValues;
  onChange: (values: GlassTypeFormValues) => void;
  errors?: Record<string, string>;
};

export function GlassTypeForm({ values, onChange, errors }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="glassTypeName">Nama Tipe Kaca</Label>
        <Input
          id="glassTypeName"
          value={values.glassTypeName}
          onChange={(e) =>
            onChange({ ...values, glassTypeName: e.target.value })
          }
          placeholder="Contoh: Clear, Tempered, Laminated, Stopsol"
        />
        {errors?.glassTypeName && (
          <p className="text-sm text-destructive">{errors.glassTypeName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Gambar Tipe Kaca</Label>
        <ImageUploadField
          value={values.image}
          onChange={(image) => onChange({ ...values, image })}
          folder="category"
          error={errors?.glassTypeImageUrl || errors?.glassTypeImagePublicId}
        />
      </div>
    </div>
  );
}

