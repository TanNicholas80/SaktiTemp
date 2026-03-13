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
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils/slug";

export type CategoryProductFormValues = {
  categoryProductName: string;
  categoryProductSlug: string;
};

type CategoryProductFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  defaultValues: CategoryProductFormValues;
  onSubmit: (values: CategoryProductFormValues) => void | Promise<void>;
  submitting: boolean;
  errors: Record<string, string>;
};

export function CategoryProductFormDialog({
  open,
  onOpenChange,
  title,
  defaultValues,
  onSubmit,
  submitting,
  errors,
}: CategoryProductFormDialogProps) {
  const [name, setName] = React.useState(defaultValues.categoryProductName);

  React.useEffect(() => {
    if (open) {
      setName(defaultValues.categoryProductName);
    }
  }, [open, defaultValues.categoryProductName]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const categoryProductSlug = slugify(name);
    onSubmit({ categoryProductName: name.trim(), categoryProductSlug });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nama</FieldLabel>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Plywood"
                aria-invalid={!!errors.categoryProductName}
              />
              <FieldError
                errors={
                  errors.categoryProductName
                    ? [{ message: errors.categoryProductName }]
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
