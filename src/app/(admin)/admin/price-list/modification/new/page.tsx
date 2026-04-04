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
  ModificationForm,
  newModificationRow,
  type ModificationFormValues,
} from "@/components/price-list/modification-form";
import type { Option } from "@/components/price-list/glass-price-form";
import { createModificationBatchSchema } from "@/lib/validations/modification";

type ThicknessApiRow = {
  thicknessId: string;
  thicknessValue: number;
  thicknessUnit: string;
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

export default function NewModificationPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {}
  );
  const [thicknessOptions, setThicknessOptions] = React.useState<Option[]>([]);
  const [values, setValues] = React.useState<ModificationFormValues | null>(
    null
  );

  React.useEffect(() => {
    fetch("/api/admin/thickness")
      .then(async (res) => {
        if (!res.ok) throw new Error("Gagal");
        const thJson = (await res.json()) as ThicknessApiRow[];
        const thOpts = thJson
          .slice()
          .sort((a, b) => a.thicknessValue - b.thicknessValue)
          .map((x) => ({
            value: x.thicknessId,
            label: `${x.thicknessValue} ${x.thicknessUnit}`,
          }));
        setThicknessOptions(thOpts);
        setValues({
          name: "",
          image: null,
          rows: [newModificationRow(thOpts)],
        });
      })
      .catch(() => toast.error("Gagal memuat ketebalan"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values) return;
    setFormErrors({});

    const rows = values.rows.map((r) => {
      const price = toNumber(r.pricePerSide);
      return {
        thicknessId: r.thicknessId,
        pricePerSide: price ?? NaN,
      };
    });

    for (let i = 0; i < rows.length; i++) {
      if (Number.isNaN(rows[i]!.pricePerSide)) {
        const rowErr = {
          [`rows.${i}.pricePerSide`]: "Harga per sisi tidak valid",
        };
        setFormErrors(rowErr);
        toastClientValidationErrors(rowErr);
        return;
      }
    }

    const data = {
      name: values.name.trim(),
      modificationImageUrl: values.image?.url ?? "",
      modificationImagePublicId: values.image?.publicId ?? "",
      rows,
    };

    const parsed = createModificationBatchSchema.safeParse(data);
    if (!parsed.success) {
      const clientErr = issuesToErrorMap(parsed.error.issues);
      setFormErrors(clientErr);
      toastClientValidationErrors(clientErr);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/modifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal membuat modifikasi");
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
          ? `${n} baris modifikasi berhasil dibuat`
          : "Modifikasi berhasil dibuat"
      );
      router.push("/admin/price-list/modification");
    } catch {
      toast.error("Gagal membuat modifikasi");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !values) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Tambah Pricelist Modifikasi"
        description="Tambah opsi modifikasi dengan gambar dan harga per sisi (beberapa ketebalan sekaligus)"
        backHref="/admin/price-list/modification"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <ModificationForm
          values={values}
          onChange={setValues}
          errors={formErrors}
          thicknessOptions={thicknessOptions}
        />
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={submitting || thicknessOptions.length === 0}
          >
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/price-list/modification">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
