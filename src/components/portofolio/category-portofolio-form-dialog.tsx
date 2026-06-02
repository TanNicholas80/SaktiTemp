"use client";

import * as React from "react";

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
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { slugify } from "@/lib/utils/slug";

export type CategoryPortofolioFormValues = {
  categoryPortofolioName: string;
  categoryPortofolioSlug: string;
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
  const [image, setImage] = React.useState<{ url: string; publicId: string } | null>(
    defaultValues.categoryPortofolioImage
  );
  const [description, setDescription] = React.useState(
    defaultValues.categoryPortofolioDescription
  );

  React.useEffect(() => {
    if (open) {
      setName(defaultValues.categoryPortofolioName);
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
