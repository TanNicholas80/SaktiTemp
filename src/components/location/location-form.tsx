"use client";

import * as React from "react";

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

/**
 * Mengekstrak URL embed dari input. Menerima:
 * - Tag iframe penuh: <iframe src="https://..."></iframe>
 * - URL embed mentah: https://www.google.com/maps/embed?pb=...
 */
function extractEmbedUrlFromInput(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  const iframeSrcMatch = trimmed.match(/<iframe[^>]+src\s*=\s*["']([^"']+)["']/i);
  if (iframeSrcMatch) return iframeSrcMatch[1].trim();
  return trimmed;
}

export type LocationFormValues = {
  city: string;
  type: "branch" | "head";
  address: string;
  mapUrl: string;
  mapEmbedUrl: string;
  published: boolean;
};

type LocationFormProps = {
  values: LocationFormValues;
  onChange: (values: LocationFormValues) => void;
  errors: Record<string, string>;
};

export function LocationForm({
  values,
  onChange,
  errors,
}: LocationFormProps) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="type">Tipe Kantor</FieldLabel>
        <Select
          value={values.type}
          onValueChange={(v) =>
            onChange({ ...values, type: v as "branch" | "head" })
          }
        >
          <SelectTrigger
            id="type"
            className="w-full"
            aria-invalid={!!errors.locationType}
          >
            <SelectValue placeholder="Pilih tipe kantor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="head">Head Office</SelectItem>
            <SelectItem value="branch">Branch Office</SelectItem>
          </SelectContent>
        </Select>
        <FieldError
          errors={
            errors.locationType ? [{ message: errors.locationType }] : []
          }
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="city">Nama Kota</FieldLabel>
        <Input
          id="city"
          value={values.city}
          onChange={(e) => onChange({ ...values, city: e.target.value })}
          placeholder="Contoh: Semarang"
          aria-invalid={!!errors.locationCity}
        />
        <FieldError
          errors={
            errors.locationCity ? [{ message: errors.locationCity }] : []
          }
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="address">Alamat Lengkap</FieldLabel>
        <Textarea
          id="address"
          value={values.address}
          onChange={(e) => onChange({ ...values, address: e.target.value })}
          placeholder="Alamat lengkap kantor"
          rows={3}
          className="resize-none"
          aria-invalid={!!errors.locationAddress}
        />
        <FieldError
          errors={
            errors.locationAddress ? [{ message: errors.locationAddress }] : []
          }
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="mapUrl">URL Google Maps (Buka Di Google Maps)</FieldLabel>
        <Input
          id="mapUrl"
          type="url"
          value={values.mapUrl}
          onChange={(e) => onChange({ ...values, mapUrl: e.target.value })}
          placeholder="https://goo.gl/maps/..."
          aria-invalid={!!errors.locationMapUrl}
        />
        <FieldError
          errors={
            errors.locationMapUrl ? [{ message: errors.locationMapUrl }] : []
          }
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="mapEmbedUrl">URL Embed Peta (iframe)</FieldLabel>
        <Textarea
          id="mapEmbedUrl"
          value={values.mapEmbedUrl}
          onChange={(e) => {
            const extracted = extractEmbedUrlFromInput(e.target.value);
            onChange({ ...values, mapEmbedUrl: extracted });
          }}
          placeholder="Tempel link embed atau tag iframe dari Google Maps (Share → Embed a map)"
          rows={3}
          className="resize-none font-mono text-sm"
          aria-invalid={!!errors.locationMapEmbedUrl}
        />
        <p className="text-muted-foreground mt-1 text-xs">
          Tempel <strong>link embed</strong> (https://www.google.com/maps/embed?pb=...) atau{" "}
          <strong>tag iframe lengkap</strong>. URL akan diekstrak otomatis dan divalidasi.
        </p>
        <FieldError
          errors={
            errors.locationMapEmbedUrl
              ? [{ message: errors.locationMapEmbedUrl }]
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
