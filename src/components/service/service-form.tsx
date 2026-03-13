"use client";

import * as React from "react";
import { Plus, Trash2Icon } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconPreviewCard } from "@/components/shared/icon-preview-card";

export const SERVICE_ICON_OPTIONS = [
  { value: "Wrench", label: "Wrench (Kunci)" },
  { value: "Package", label: "Package (Kotak)" },
  { value: "Ruler", label: "Ruler (Penggaris)" },
  { value: "ShieldCheck", label: "Shield Check (Perlindungan)" },
  { value: "Truck", label: "Truck (Pengiriman)" },
  { value: "Scissors", label: "Scissors (Gunting)" },
] as const;

export type ServiceFormValues = {
  name: string;
  description: string;
  icon: string;
  points: string[];
  btnText: string;
  btnLink: string;
  published: boolean;
};

type ServiceFormProps = {
  values: ServiceFormValues;
  onChange: (values: ServiceFormValues) => void;
  errors: Record<string, string>;
};

export function ServiceForm({
  values,
  onChange,
  errors,
}: ServiceFormProps) {
  function addPoint() {
    onChange({
      ...values,
      points: [...values.points, ""],
    });
  }

  function removePoint(index: number) {
    onChange({
      ...values,
      points: values.points.filter((_, i) => i !== index),
    });
  }

  function updatePoint(index: number, text: string) {
    const next = [...values.points];
    next[index] = text;
    onChange({ ...values, points: next });
  }

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="name">Nama Layanan</FieldLabel>
        <Input
          id="name"
          value={values.name}
          onChange={(e) => onChange({ ...values, name: e.target.value })}
          placeholder="Contoh: Jasa Temper"
          aria-invalid={!!errors.serviceName}
        />
        <FieldError
          errors={
            errors.serviceName ? [{ message: errors.serviceName }] : []
          }
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
        <Textarea
          id="description"
          value={values.description}
          onChange={(e) => onChange({ ...values, description: e.target.value })}
          placeholder="Deskripsi layanan"
          rows={3}
          className="resize-none"
          aria-invalid={!!errors.serviceDescription}
        />
        <FieldError
          errors={
            errors.serviceDescription
              ? [{ message: errors.serviceDescription }]
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
            aria-invalid={!!errors.serviceIcon}
          >
            <SelectValue placeholder="Pilih icon" />
          </SelectTrigger>
          <SelectContent>
            {SERVICE_ICON_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError
          errors={
            errors.serviceIcon ? [{ message: errors.serviceIcon }] : []
          }
        />
        <div className="mt-3">
          <IconPreviewCard
            iconName={values.icon}
            title={values.name}
            description={values.description}
            variant="service"
          />
        </div>
      </Field>

      <Field>
        <div className="flex items-center justify-between">
          <FieldLabel>Poin Layanan (Fitur)</FieldLabel>
          <Button type="button" variant="outline" size="sm" onClick={addPoint}>
            <Plus className="mr-1 size-4" />
            Tambah
          </Button>
        </div>
        <div className="space-y-2">
          {values.points.map((p, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={p}
                onChange={(ev) => updatePoint(i, ev.target.value)}
                placeholder="Deskripsi poin fitur"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removePoint(i)}
                className="shrink-0"
              >
                <Trash2Icon className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="btnText">Teks Tombol CTA</FieldLabel>
        <Input
          id="btnText"
          value={values.btnText}
          onChange={(e) => onChange({ ...values, btnText: e.target.value })}
          placeholder="Contoh: Konsultasi Jasa Temper"
          aria-invalid={!!errors.serviceBtnText}
        />
        <FieldError
          errors={
            errors.serviceBtnText ? [{ message: errors.serviceBtnText }] : []
          }
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="btnLink">Link Tombol CTA</FieldLabel>
        <Input
          id="btnLink"
          type="url"
          value={values.btnLink}
          onChange={(e) => onChange({ ...values, btnLink: e.target.value })}
          placeholder="https://..."
          aria-invalid={!!errors.serviceBtnLink}
        />
        <FieldError
          errors={
            errors.serviceBtnLink ? [{ message: errors.serviceBtnLink }] : []
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
