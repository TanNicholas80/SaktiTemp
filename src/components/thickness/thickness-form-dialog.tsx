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

export type ThicknessFormValues = {
  thicknessValue: number;
  thicknessUnit: string;
};

type ThicknessFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  defaultValues: ThicknessFormValues;
  onSubmit: (values: ThicknessFormValues) => void | Promise<void>;
  submitting: boolean;
  errors: Record<string, string>;
};

export function ThicknessFormDialog({
  open,
  onOpenChange,
  title,
  defaultValues,
  onSubmit,
  submitting,
  errors,
}: ThicknessFormDialogProps) {
  const [value, setValue] = React.useState(
    String(defaultValues.thicknessValue || "")
  );
  const [unit, setUnit] = React.useState(
    defaultValues.thicknessUnit || "mm"
  );

  React.useEffect(() => {
    if (open) {
      setValue(String(defaultValues.thicknessValue || ""));
      setUnit(defaultValues.thicknessUnit || "mm");
    }
  }, [open, defaultValues.thicknessValue, defaultValues.thicknessUnit]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const numValue = Number.parseInt(value, 10);
    if (Number.isNaN(numValue) || numValue <= 0) return;
    onSubmit({
      thicknessValue: numValue,
      thicknessUnit: unit.trim(),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="thicknessValue">Nilai (mm)</FieldLabel>
            <Input
              id="thicknessValue"
              type="number"
              min={1}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="5"
              aria-invalid={!!errors.thicknessValue}
            />
            <FieldError
              errors={
                errors.thicknessValue
                  ? [{ message: errors.thicknessValue }]
                  : []
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="thicknessUnit">Unit</FieldLabel>
            <Input
              id="thicknessUnit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="mm"
              aria-invalid={!!errors.thicknessUnit}
            />
            <FieldError
              errors={
                errors.thicknessUnit
                  ? [{ message: errors.thicknessUnit }]
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
