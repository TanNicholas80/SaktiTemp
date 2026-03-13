"use client";

import * as React from "react";
import {
  Briefcase,
  Building2,
  Factory,
  FolderOpen,
  Home,
  Landmark,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { slugify } from "@/lib/utils/slug";

export const CATEGORY_PORTOFOLIO_ICON_OPTIONS = [
  { value: "FolderOpen", label: "Folder Open" },
  { value: "Briefcase", label: "Briefcase" },
  { value: "Building2", label: "Building" },
  { value: "Home", label: "Home" },
  { value: "Landmark", label: "Landmark" },
  { value: "Factory", label: "Factory" },
] as const;

const ICON_MAP: Record<string, LucideIcon> = {
  FolderOpen,
  Briefcase,
  Building2,
  Home,
  Landmark,
  Factory,
};

function CategoryPortofolioIconPreview({ iconValue }: { iconValue: string }) {
  const Icon = iconValue ? ICON_MAP[iconValue] : null;
  const label =
    CATEGORY_PORTOFOLIO_ICON_OPTIONS.find((o) => o.value === iconValue)
      ?.label ?? "Pilih ikon";

  return (
    <div className="mt-3 space-y-2">
      <span className="text-muted-foreground text-xs font-medium">
        Preview Ikon
      </span>
      <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-3 py-2">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
            Icon ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          {Icon ? (
            <Icon className="size-5" />
          ) : (
            <span className="text-xs">—</span>
          )}
        </div>
        <span className="text-muted-foreground text-sm">{label}</span>
      </div>
    </div>
  );
}

export type CategoryPortofolioFormValues = {
  categoryPortofolioName: string;
  categoryPortofolioSlug: string;
  categoryPortofolioIcon: string;
  categoryPortofolioImage: { url: string; publicId: string } | null;
  categoryPortofolioDescription: string;
};

type CategoryPortofolioFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  defaultValues: CategoryPortofolioFormValues;
  onSubmit: (values: CategoryPortofolioFormValues) => void | Promise<void>;
  submitting: boolean;
  errors: Record<string, string>;
};

export function CategoryPortofolioFormDialog({
  open,
  onOpenChange,
  title,
  defaultValues,
  onSubmit,
  submitting,
  errors,
}: CategoryPortofolioFormDialogProps) {
  const [name, setName] = React.useState(defaultValues.categoryPortofolioName);
  const [icon, setIcon] = React.useState(defaultValues.categoryPortofolioIcon);
  const [image, setImage] = React.useState<{ url: string; publicId: string } | null>(
    defaultValues.categoryPortofolioImage
  );
  const [description, setDescription] = React.useState(
    defaultValues.categoryPortofolioDescription
  );

  React.useEffect(() => {
    if (open) {
      setName(defaultValues.categoryPortofolioName);
      setIcon(defaultValues.categoryPortofolioIcon);
      setImage(defaultValues.categoryPortofolioImage);
      setDescription(defaultValues.categoryPortofolioDescription);
    }
  }, [open, defaultValues]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const categoryPortofolioSlug = slugify(name);
    onSubmit({
      categoryPortofolioName: name.trim(),
      categoryPortofolioSlug,
      categoryPortofolioIcon: icon,
      categoryPortofolioImage: image,
      categoryPortofolioDescription: description.trim(),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg sm:max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nama</FieldLabel>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Commercial"
                aria-invalid={!!errors.categoryPortofolioName}
              />
              <FieldError
                errors={
                  errors.categoryPortofolioName
                    ? [{ message: errors.categoryPortofolioName }]
                    : []
                }
              />
            </Field>
            <Field>
              <FieldLabel>Ikon</FieldLabel>
              <Select value={icon || ""} onValueChange={setIcon}>
                <SelectTrigger
                  className="w-full"
                  aria-invalid={!!errors.categoryPortofolioIcon}
                >
                  <SelectValue placeholder="Pilih ikon" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_PORTOFOLIO_ICON_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError
                errors={
                  errors.categoryPortofolioIcon
                    ? [{ message: errors.categoryPortofolioIcon }]
                    : []
                }
              />
              <CategoryPortofolioIconPreview iconValue={icon} />
            </Field>
            <Field>
              <FieldLabel>Gambar</FieldLabel>
              <ImageUploadField
                value={image}
                onChange={setImage}
                folder="category"
                error={errors.categoryPortofolioImage}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi kategori (opsional)"
                rows={3}
                className="resize-none"
                aria-invalid={!!errors.categoryPortofolioDescription}
              />
              <FieldError
                errors={
                  errors.categoryPortofolioDescription
                    ? [{ message: errors.categoryPortofolioDescription }]
                    : []
                }
              />
            </Field>
          </FieldGroup>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
