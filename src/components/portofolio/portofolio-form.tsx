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
import { slugify } from "@/lib/utils/slug";
import { PortofolioFormPreviewCard } from "./portofolio-form-preview-card";
import type {
  CategoryPortofolioOption,
  PortofolioTypeOption,
  ProductApplicationOption,
} from "./types";

export type PortofolioFormValues = {
  name: string;
  slug: string;
  shortDescription: string;
  about: string;
  location: string;
  image: { url: string; publicId: string } | null;
  categoryId: string;
  portofolioTypeId: string;
  productApplicationIds: string[];
  published: boolean;
};

type PortofolioFormProps = {
  values: PortofolioFormValues;
  onChange: (values: PortofolioFormValues) => void;
  errors: Record<string, string>;
  categories: CategoryPortofolioOption[];
  portofolioTypes: PortofolioTypeOption[];
  productApplications: ProductApplicationOption[];
  /** Slug portofolio untuk link preview (hanya saat edit) */
  portofolioSlug?: string;
};

export function PortofolioForm({
  values,
  onChange,
  errors,
  categories,
  portofolioTypes,
  productApplications,
  portofolioSlug,
}: PortofolioFormProps) {
  React.useEffect(() => {
    const newSlug = slugify(values.name);
    if (newSlug !== values.slug) {
      onChange({ ...values, slug: newSlug });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.name]);

  const selectedCategory = React.useMemo(
    () =>
      categories.find(
        (c) => c.categoryPortofolioId === values.categoryId
      ) ?? null,
    [categories, values.categoryId]
  );

  const selectedPortofolioType = React.useMemo(
    () =>
      portofolioTypes.find(
        (t) => t.portofolioTypeId === values.portofolioTypeId
      ) ?? null,
    [portofolioTypes, values.portofolioTypeId]
  );

  function toggleProductApplication(productApplicationId: string) {
    const next = values.productApplicationIds.includes(productApplicationId)
      ? values.productApplicationIds.filter((id) => id !== productApplicationId)
      : [...values.productApplicationIds, productApplicationId];
    onChange({ ...values, productApplicationIds: next });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <FieldGroup>
      <Field>
        <FieldLabel htmlFor="name">Nama Proyek</FieldLabel>
        <Input
          id="name"
          value={values.name}
          onChange={(e) => onChange({ ...values, name: e.target.value })}
          placeholder="Nama proyek"
          aria-invalid={!!errors.portofolioName}
        />
        <FieldError
          errors={
            errors.portofolioName ? [{ message: errors.portofolioName }] : []
          }
        />
      </Field>
      <Field>
        <FieldLabel>Kategori</FieldLabel>
        <Combobox
          items={categories}
          itemToStringLabel={(c) => c.categoryPortofolioName}
          itemToStringValue={(c) => c.categoryPortofolioId}
          isItemEqualToValue={(a, b) =>
            a?.categoryPortofolioId === b?.categoryPortofolioId
          }
          value={selectedCategory}
          onValueChange={(c) =>
            onChange({
              ...values,
              categoryId: c?.categoryPortofolioId ?? "",
            })
          }
        >
          <ComboboxInput
            placeholder="Pilih kategori"
            className="w-full"
            aria-invalid={!!errors.categoryPortofolioId}
          />
          <ComboboxContent>
            <ComboboxEmpty>Tidak ada kategori ditemukan.</ComboboxEmpty>
            <ComboboxList>
              {(c) => (
                <ComboboxItem key={c.categoryPortofolioId} value={c}>
                  {c.categoryPortofolioName}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
      <Field>
        <FieldLabel>Tipe Portofolio (Aplikasi Penggunaan)</FieldLabel>
        <Combobox
          items={portofolioTypes}
          itemToStringLabel={(t) => t.portofolioTypeName}
          itemToStringValue={(t) => t.portofolioTypeId}
          isItemEqualToValue={(a, b) =>
            a?.portofolioTypeId === b?.portofolioTypeId
          }
          value={selectedPortofolioType}
          onValueChange={(t) =>
            onChange({
              ...values,
              portofolioTypeId: t?.portofolioTypeId ?? "",
            })
          }
        >
          <ComboboxInput
            placeholder="Pilih tipe (Gedung perkantoran, Hotel, dll)"
            className="w-full"
            aria-invalid={!!errors.portofolioTypeId}
          />
          <ComboboxContent>
            <ComboboxEmpty>Tidak ada tipe ditemukan.</ComboboxEmpty>
            <ComboboxList>
              {(t) => (
                <ComboboxItem key={t.portofolioTypeId} value={t}>
                  {t.portofolioTypeName}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
      <Field>
        <FieldLabel htmlFor="shortDescription">Deskripsi Singkat</FieldLabel>
        <Input
          id="shortDescription"
          value={values.shortDescription}
          onChange={(e) =>
            onChange({ ...values, shortDescription: e.target.value })
          }
          placeholder="Ringkasan proyek (untuk card/list, maks 500 karakter)"
          className="resize-none"
          aria-invalid={!!errors.portofolioShortDescription}
        />
        <FieldError
          errors={
            errors.portofolioShortDescription
              ? [{ message: errors.portofolioShortDescription }]
              : []
          }
        />
      </Field>
      <Field>
        <FieldLabel>Gambar Cover</FieldLabel>
        <ImageUploadField
          value={values.image}
          onChange={(image) => onChange({ ...values, image })}
          error={errors.portofolioImageUrl}
          folder="portofolio"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="about">Tentang Proyek</FieldLabel>
        <RichTextEditor
          value={values.about}
          onChange={(content) => onChange({ ...values, about: content })}
          placeholder="Deskripsi proyek..."
          minHeight="200px"
        />
        <FieldError
          errors={
            errors.portofolioAbout ? [{ message: errors.portofolioAbout }] : []
          }
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="location">Lokasi</FieldLabel>
        <Input
          id="location"
          value={values.location}
          onChange={(e) => onChange({ ...values, location: e.target.value })}
          placeholder="Kota"
          aria-invalid={!!errors.portofolioLocation}
        />
        <FieldError
          errors={
            errors.portofolioLocation
              ? [{ message: errors.portofolioLocation }]
              : []
          }
        />
      </Field>
      {productApplications.length > 0 && (
        <Field>
          <FieldLabel>Aplikasi Kaca Yang Digunakan</FieldLabel>
          <div className="rounded-md border p-3 space-y-2 max-h-48 overflow-y-auto">
            {productApplications.map((pa) => (
              <label
                key={pa.productApplicationId}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  checked={values.productApplicationIds.includes(pa.productApplicationId)}
                  onCheckedChange={() => toggleProductApplication(pa.productApplicationId)}
                />
                <span className="text-sm">
                  {pa.productApplicationName}
                  {pa.productName && (
                    <span className="text-muted-foreground">
                      {" "}
                      ({pa.productName})
                    </span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </Field>
      )}
      <Field orientation="horizontal">
        <Checkbox
          id="published"
          checked={values.published}
          onCheckedChange={(v) => onChange({ ...values, published: !!v })}
        />
        <FieldLabel htmlFor="published">Publikasikan</FieldLabel>
      </Field>
    </FieldGroup>

      <div className="lg:sticky lg:top-4">
        <p className="text-muted-foreground mb-3 text-sm font-medium">
          Preview Tampilan Card Portofolio
        </p>
        <PortofolioFormPreviewCard
          portofolioName={values.name}
          shortDescription={values.shortDescription}
          imageUrl={values.image?.url ?? null}
          categoryName={selectedCategory?.categoryPortofolioName ?? null}
          portofolioLocation={values.location}
          portofolioSlug={portofolioSlug}
        />
      </div>
    </div>
  );
}
