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
import { ContactItemPreview } from "./contact-item-preview";

export const CONTACT_TYPE_OPTIONS = [
  { value: "phone", label: "Telepon" },
  { value: "email", label: "Email" },
  { value: "address", label: "Alamat" },
  { value: "operational_hours", label: "Jam Operasional" },
] as const;

export const CONTACT_ICON_OPTIONS = [
  { value: "Phone", label: "Phone (Telepon)" },
  { value: "Mail", label: "Mail (Email)" },
  { value: "Clock", label: "Clock (Jam)" },
  { value: "MapPin", label: "MapPin (Lokasi)" },
  { value: "WhatsApp", label: "WhatsApp (WA)" },
] as const;

export type ContactFormValues = {
  contactType: string;
  contactLabel: string;
  contactValue: string;
  contactValueExtra: string;
  contactIcon: string;
  published: boolean;
};

type ContactFormProps = {
  values: ContactFormValues;
  onChange: (values: ContactFormValues) => void;
  errors: Record<string, string>;
};

export function ContactForm({
  values,
  onChange,
  errors,
}: ContactFormProps) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="contactType">Jenis Kontak</FieldLabel>
        <Select
          value={values.contactType}
          onValueChange={(v) => onChange({ ...values, contactType: v })}
        >
          <SelectTrigger
            id="contactType"
            className="w-full"
            aria-invalid={!!errors.contactType}
          >
            <SelectValue placeholder="Pilih jenis kontak" />
          </SelectTrigger>
          <SelectContent>
            {CONTACT_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError
          errors={
            errors.contactType ? [{ message: errors.contactType }] : []
          }
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="contactLabel">Label</FieldLabel>
        <Input
          id="contactLabel"
          value={values.contactLabel}
          onChange={(e) =>
            onChange({ ...values, contactLabel: e.target.value })
          }
          placeholder="Contoh: Telepon, Email, Jam Operasional"
          aria-invalid={!!errors.contactLabel}
        />
        <FieldError
          errors={
            errors.contactLabel ? [{ message: errors.contactLabel }] : []
          }
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="contactValue">Nilai Utama</FieldLabel>
        <Input
          id="contactValue"
          value={values.contactValue}
          onChange={(e) =>
            onChange({ ...values, contactValue: e.target.value })
          }
          placeholder="Nomor telepon, email, atau baris pertama jam operasional"
          aria-invalid={!!errors.contactValue}
        />
        <FieldError
          errors={
            errors.contactValue ? [{ message: errors.contactValue }] : []
          }
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="contactValueExtra">Nilai Tambahan (opsional)</FieldLabel>
        <Textarea
          id="contactValueExtra"
          value={values.contactValueExtra}
          onChange={(e) =>
            onChange({ ...values, contactValueExtra: e.target.value })
          }
          placeholder="Baris kedua, misalnya: Sabtu: 08:00 - 14:00 WIB"
          rows={2}
          className="resize-none"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="contactIcon">Icon</FieldLabel>
        <Select
          value={values.contactIcon}
          onValueChange={(v) => onChange({ ...values, contactIcon: v })}
        >
          <SelectTrigger
            id="contactIcon"
            className="w-full"
            aria-invalid={!!errors.contactIcon}
          >
            <SelectValue placeholder="Pilih icon" />
          </SelectTrigger>
          <SelectContent>
            {CONTACT_ICON_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError
          errors={
            errors.contactIcon ? [{ message: errors.contactIcon }] : []
          }
        />
        <div className="mt-3">
          <ContactItemPreview
            iconName={values.contactIcon}
            label={values.contactLabel}
            value={values.contactValue}
            valueExtra={values.contactValueExtra || null}
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
