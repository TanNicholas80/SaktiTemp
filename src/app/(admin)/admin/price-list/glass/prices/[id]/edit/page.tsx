"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
import { updateGlassPriceSchema } from "@/lib/validations/glass-prices";

type GlassTypeApiRow = { glassTypeId: string; glassTypeName: string };
type ThicknessApiRow = {
  thicknessId: string;
  thicknessValue: number;
  thicknessUnit: string;
};

type PriceApiRow = {
  glassTypeId: string;
  thicknessId: string;
  variant: string;
  variantImageUrl: string;
  variantImagePublicId: string;
  composition?: string | null;
  compositionDetail?: string | null;
  pricePerSqm: number;
};

function toNumber(value: string): number | null {
  const normalized = value.replaceAll(".", "").replaceAll(",", ".").trim();
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export default function EditGlassPricePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {}
  );

  const [glassTypeOptions, setGlassTypeOptions] = React.useState<Option[]>([]);
  const [thicknessOptions, setThicknessOptions] = React.useState<Option[]>([]);

  const [values, setValues] = React.useState<GlassPriceFormValues | null>(null);

  React.useEffect(() => {
    Promise.all([
      fetch(`/api/admin/glass-prices/${id}`),
      fetch("/api/admin/glass-types"),
      fetch("/api/admin/thickness"),
    ])
      .then(async ([priceRes, gt, th]) => {
        if (!priceRes.ok) throw new Error("Not found");
        if (!gt.ok || !th.ok) throw new Error("Gagal memuat opsi");

        const price = (await priceRes.json()) as PriceApiRow;
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

        const row = newRow(thOpts);
        row.thicknessId = price.thicknessId ?? thOpts[0]?.value ?? "";
        row.composition = price.composition ?? "";
        row.compositionDetail = price.compositionDetail ?? "";
        row.pricePerSqm =
          typeof price.pricePerSqm === "number" ? String(price.pricePerSqm) : "";

        setValues({
          glassTypeId: price.glassTypeId ?? gtOpts[0]?.value ?? "",
          variant: price.variant ?? "",
          image:
            price.variantImageUrl && price.variantImagePublicId
              ? {
                  url: price.variantImageUrl,
                  publicId: price.variantImagePublicId,
                }
              : null,
          rows: [row],
        });
      })
      .catch(() => toast.error("Gagal memuat data pricelist kaca"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values || values.rows.length !== 1) return;
    setFormErrors({});

    const r = values.rows[0]!;
    const price = toNumber(r.pricePerSqm);
    const comp = String(r.composition ?? "").trim();
    const compDetail = String(r.compositionDetail ?? "").trim();
    const data = {
      glassTypeId: values.glassTypeId,
      thicknessId: r.thicknessId,
      variant: values.variant.trim(),
      variantImageUrl: values.image?.url ?? "",
      variantImagePublicId: values.image?.publicId ?? "",
      composition: comp === "" ? null : comp,
      compositionDetail: compDetail === "" ? null : compDetail,
      pricePerSqm: price ?? NaN,
    };

    const parsed = updateGlassPriceSchema.safeParse(data);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = String(issue.path[0] ?? "");
        if (path && !errors[path]) errors[path] = issue.message;
      }
      if (Number.isNaN(data.pricePerSqm)) {
        errors.pricePerSqm = "Harga per m2 tidak valid";
      }
      const field = (k: string) =>
        k === "pricePerSqm"
          ? "rows.0.pricePerSqm"
          : k === "thicknessId"
            ? "rows.0.thicknessId"
            : k === "composition"
              ? "rows.0.composition"
              : k === "compositionDetail"
                ? "rows.0.compositionDetail"
                : k;
      const mapped: Record<string, string> = {};
      for (const [k, v] of Object.entries(errors)) {
        mapped[field(k)] = v;
      }
      setFormErrors(mapped);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/glass-prices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal memperbarui pricelist kaca");
        if (json.details?.fieldErrors) {
          setFormErrors(
            Object.fromEntries(
              Object.entries(json.details.fieldErrors).map(([k, v]) => [
                k === "pricePerSqm" ? "rows.0.pricePerSqm" : k,
                Array.isArray(v) ? v[0] : String(v),
              ])
            )
          );
        }
        return;
      }

      toast.success("Pricelist kaca berhasil diperbarui");
      router.push("/admin/price-list/glass");
    } catch {
      toast.error("Gagal memperbarui pricelist kaca");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !values) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Edit Pricelist Kaca"
        description="Perbarui harga kaca"
        backHref="/admin/price-list/glass"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <GlassPriceForm
          values={values}
          onChange={setValues}
          errors={formErrors}
          glassTypeOptions={glassTypeOptions}
          thicknessOptions={thicknessOptions}
          allowMultipleRows={false}
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
