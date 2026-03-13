"use client";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUploadField } from "@/components/shared/image-upload-field";

export type CertificationFormValues = {
  name: string;
  image: { url: string; publicId: string } | null;
  displayOrder: number;
  published: boolean;
};

type CertificationFormProps = {
  values: CertificationFormValues;
  onChange: (values: CertificationFormValues) => void;
  errors: Record<string, string>;
};

export function CertificationForm({
  values,
  onChange,
  errors,
}: CertificationFormProps) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="name">Nama Sertifikasi</FieldLabel>
        <Input
          id="name"
          value={values.name}
          onChange={(e) => onChange({ ...values, name: e.target.value })}
          placeholder="Contoh: ISO 9001:2015, SNI Product"
          aria-invalid={!!errors.name}
        />
        <FieldError errors={errors.name ? [{ message: errors.name }] : []} />
      </Field>

      <Field>
        <FieldLabel>Logo Sertifikasi</FieldLabel>
        <ImageUploadField
          value={values.image}
          onChange={(v) => onChange({ ...values, image: v })}
          folder="certification"
          error={errors.image}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="displayOrder">Urutan Tampilan</FieldLabel>
        <Input
          id="displayOrder"
          type="number"
          min={1}
          value={values.displayOrder}
          onChange={(e) =>
            onChange({
              ...values,
              displayOrder: Math.max(1, parseInt(e.target.value, 10) || 1),
            })
          }
          aria-invalid={!!errors.displayOrder}
        />
        <FieldError
          errors={
            errors.displayOrder ? [{ message: errors.displayOrder }] : []
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
