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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconPreviewCard } from "@/components/shared/icon-preview-card";

export const BENEFIT_ICON_OPTIONS = [
  { value: "Target", label: "Target (Presisi)" },
  { value: "ShieldCheck", label: "Shield Check (Kualitas)" },
  { value: "Users", label: "Users (Partner)" },
  { value: "Star", label: "Star (Custom)" },
  { value: "Wrench", label: "Wrench (Teknisi)" },
  { value: "Package", label: "Package (Produk)" },
] as const;

export type BenefitFormValues = {
  name: string;
  description: string;
  icon: string;
  published: boolean;
};

type BenefitFormProps = {
  values: BenefitFormValues;
  onChange: (values: BenefitFormValues) => void;
  errors: Record<string, string>;
};

export function BenefitForm({
  values,
  onChange,
  errors,
}: BenefitFormProps) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="name">Nama Keunggulan</FieldLabel>
        <Input
          id="name"
          value={values.name}
          onChange={(e) => onChange({ ...values, name: e.target.value })}
          placeholder="Contoh: Precision Manufacturing"
          aria-invalid={!!errors.benefitName}
        />
        <FieldError
          errors={
            errors.benefitName ? [{ message: errors.benefitName }] : []
          }
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
        <Textarea
          id="description"
          value={values.description}
          onChange={(e) => onChange({ ...values, description: e.target.value })}
          placeholder="Deskripsi keunggulan"
          rows={4}
          className="resize-none"
          aria-invalid={!!errors.benefitDescription}
        />
        <FieldError
          errors={
            errors.benefitDescription
              ? [{ message: errors.benefitDescription }]
              : []
          }
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="icon">Icon</FieldLabel>
        <Select
          value={values.icon}
          onValueChange={(v) => onChange({ ...values, icon: v })}
        >
          <SelectTrigger
            id="icon"
            className="w-full"
            aria-invalid={!!errors.benefitIcon}
          >
            <SelectValue placeholder="Pilih icon" />
          </SelectTrigger>
          <SelectContent>
            {BENEFIT_ICON_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError
          errors={
            errors.benefitIcon ? [{ message: errors.benefitIcon }] : []
          }
        />
        <div className="mt-3">
          <IconPreviewCard
            iconName={values.icon}
            title={values.name}
            description={values.description}
            variant="benefit"
          />
        </div>
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
