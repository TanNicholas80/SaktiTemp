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
import {
  parseThicknessValueInput,
  thicknessValueToInputString,
} from "@/lib/utils/thickness-input";

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
  const [value, setValue] = React.useState(() =>
    thicknessValueToInputString(defaultValues.thicknessValue)
  );
  const [unit, setUnit] = React.useState(
    defaultValues.thicknessUnit || "mm"
  );
  const [localError, setLocalError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setValue(thicknessValueToInputString(defaultValues.thicknessValue));
      setUnit(defaultValues.thicknessUnit || "mm");
      setLocalError(null);
    }
  }, [open, defaultValues.thicknessValue, defaultValues.thicknessUnit]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError(null);
    const numValue = parseThicknessValueInput(value);
    if (numValue === null) {
      setLocalError(
        "Masukkan angka positif (contoh: 5, 5.5, 6,5 atau 8)"
      );
      return;
    }
    onSubmit({
      thicknessValue: numValue,
      thicknessUnit: unit.trim(),
    });
  }

  const valueErrorMsg = errors.thicknessValue ?? localError ?? undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="thicknessValue">
              Nilai ketebalan
            </FieldLabel>
            <Input
              id="thicknessValue"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={value}
              onChange={(e) => {
                setLocalError(null);
                setValue(e.target.value);
              }}
              placeholder="5, 5.5, 6,5 …"
              aria-invalid={!!valueErrorMsg}
            />
            <FieldError
              errors={
                valueErrorMsg ? [{ message: valueErrorMsg }] : []
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
