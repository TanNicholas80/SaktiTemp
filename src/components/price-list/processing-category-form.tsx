"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/shared/image-upload-field";

export type ProcessingCategoryFormValues = {
  categoryName: string;
  image: { url: string; publicId: string } | null;
};

type Props = {
  values: ProcessingCategoryFormValues;
  onChange: (values: ProcessingCategoryFormValues) => void;
  errors?: Record<string, string>;
};

export function ProcessingCategoryForm({ values, onChange, errors }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="categoryName">Nama kategori</Label>
        <Input
          id="categoryName"
          value={values.categoryName}
          onChange={(e) =>
            onChange({ ...values, categoryName: e.target.value })
          }
          placeholder="Contoh: Edging lurus, Bevel & verstek"
        />
        {errors?.categoryName && (
          <p className="text-sm text-destructive">{errors.categoryName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Gambar kategori</Label>
        <ImageUploadField
          value={values.image}
          onChange={(image) => onChange({ ...values, image })}
          folder="category"
          error={
            errors?.categoryImageUrl || errors?.categoryImagePublicId
          }
        />
      </div>
    </div>
  );
}
