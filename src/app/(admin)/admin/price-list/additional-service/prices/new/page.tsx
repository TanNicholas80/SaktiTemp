"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  toastApiValidationError,
  toastClientValidationErrors,
} from "@/lib/utils/toast-form";
import type { ZodIssue } from "zod";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import { LoadingState } from "@/components/layout/loading-state";
import {
  ProcessingPriceForm,
  newProcessingPriceRow,
  type ProcessingPriceFormValues,
} from "@/components/price-list/processing-price-form";
import type { Option } from "@/components/price-list/glass-price-form";
import { createProcessingPriceBatchSchema } from "@/lib/validations/processing-prices";

type CategoryApiRow = {
  processingCategoryId: string;
  categoryName: string;
};

function toNumber(value: string): number | null {
  const normalized = value.replaceAll(".", "").replaceAll(",", ".").trim();
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

function issuesToErrorMap(issues: ZodIssue[]): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const path = issue.path.map(String).join(".");
    if (path && !errors[path]) errors[path] = issue.message;
  }
  return errors;
}

export default function NewProcessingPricePage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {}
  );
  const [categoryOptions, setCategoryOptions] = React.useState<Option[]>([]);
  const [values, setValues] = React.useState<ProcessingPriceFormValues | null>(
    null
  );

  React.useEffect(() => {
    fetch("/api/admin/processing-categories")
      .then(async (res) => {
        if (!res.ok) throw new Error("Gagal");
        const json = (await res.json()) as CategoryApiRow[];
        const opts = json
          .slice()
          .sort((a, b) => a.categoryName.localeCompare(b.categoryName))
          .map((x) => ({
            value: x.processingCategoryId,
            label: x.categoryName,
          }));
        setCategoryOptions(opts);
        setValues({
          categoryId: opts[0]?.value ?? "",
          serviceName: "",
          unit: "sqm",
          rows: [newProcessingPriceRow()],
        });
      })
      .catch(() => toast.error("Gagal memuat kategori"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values) return;
    setFormErrors({});

    const rows = values.rows.map((r) => {
      const priceNum = toNumber(r.price);
      if (r.mode === "single") {
        const thicknessNum = toNumber(r.thickness);
        return {
          mode: "single" as const,
          thickness: thicknessNum ?? NaN,
          price: priceNum ?? NaN,
        };
      }

      const min = toNumber(r.minThickness);
      const max = toNumber(r.maxThickness);
      return {
        mode: "range" as const,
        minThickness: min ?? NaN,
        maxThickness: max ?? NaN,
        price: priceNum ?? NaN,
      };
    });

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]!;
      const msgs: Record<string, string> = {};
      if (row.mode === "single") {
        if (Number.isNaN(row.thickness)) {
          msgs[`rows.${i}.thickness`] = "Nilai tidak valid";
        }
      } else {
        if (Number.isNaN(row.minThickness)) {
          msgs[`rows.${i}.minThickness`] = "Nilai tidak valid";
        }
        if (Number.isNaN(row.maxThickness)) {
          msgs[`rows.${i}.maxThickness`] = "Nilai tidak valid";
        }
      }
      if (Number.isNaN(row.price)) {
        msgs[`rows.${i}.price`] = "Harga tidak valid";
      }
      if (Object.keys(msgs).length > 0) {
        setFormErrors(msgs);
        toastClientValidationErrors(msgs);
        return;
      }
    }

    const data = {
      categoryId: values.categoryId,
      serviceName: values.serviceName.trim(),
      unit: values.unit,
      rows,
    };

    const parsed = createProcessingPriceBatchSchema.safeParse(data);
    if (!parsed.success) {
      const clientErr = issuesToErrorMap(parsed.error.issues);
      setFormErrors(clientErr);
      toastClientValidationErrors(clientErr);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/processing-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal membuat pricelist");
        if (json.details?.fieldErrors) {
          setFormErrors(
            Object.fromEntries(
              Object.entries(json.details.fieldErrors).flatMap(([k, v]) => {
                const msg = Array.isArray(v) ? v[0] : String(v);
                return msg ? [[k, msg]] : [];
              })
            ) as Record<string, string>
          );
        }
        return;
      }

      const n = typeof json.created === "number" ? json.created : 1;
      toast.success(
        n > 1
          ? `${n} baris pricelist layanan tambahan berhasil dibuat`
          : "Pricelist berhasil dibuat"
      );
      router.push("/admin/price-list/additional-service");
    } catch {
      toast.error("Gagal membuat pricelist");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !values) return <LoadingState />;

  if (categoryOptions.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeaderWithBack
          title="Tambah Harga Layanan Tambahan"
          description="Harga berdasarkan kategori, ketebalan (range/tunggal), dan satuan"
          backHref="/admin/price-list/additional-service"
        />
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground mb-4 text-pretty">
            Belum ada kategori layanan tambahan. Tambahkan minimal satu kategori
            terlebih dahulu sebelum mengisi harga proses.
          </p>
          <Button asChild>
            <Link href="/admin/price-list/additional-service/categories/new">
              Tambah kategori
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Tambah Harga Layanan Tambahan"
        description="Beberapa ketebalan (range/tunggal) dan harga dalam satu penyimpanan"
        backHref="/admin/price-list/additional-service"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <ProcessingPriceForm
          values={values}
          onChange={setValues}
          errors={formErrors}
          categoryOptions={categoryOptions}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/price-list/additional-service">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
