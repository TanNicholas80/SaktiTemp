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
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import type { ProductOption } from "./types";

export type ProductExcellenceFormValues = {
  productId: string;
  productExellenceDescription: string;
};

type ProductExcellenceFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  defaultValues: ProductExcellenceFormValues;
  onSubmit: (values: ProductExcellenceFormValues) => void | Promise<void>;
  submitting: boolean;
  errors: Record<string, string>;
  products: ProductOption[];
  /** Saat true, field produk dibaca saja (untuk mode edit) */
  disableProductSelect?: boolean;
};

export function ProductExcellenceFormDialog({
  open,
  onOpenChange,
  title,
  defaultValues,
  onSubmit,
  submitting,
  errors,
  products,
  disableProductSelect = false,
}: ProductExcellenceFormDialogProps) {
  const [productId, setProductId] = React.useState(defaultValues.productId);
  const [description, setDescription] = React.useState(
    defaultValues.productExellenceDescription
  );

  React.useEffect(() => {
    if (open) {
      setProductId(defaultValues.productId);
      setDescription(defaultValues.productExellenceDescription);
    }
  }, [open, defaultValues.productId, defaultValues.productExellenceDescription]);

  const selectedProduct = React.useMemo(
    () => products.find((p) => p.productId === productId) ?? null,
    [products, productId]
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({ productId, productExellenceDescription: description.trim() });
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
              <FieldLabel>Produk</FieldLabel>
              {disableProductSelect ? (
                <Input
                  value={selectedProduct?.productName ?? "-"}
                  readOnly
                  className="bg-muted"
                />
              ) : (
                <Combobox
                  items={products}
                  itemToStringLabel={(p) => p.productName}
                  itemToStringValue={(p) => p.productId}
                  isItemEqualToValue={(a, b) => a?.productId === b?.productId}
                  value={selectedProduct}
                  onValueChange={(p) => setProductId(p?.productId ?? "")}
                >
                  <ComboboxInput
                    placeholder="Pilih produk"
                    className="w-full"
                    aria-invalid={!!errors.productId}
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>Tidak ada produk ditemukan.</ComboboxEmpty>
                    <ComboboxList>
                      {(p) => (
                        <ComboboxItem key={p.productId} value={p}>
                          {p.productName}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              )}
              <FieldError
                errors={errors.productId ? [{ message: errors.productId }] : []}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Deskripsi Keunggulan</FieldLabel>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tahan lama, anti rayap, dll."
                rows={3}
                aria-invalid={!!errors.productExellenceDescription}
              />
              <FieldError
                errors={
                  errors.productExellenceDescription
                    ? [{ message: errors.productExellenceDescription }]
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
