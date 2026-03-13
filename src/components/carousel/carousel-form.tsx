"use client";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { CarouselSlidePreview } from "./carousel-slide-preview";
import type { CarouselFormValues } from "./types";

type CarouselFormProps = {
  values: CarouselFormValues;
  onChange: (values: CarouselFormValues) => void;
  errors: Record<string, string>;
  /** Untuk preview: indeks slide saat ini (0-based) */
  slideIndex?: number;
  /** Untuk preview: total jumlah slide */
  totalSlides?: number;
};

export function CarouselForm({
  values,
  onChange,
  errors,
  slideIndex,
  totalSlides,
}: CarouselFormProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="heading">Heading</FieldLabel>
          <Input
            id="heading"
            value={values.heading}
            onChange={(e) => onChange({ ...values, heading: e.target.value })}
            placeholder="Contoh: WE UNDERSTAND"
            aria-invalid={!!errors.carouselHeading}
          />
          <FieldError
            errors={
              errors.carouselHeading ? [{ message: errors.carouselHeading }] : []
            }
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="subheading">Subheading</FieldLabel>
          <Input
            id="subheading"
            value={values.subheading}
            onChange={(e) => onChange({ ...values, subheading: e.target.value })}
            placeholder="Contoh: Your Vision"
            aria-invalid={!!errors.carouselSubheading}
          />
          <FieldError
            errors={
              errors.carouselSubheading
                ? [{ message: errors.carouselSubheading }]
                : []
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
            placeholder="Deskripsi slide carousel"
            rows={3}
            className="resize-none"
            aria-invalid={!!errors.carouselDescription}
          />
          <FieldError
            errors={
              errors.carouselDescription
                ? [{ message: errors.carouselDescription }]
                : []
            }
          />
        </Field>

        <Field>
          <FieldLabel>Gambar Background</FieldLabel>
          <ImageUploadField
            value={values.image}
            onChange={(img) => onChange({ ...values, image: img })}
            folder="carousel"
            error={
              errors.carouselImageUrl ?? errors.carouselImagePublicId ?? undefined
            }
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="order">Urutan</FieldLabel>
          <Input
            id="order"
            type="number"
            min={1}
            value={values.order}
            onChange={(e) => {
              const v = Number(e.target.value);
              onChange({
                ...values,
                order: Number.isNaN(v) || v < 1 ? 1 : v,
              });
            }}
            aria-invalid={!!errors.carouselOrder}
          />
          <FieldError
            errors={
              errors.carouselOrder ? [{ message: errors.carouselOrder }] : []
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

      <div className="lg:sticky lg:top-4">
        <p className="text-muted-foreground mb-2 text-sm font-medium">
          Preview
        </p>
        <CarouselSlidePreview
          heading={values.heading}
          subheading={values.subheading}
          description={values.description}
          imageUrl={values.image?.url ?? null}
          slideIndex={slideIndex ?? values.order}
          totalSlides={totalSlides ?? Math.max(values.order, 1)}
          displayOrder={values.order}
          variant="full"
        />
      </div>
    </div>
  );
}
