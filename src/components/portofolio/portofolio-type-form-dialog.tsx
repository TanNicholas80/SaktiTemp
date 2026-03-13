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
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type PortofolioTypeFormValues = {
  portofolioTypeName: string;
};

type PortofolioTypeFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  defaultValues: PortofolioTypeFormValues;
  onSubmit: (values: PortofolioTypeFormValues) => void | Promise<void>;
  submitting: boolean;
  errors: Record<string, string>;
};

export function PortofolioTypeFormDialog({
  open,
  onOpenChange,
  title,
  defaultValues,
  onSubmit,
  submitting,
  errors,
}: PortofolioTypeFormDialogProps) {
  const [name, setName] = React.useState(defaultValues.portofolioTypeName);

  React.useEffect(() => {
    if (open) {
      setName(defaultValues.portofolioTypeName);
    }
  }, [open, defaultValues.portofolioTypeName]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({ portofolioTypeName: name.trim() });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="portofolioTypeName">Nama Tipe</FieldLabel>
            <Input
              id="portofolioTypeName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Gedung perkantoran"
              aria-invalid={!!errors.portofolioTypeName}
            />
            <FieldError
              errors={
                errors.portofolioTypeName
                  ? [{ message: errors.portofolioTypeName }]
                  : []
              }
            />
          </Field>
          <div className="flex justify-end gap-2">
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
