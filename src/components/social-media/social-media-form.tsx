"use client";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SocialMediaIconPreview } from "./social-media-icon-preview";

export const SOCIAL_MEDIA_ICON_OPTIONS = [
  { value: "Facebook", label: "Facebook" },
  { value: "Instagram", label: "Instagram" },
  { value: "Linkedin", label: "LinkedIn" },
  { value: "Youtube", label: "YouTube" },
  { value: "Tiktok", label: "TikTok" },
  { value: "Share2", label: "Share2 (lainnya)" },
] as const;

export type SocialMediaFormValues = {
  platformName: string;
  profileUrl: string;
  iconName: string;
  published: boolean;
};

type SocialMediaFormProps = {
  values: SocialMediaFormValues;
  onChange: (values: SocialMediaFormValues) => void;
  errors: Record<string, string>;
};

export function SocialMediaForm({
  values,
  onChange,
  errors,
}: SocialMediaFormProps) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="platformName">Nama Platform</FieldLabel>
        <Input
          id="platformName"
          value={values.platformName}
          onChange={(e) =>
            onChange({ ...values, platformName: e.target.value })
          }
          placeholder="Contoh: Facebook, Instagram"
          aria-invalid={!!errors.platformName}
        />
        <FieldError
          errors={errors.platformName ? [{ message: errors.platformName }] : []}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="profileUrl">URL Profil</FieldLabel>
        <Input
          id="profileUrl"
          type="url"
          value={values.profileUrl}
          onChange={(e) => onChange({ ...values, profileUrl: e.target.value })}
          placeholder="https://facebook.com/..."
          aria-invalid={!!errors.profileUrl}
        />
        <FieldError
          errors={errors.profileUrl ? [{ message: errors.profileUrl }] : []}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="iconName">Icon</FieldLabel>
        <Select
          value={values.iconName}
          onValueChange={(v) => onChange({ ...values, iconName: v })}
        >
          <SelectTrigger
            id="iconName"
            className="w-full"
            aria-invalid={!!errors.iconName}
          >
            <SelectValue placeholder="Pilih icon" />
          </SelectTrigger>
          <SelectContent>
            {SOCIAL_MEDIA_ICON_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError
          errors={errors.iconName ? [{ message: errors.iconName }] : []}
        />
        <div className="mt-3">
          <SocialMediaIconPreview
            iconName={values.iconName}
            platformName={values.platformName}
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
