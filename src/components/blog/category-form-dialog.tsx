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

export type CategoryFormValues = {
  categoryBlogName: string;
  categoryBlogSlug: string;
};

type CategoryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  defaultValues: CategoryFormValues;
  onSubmit: (values: CategoryFormValues) => void | Promise<void>;
  submitting: boolean;
  errors: Record<string, string>;
};

export function CategoryFormDialog({
  open,
  onOpenChange,
  title,
  defaultValues,
  onSubmit,
  submitting,
  errors,
}: CategoryFormDialogProps) {
  const [name, setName] = React.useState(defaultValues.categoryBlogName);

  React.useEffect(() => {
    if (open) {
      setName(defaultValues.categoryBlogName);
    }
  }, [open, defaultValues.categoryBlogName]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const categoryBlogSlug = slugify(name);
    onSubmit({ categoryBlogName: name.trim(), categoryBlogSlug });
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
                placeholder="Contoh: Manufacturing"
                aria-invalid={!!errors.categoryBlogName}
              />
              <FieldError
                errors={
                  errors.categoryBlogName
                    ? [{ message: errors.categoryBlogName }]
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
