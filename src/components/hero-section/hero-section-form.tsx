"use client";

import { Plus, Trash2 } from "lucide-react";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { HeroSectionPreview } from "./hero-section-preview";

export type BreadcrumbItem = { label: string; href: string };

export type HeroSectionFormValues = {
  pageKey: string;
  preHeading: string;
  mainHeading: string;
  subHeading: string;
  description: string;
  image: { url: string; publicId: string } | null;
  breadcrumbItems: BreadcrumbItem[];
  scrollIndicatorText: string;
  scrollIndicatorVisible: boolean;
  published: boolean;
};

type HeroSectionFormProps = {
  values: HeroSectionFormValues;
  onChange: (values: HeroSectionFormValues) => void;
  errors: Record<string, string>;
};

export function HeroSectionForm({
  values,
  onChange,
  errors,
}: HeroSectionFormProps) {
  function addBreadcrumb() {
    onChange({
      ...values,
      breadcrumbItems: [
        ...values.breadcrumbItems,
        { label: "", href: "/" },
      ],
    });
  }

  function removeBreadcrumb(index: number) {
    onChange({
      ...values,
      breadcrumbItems: values.breadcrumbItems.filter((_, i) => i !== index),
    });
  }

  function updateBreadcrumb(
    index: number,
    field: "label" | "href",
    value: string
  ) {
    const next = [...values.breadcrumbItems];
    next[index] = { ...next[index], [field]: value };
    onChange({ ...values, breadcrumbItems: next });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="pageKey">Page Key</FieldLabel>
          <Input
            id="pageKey"
            value={values.pageKey}
            onChange={(e) =>
              onChange({
                ...values,
                pageKey: e.target.value.replace(/[^a-z0-9_-]/gi, ""),
              })
            }
            placeholder="contact, products, home"
            aria-invalid={!!errors.pageKey}
          />
          <FieldError
            errors={errors.pageKey ? [{ message: errors.pageKey }] : []}
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Unik, huruf kecil, angka, underscore, strip (contoh: contact, products)
          </p>
        </Field>

        <Field>
          <FieldLabel htmlFor="preHeading">Pre-heading (opsional)</FieldLabel>
          <Input
            id="preHeading"
            value={values.preHeading}
            onChange={(e) =>
              onChange({ ...values, preHeading: e.target.value })
            }
            placeholder="CONTACT US"
            aria-invalid={!!errors.preHeading}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="mainHeading">Main Heading</FieldLabel>
          <Input
            id="mainHeading"
            value={values.mainHeading}
            onChange={(e) =>
              onChange({ ...values, mainHeading: e.target.value })
            }
            placeholder="Hubungi Kami"
            aria-invalid={!!errors.mainHeading}
          />
          <FieldError
            errors={errors.mainHeading ? [{ message: errors.mainHeading }] : []}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="subHeading">Sub-heading</FieldLabel>
          <Input
            id="subHeading"
            value={values.subHeading}
            onChange={(e) =>
              onChange({ ...values, subHeading: e.target.value })
            }
            placeholder="Untuk Pertanyaan Dan Dukungan"
            aria-invalid={!!errors.subHeading}
          />
          <FieldError
            errors={
              errors.subHeading ? [{ message: errors.subHeading }] : []
            }
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
          <Textarea
            id="description"
            value={values.description}
            onChange={(e) =>
              onChange({ ...values, description: e.target.value })
            }
            placeholder="Paragraf deskripsi hero section"
            rows={4}
            className="resize-none"
            aria-invalid={!!errors.description}
          />
          <FieldError
            errors={
              errors.description ? [{ message: errors.description }] : []
            }
          />
        </Field>

        <Field>
          <FieldLabel>Gambar Background</FieldLabel>
          <ImageUploadField
            value={values.image}
            onChange={(img) => onChange({ ...values, image: img })}
            folder="hero"
            error={
              errors.backgroundImageUrl ??
              errors.backgroundImagePublicId ??
              undefined
            }
          />
        </Field>

        <Field>
          <FieldLabel>Breadcrumb (opsional)</FieldLabel>
          <div className="space-y-2">
            {values.breadcrumbItems.map((item, i) => (
              <div
                key={i}
                className="flex gap-2 rounded-lg border p-3"
              >
                <Input
                  placeholder="Label"
                  value={item.label}
                  onChange={(e) =>
                    updateBreadcrumb(i, "label", e.target.value)
                  }
                  className="flex-1"
                />
                <Input
                  placeholder="/products"
                  value={item.href}
                  onChange={(e) =>
                    updateBreadcrumb(i, "href", e.target.value)
                  }
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeBreadcrumb(i)}
                  aria-label="Hapus breadcrumb"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addBreadcrumb}
            >
              <Plus className="mr-2 size-4" />
              Tambah Breadcrumb
            </Button>
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="scrollIndicatorText">
            Teks Indikator Scroll
          </FieldLabel>
          <Input
            id="scrollIndicatorText"
            value={values.scrollIndicatorText}
            onChange={(e) =>
              onChange({ ...values, scrollIndicatorText: e.target.value })
            }
            placeholder="SCROLL"
          />
        </Field>

        <Field orientation="horizontal">
          <Checkbox
            id="scrollVisible"
            checked={values.scrollIndicatorVisible}
            onCheckedChange={(v) =>
              onChange({ ...values, scrollIndicatorVisible: !!v })
            }
          />
          <FieldLabel htmlFor="scrollVisible">
            Tampilkan indikator scroll
          </FieldLabel>
        </Field>

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
        <p className="text-muted-foreground mb-2 text-sm font-medium">
          Preview
        </p>
        <HeroSectionPreview
          preHeading={values.preHeading || null}
          mainHeading={values.mainHeading}
          subHeading={values.subHeading}
          description={values.description}
          imageUrl={values.image?.url ?? null}
          breadcrumbItems={
            values.breadcrumbItems.filter((b) => b.label || b.href).length > 0
              ? values.breadcrumbItems
              : null
          }
          scrollIndicatorText={values.scrollIndicatorText}
          scrollIndicatorVisible={values.scrollIndicatorVisible}
          variant="full"
        />
      </div>
    </div>
  );
}
