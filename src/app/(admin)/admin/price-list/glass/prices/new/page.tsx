"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import { LoadingState } from "@/components/layout/loading-state";
import {
  GlassPriceForm,
  newRow,
  type GlassPriceFormValues,
  type Option,
} from "@/components/price-list/glass-price-form";
import { createGlassPriceBatchSchema } from "@/lib/validations/glass-prices";
import type { ZodIssue } from "zod";

type GlassTypeApiRow = { glassTypeId: string; glassTypeName: string };
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

export default function NewGlassPricePage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {}
  );

  const [glassTypeOptions, setGlassTypeOptions] = React.useState<Option[]>([]);
  const [thicknessOptions, setThicknessOptions] = React.useState<Option[]>([]);

  const [values, setValues] = React.useState<GlassPriceFormValues | null>(null);

  React.useEffect(() => {
    Promise.all([fetch("/api/admin/glass-types"), fetch("/api/admin/thickness")])
      .then(async ([gt, th]) => {
        if (!gt.ok || !th.ok) throw new Error("Gagal memuat opsi");
        const gtJson = (await gt.json()) as GlassTypeApiRow[];
        const thJson = (await th.json()) as ThicknessApiRow[];

        const gtOpts = gtJson
          .slice()
          .sort((a, b) => a.glassTypeName.localeCompare(b.glassTypeName))
          .map((x) => ({ value: x.glassTypeId, label: x.glassTypeName }));

        const thOpts = thJson
          .slice()
          .sort((a, b) => a.thicknessValue - b.thicknessValue)
          .map((x) => ({
            value: x.thicknessId,
            label: `${x.thicknessValue} ${x.thicknessUnit}`,
          }));

        setGlassTypeOptions(gtOpts);
        setThicknessOptions(thOpts);
        setValues({
          glassTypeId: gtOpts[0]?.value ?? "",
          variant: "",
          image: null,
          rows: [newRow(thOpts)],
        });
      })
      .catch(() => toast.error("Gagal memuat opsi form"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values) return;
    setFormErrors({});

    const rows = values.rows.map((r) => {
      const price = toNumber(r.pricePerSqm);
      return {
        thicknessId: r.thicknessId,
        composition: r.composition ?? "",
        compositionDetail: r.compositionDetail ?? "",
        pricePerSqm: price ?? NaN,
      };
    });

    for (let i = 0; i < rows.length; i++) {
      if (Number.isNaN(rows[i]!.pricePerSqm)) {
        setFormErrors({
          [`rows.${i}.pricePerSqm`]: "Harga per m2 tidak valid",
        });
        return;
      }
    }

    const data = {
      glassTypeId: values.glassTypeId,
      variant: values.variant.trim(),
      variantImageUrl: values.image?.url ?? "",
      variantImagePublicId: values.image?.publicId ?? "",
      rows,
    };

    const parsed = createGlassPriceBatchSchema.safeParse(data);
    if (!parsed.success) {
      setFormErrors(issuesToErrorMap(parsed.error.issues));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/glass-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal membuat pricelist kaca");
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

      const n =
        typeof json.created === "number" ? json.created : 1;
      toast.success(
        n > 1
          ? `${n} baris pricelist kaca berhasil dibuat`
          : "Pricelist kaca berhasil dibuat"
      );
      router.push("/admin/price-list/glass");
    } catch {
      toast.error("Gagal membuat pricelist kaca");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !values) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Tambah Pricelist Kaca"
        description="Satu variant dan gambar; beberapa ketebalan sekaligus dengan harga (dan komposisi opsional) per baris"
        backHref="/admin/price-list/glass"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <GlassPriceForm
          values={values}
          onChange={setValues}
          errors={formErrors}
          glassTypeOptions={glassTypeOptions}
          thicknessOptions={thicknessOptions}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/price-list/glass">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
