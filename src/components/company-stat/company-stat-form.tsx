"use client";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export type CompanyStatFormValues = {
  value: string;
  label: string;
  displayOrder: number;
  published: boolean;
};

type CompanyStatFormProps = {
  values: CompanyStatFormValues;
  onChange: (values: CompanyStatFormValues) => void;
  errors: Record<string, string>;
};

export function CompanyStatForm({
  values,
  onChange,
  errors,
}: CompanyStatFormProps) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="value">Nilai</FieldLabel>
        <Input
          id="value"
          value={values.value}
          onChange={(e) => onChange({ ...values, value: e.target.value })}
          placeholder="Contoh: 15+, 500+, 99%"
          aria-invalid={!!errors.value}
        />
        <FieldError errors={errors.value ? [{ message: errors.value }] : []} />
      </Field>

      <Field>
        <FieldLabel htmlFor="label">Label</FieldLabel>
        <Input
          id="label"
          value={values.label}
          onChange={(e) => onChange({ ...values, label: e.target.value })}
          placeholder="Contoh: Tahun Pengalaman, Proyek Selesai"
          aria-invalid={!!errors.label}
        />
        <FieldError errors={errors.label ? [{ message: errors.label }] : []} />
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
