"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Trash2Icon, ExternalLink } from "lucide-react";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
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
import { ProductFormPreviewCard } from "./product-form-preview-card";
import type {
  CategoryProductOption,
  PortofolioOption,
} from "./types";

export type ThicknessOption = {
  thicknessId: string;
  thicknessValue: number;
  thicknessUnit: string;
};

export type ProductFormValues = {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: { url: string; publicId: string } | null;
  categoryId: string;
  thicknessIds: string[];
  excellences: { productExellenceDescription: string }[];
  published: boolean;
};

type ProductFormProps = {
  values: ProductFormValues;
  onChange: (values: ProductFormValues) => void;
  errors: Record<string, string>;
  categories: CategoryProductOption[];
  /** Daftar ketebalan master (dari /api/admin/thickness) */
  thicknessOptions: ThicknessOption[];
  /** Daftar portofolio read-only (diturunkan dari product applications, hanya tampil saat edit) */
  portofolios: PortofolioOption[];
  /** Slug produk untuk link preview (hanya saat edit) */
  productSlug?: string;
};

export function ProductForm({
  values,
  onChange,
  errors,
  categories,
  thicknessOptions,
  portofolios,
  productSlug,
}: ProductFormProps) {
  React.useEffect(() => {
    const newSlug = slugify(values.name);
    if (newSlug !== values.slug) {
      onChange({ ...values, slug: newSlug });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.name]);

  const selectedCategory = React.useMemo(
    () =>
      categories.find((c) => c.categoryProductId === values.categoryId) ?? null,
    [categories, values.categoryId]
  );

  function toggleThickness(thicknessId: string) {
    const next = values.thicknessIds.includes(thicknessId)
      ? values.thicknessIds.filter((id) => id !== thicknessId)
      : [...values.thicknessIds, thicknessId];
    onChange({ ...values, thicknessIds: next });
  }

  function selectAllThickness() {
    const allIds = thicknessOptions.map((t) => t.thicknessId);
    onChange({ ...values, thicknessIds: allIds });
  }

  function clearThickness() {
    onChange({ ...values, thicknessIds: [] });
  }

  function addExcellence() {
    onChange({
      ...values,
      excellences: [...values.excellences, { productExellenceDescription: "" }],
    });
  }

  function removeExcellence(index: number) {
    onChange({
      ...values,
      excellences: values.excellences.filter((_, i) => i !== index),
    });
  }

  function updateExcellence(index: number, description: string) {
    const next = [...values.excellences];
    next[index] = { productExellenceDescription: description };
    onChange({ ...values, excellences: next });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <FieldGroup>
      <Field>
        <FieldLabel htmlFor="name">Nama Produk</FieldLabel>
        <Input
          id="name"
          value={values.name}
          onChange={(e) => onChange({ ...values, name: e.target.value })}
          placeholder="Nama produk"
          aria-invalid={!!errors.productName}
        />
        <FieldError
          errors={errors.productName ? [{ message: errors.productName }] : []}
        />
      </Field>
      <Field>
        <FieldLabel>Kategori</FieldLabel>
        <Combobox
          items={categories}
          itemToStringLabel={(c) => c.categoryProductName}
          itemToStringValue={(c) => c.categoryProductId}
          isItemEqualToValue={(a, b) =>
            a?.categoryProductId === b?.categoryProductId
          }
          value={selectedCategory}
          onValueChange={(c) =>
            onChange({
              ...values,
              categoryId: c?.categoryProductId ?? "",
            })
          }
        >
          <ComboboxInput
            placeholder="Pilih kategori"
            className="w-full"
            aria-invalid={!!errors.categoryProductId}
          />
          <ComboboxContent>
            <ComboboxEmpty>Tidak ada kategori ditemukan.</ComboboxEmpty>
            <ComboboxList>
              {(c) => (
                <ComboboxItem key={c.categoryProductId} value={c}>
                  {c.categoryProductName}
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
          placeholder="Ringkasan produk (untuk card/list, maks 500 karakter)"
          className="resize-none"
          aria-invalid={!!errors.productShortDescription}
        />
        <FieldError
          errors={
            errors.productShortDescription
              ? [{ message: errors.productShortDescription }]
              : []
          }
        />
      </Field>
      <Field>
        <FieldLabel>Gambar Produk</FieldLabel>
        <ImageUploadField
          value={values.image}
          onChange={(image) => onChange({ ...values, image })}
          error={errors.productImageUrl}
          folder="product"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
        <RichTextEditor
          value={values.description}
          onChange={(content) => onChange({ ...values, description: content })}
          placeholder="Deskripsi produk..."
          minHeight="200px"
        />
        <FieldError
          errors={
            errors.productDescription
              ? [{ message: errors.productDescription }]
              : []
          }
        />
      </Field>

      <Field>
        <div className="flex items-center justify-between">
          <FieldLabel>Ketebalan Tersedia</FieldLabel>
          {thicknessOptions.length > 0 && (
            <div className="flex gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={selectAllThickness}
              >
                Select All
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearThickness}
              >
                Clear Select
              </Button>
            </div>
          )}
        </div>
        {thicknessOptions.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Belum ada ketebalan. Tambahkan di{" "}
            <Link
              href="/admin/thickness"
              className="text-primary hover:underline"
            >
              Kelola Ketebalan
            </Link>
            .
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {thicknessOptions.map((t) => (
              <label
                key={t.thicknessId}
                className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <Checkbox
                  checked={values.thicknessIds.includes(t.thicknessId)}
                  onCheckedChange={() => toggleThickness(t.thicknessId)}
                />
                <span className="text-sm">
                  {t.thicknessValue} {t.thicknessUnit}
                </span>
              </label>
            ))}
          </div>
        )}
      </Field>

      <Field>
        <div className="flex items-center justify-between">
          <FieldLabel>Keunggulan Produk</FieldLabel>
          <Button type="button" variant="outline" size="sm" onClick={addExcellence}>
            <Plus className="mr-1 size-4" />
            Tambah
          </Button>
        </div>
        <div className="space-y-2">
          {values.excellences.map((e, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={e.productExellenceDescription}
                onChange={(ev) =>
                  updateExcellence(i, ev.target.value)
                }
                placeholder="Deskripsi keunggulan"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeExcellence(i)}
                className="shrink-0"
              >
                <Trash2Icon className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </Field>

      {portofolios.length > 0 && (
        <Field>
          <FieldLabel>Contoh Proyek</FieldLabel>
          <p className="text-muted-foreground text-sm mb-2">
            Portofolio yang menggunakan produk ini (dari aplikasi produk). Hubungkan via form portofolio.
          </p>
          <div className="rounded-md border p-3 space-y-2 max-h-48 overflow-y-auto">
            {portofolios.map((p) => (
              <Link
                key={p.portofolioId}
                href={`/admin/portofolio/${p.portofolioSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 text-sm hover:bg-muted/50 rounded px-2 py-1.5 -mx-2 -my-1 transition-colors"
              >
                <span>
                  {p.portofolioName}
                  {p.portofolioLocation && (
                    <span className="text-muted-foreground">
                      {" "}
                      — {p.portofolioLocation}
                    </span>
                  )}
                </span>
                <ExternalLink className="size-3.5 shrink-0" />
              </Link>
            ))}
          </div>
        </Field>
      )}

      <Field orientation="horizontal">
        <Checkbox
          id="published"
          checked={values.published}
          onCheckedChange={(v) =>
            onChange({ ...values, published: !!v })
          }
        />
        <FieldLabel htmlFor="published">Publikasikan</FieldLabel>
      </Field>
    </FieldGroup>

      <div className="lg:sticky lg:top-4">
        <p className="text-muted-foreground mb-3 text-sm font-medium">
          Preview Tampilan Card Produk
        </p>
        <ProductFormPreviewCard
          productName={values.name}
          shortDescription={values.shortDescription}
          imageUrl={values.image?.url ?? null}
          categoryName={selectedCategory?.categoryProductName ?? null}
          thicknesses={values.thicknessIds
            .map((id) => thicknessOptions.find((t) => t.thicknessId === id))
            .filter((t): t is ThicknessOption => !!t)
            .map((t) => ({
              productThicknessValue: t.thicknessValue,
              productThicknessUnit: t.thicknessUnit,
            }))}
          excellences={values.excellences.filter((e) =>
            e.productExellenceDescription.trim()
          )}
          productSlug={productSlug}
        />
      </div>
    </div>
  );
}
