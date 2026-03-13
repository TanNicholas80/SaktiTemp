"use client";

import * as React from "react";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { RichTextEditor } from "@/components/shared/rich-text-editor";

export type ProductApplicationFormValues = {
  name: string;
  description: string;
  image: { url: string; publicId: string } | null;
  productId: string;
  published: boolean;
};

type CategoryProductOption = {
  categoryProductId: string;
  categoryProductName: string;
  categoryProductSlug: string;
};

type ProductOption = {
  productId: string;
  productName: string;
  productSlug: string;
  categoryProductId?: string;
};

type ProductApplicationFormProps = {
  values: ProductApplicationFormValues;
  onChange: (values: ProductApplicationFormValues) => void;
  errors: Record<string, string>;
  products: ProductOption[];
  categories?: CategoryProductOption[];
};

export function ProductApplicationForm({
  values,
  onChange,
  errors,
  products,
}: ProductApplicationFormProps) {
  const selectedProduct = React.useMemo(
    () =>
      products.find((p) => p.productId === values.productId) ?? null,
    [products, values.productId]
  );

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="name">Nama Aplikasi</FieldLabel>
        <Input
          id="name"
          value={values.name}
          onChange={(e) => onChange({ ...values, name: e.target.value })}
          placeholder="Contoh: Glass Railing System"
          aria-invalid={!!errors.productApplicationName}
        />
        <FieldError
          errors={
            errors.productApplicationName
              ? [{ message: errors.productApplicationName }]
              : []
          }
        />
      </Field>

      <Field>
        <FieldLabel>Produk</FieldLabel>
        <Combobox
          items={products}
          itemToStringLabel={(p) => p.productName}
          itemToStringValue={(p) => p.productId}
          isItemEqualToValue={(a, b) => a?.productId === b?.productId}
          value={selectedProduct}
          onValueChange={(p) =>
            onChange({ ...values, productId: p?.productId ?? "" })
          }
        >
          <ComboboxInput
            placeholder="Pilih produk"
            className="w-full"
            aria-invalid={!!errors.productId}
          />
          <ComboboxContent>
            <ComboboxEmpty>Tidak ada produk ditemukan.</ComboboxEmpty>
            <ComboboxList>
              {(p) => (
                <ComboboxItem key={p.productId} value={p}>
                  {p.productName}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>

      <Field>
        <FieldLabel>Gambar</FieldLabel>
        <ImageUploadField
          value={values.image}
          onChange={(image) => onChange({ ...values, image })}
          error={errors.productApplicationImageUrl}
          folder="product"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
        <RichTextEditor
          value={values.description}
          onChange={(content) => onChange({ ...values, description: content })}
          placeholder="Deskripsi aplikasi..."
          minHeight="200px"
        />
        <FieldError
          errors={
            errors.productApplicationDescription
              ? [{ message: errors.productApplicationDescription }]
              : []
          }
        />
      </Field>

      <Field orientation="horizontal">
        <Checkbox
          id="published"
          checked={values.published}
          onCheckedChange={(v) => onChange({ ...values, published: !!v })}
        />
        <FieldLabel htmlFor="published">Publikasikan</FieldLabel>
      </Field>
    </FieldGroup>
  );
}
