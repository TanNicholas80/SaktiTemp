"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { toastApiValidationError, toastClientValidationErrors } from "@/lib/utils/toast-form";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import { LoadingState } from "@/components/layout/loading-state";
import {
  ProcessingPriceForm,
  newProcessingPriceRow,
  type ProcessingPriceFormValues,
  type ProcessingUnit,
} from "@/components/price-list/processing-price-form";
import type { Option } from "@/components/price-list/glass-price-form";
import { updateProcessingPriceSchema } from "@/lib/validations/processing-prices";
import type { ZodIssue } from "zod";

function issuesToEditProcessingRowErrors(
  issues: ZodIssue[]
): Record<string, string> {
  const rowFields = new Set([
    "minThickness",
    "maxThickness",
    "thickness",
    "price",
  ]);
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const head = issue.path[0];
    const sub =
      typeof head === "string" && rowFields.has(head)
        ? `rows.0.${head}`
        : issue.path.map(String).join(".");
    if (sub && !errors[sub]) errors[sub] = issue.message;
  }
  return errors;
}

type CategoryApiRow = {
  processingCategoryId: string;
  categoryName: string;
};

function toNumber(value: string): number | null {
  const normalized = value.replaceAll(".", "").replaceAll(",", ".").trim();
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

function isUnit(u: string): u is ProcessingUnit {
  return u === "m1" || u === "pcs" || u === "sqm" || u === "none";
}

export default function EditProcessingPricePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {}
  );
  const [categoryOptions, setCategoryOptions] = React.useState<Option[]>([]);
  const [values, setValues] = React.useState<ProcessingPriceFormValues>({
    categoryId: "",
    serviceName: "",
    unit: "sqm",
    rows: [],
  });

  React.useEffect(() => {
    Promise.all([
      fetch(`/api/admin/processing-prices/${id}`),
      fetch("/api/admin/processing-categories"),
    ])
      .then(async ([priceRes, catRes]) => {
        if (!priceRes.ok) throw new Error("Not found");
        if (!catRes.ok) throw new Error("Gagal kategori");

        const price = await priceRes.json();
        const catJson = (await catRes.json()) as CategoryApiRow[];
        const opts = catJson
          .slice()
          .sort((a, b) => a.categoryName.localeCompare(b.categoryName))
          .map((x) => ({
            value: x.processingCategoryId,
            label: x.categoryName,
          }));

        setCategoryOptions(opts);
        const unitRaw = price.unit as string;
        const row = newProcessingPriceRow();
        const hasThickness = typeof price.thickness === "number";
        row.mode = hasThickness ? "single" : "range";
        row.thickness = hasThickness ? String(price.thickness) : "";
        row.minThickness = hasThickness
          ? ""
          : typeof price.minThickness === "number"
            ? String(price.minThickness)
            : "";
        row.maxThickness = hasThickness
          ? ""
          : typeof price.maxThickness === "number"
            ? String(price.maxThickness)
            : "";
        row.price =
          typeof price.price === "number" ? String(price.price) : "";

        setValues({
          categoryId: price.categoryId ?? opts[0]?.value ?? "",
          serviceName: price.serviceName ?? "",
          unit: isUnit(unitRaw) ? unitRaw : "sqm",
          rows: [row],
        });
      })
      .catch(() => toast.error("Gagal memuat pricelist"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    const r = values.rows[0];
    if (!r) {
      const rowErr = { rows: "Tidak ada baris" };
      setFormErrors(rowErr);
      toastClientValidationErrors(rowErr);
      return;
    }

    const priceNum = toNumber(r.price);
    const thicknessNum = toNumber(r.thickness);
    const minNum = toNumber(r.minThickness);
    const maxNum = toNumber(r.maxThickness);

    const data =
      r.mode === "single"
        ? {
            categoryId: values.categoryId,
            mode: "single" as const,
            thickness: thicknessNum ?? NaN,
            serviceName: values.serviceName.trim(),
            unit: values.unit,
            price: priceNum ?? NaN,
          }
        : {
            categoryId: values.categoryId,
            mode: "range" as const,
            minThickness: minNum ?? NaN,
            maxThickness: maxNum ?? NaN,
            serviceName: values.serviceName.trim(),
            unit: values.unit,
            price: priceNum ?? NaN,
          };

    const parsed = updateProcessingPriceSchema.safeParse(data);
    if (!parsed.success) {
      const errors = issuesToEditProcessingRowErrors(parsed.error.issues);
      if (r.mode === "single") {
        if (Number.isNaN(thicknessNum ?? NaN)) {
          errors["rows.0.thickness"] = "Nilai tidak valid";
        }
      } else {
        if (Number.isNaN(minNum ?? NaN)) {
          errors["rows.0.minThickness"] = "Nilai tidak valid";
        }
        if (Number.isNaN(maxNum ?? NaN)) {
          errors["rows.0.maxThickness"] = "Nilai tidak valid";
        }
      }
      if (Number.isNaN(data.price)) {
        errors["rows.0.price"] = "Harga tidak valid";
      }
      setFormErrors(errors);

      toastClientValidationErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/processing-prices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal memperbarui pricelist");
        if (json.details?.fieldErrors) {
          setFormErrors(
            Object.fromEntries(
              Object.entries(json.details.fieldErrors).map(([k, v]) => [
                k,
                Array.isArray(v) ? v[0] : String(v),
              ])
            )
          );
        }
        return;
      }

      toast.success("Pricelist berhasil diperbarui");
      router.push("/admin/price-list/additional-service");
    } catch {
      toast.error("Gagal memperbarui pricelist");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Edit harga layanan tambahan"
        description="Perbarui detail harga proses"
        backHref="/admin/price-list/additional-service"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <ProcessingPriceForm
          values={values}
          onChange={setValues}
          errors={formErrors}
          categoryOptions={categoryOptions}
          allowMultipleRows={false}
        />
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={submitting || categoryOptions.length === 0}
          >
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
