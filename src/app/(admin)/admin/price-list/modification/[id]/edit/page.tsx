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
  ModificationForm,
  newModificationRow,
  type ModificationFormValues,
} from "@/components/price-list/modification-form";
import type { Option } from "@/components/price-list/glass-price-form";
import { updateModificationSchema } from "@/lib/validations/modification";
import type { ZodIssue } from "zod";

function issuesToEditModificationRowErrors(
  issues: ZodIssue[]
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const head = issue.path[0];
    const sub =
      head === "thicknessId" || head === "pricePerSide"
        ? `rows.0.${String(head)}`
        : issue.path.map(String).join(".");
    if (sub && !errors[sub]) errors[sub] = issue.message;
  }
  return errors;
}

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

export default function EditModificationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {}
  );
  const [thicknessOptions, setThicknessOptions] = React.useState<Option[]>([]);
  const [values, setValues] = React.useState<ModificationFormValues>({
    name: "",
    image: null,
    rows: [],
  });

  React.useEffect(() => {
    Promise.all([
      fetch(`/api/admin/modifications/${id}`),
      fetch("/api/admin/thickness"),
    ])
      .then(async ([modRes, thRes]) => {
        if (!modRes.ok) throw new Error("Not found");
        if (!thRes.ok) throw new Error("Gagal ketebalan");

        const mod = await modRes.json();
        const thJson = (await thRes.json()) as ThicknessApiRow[];
        const thOpts = thJson
          .slice()
          .sort((a, b) => a.thicknessValue - b.thicknessValue)
          .map((x) => ({
            value: x.thicknessId,
            label: `${x.thicknessValue} ${x.thicknessUnit}`,
          }));

        setThicknessOptions(thOpts);
        const row = newModificationRow(thOpts);
        row.thicknessId = mod.thicknessId ?? thOpts[0]?.value ?? "";
        row.pricePerSide =
          typeof mod.pricePerSide === "number"
            ? String(mod.pricePerSide)
            : "";

        setValues({
          name: mod.name ?? "",
          image:
            mod.modificationImageUrl && mod.modificationImagePublicId
              ? {
                  url: mod.modificationImageUrl,
                  publicId: mod.modificationImagePublicId,
                }
              : null,
          rows: [row],
        });
      })
      .catch(() => toast.error("Gagal memuat data modifikasi"))
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

    const price = toNumber(r.pricePerSide);
    const data = {
      name: values.name.trim(),
      thicknessId: r.thicknessId,
      modificationImageUrl: values.image?.url ?? "",
      modificationImagePublicId: values.image?.publicId ?? "",
      pricePerSide: price ?? NaN,
    };

    const parsed = updateModificationSchema.safeParse(data);
    if (!parsed.success) {
      const errors = issuesToEditModificationRowErrors(parsed.error.issues);
      if (Number.isNaN(data.pricePerSide)) {
        errors["rows.0.pricePerSide"] = "Harga tidak valid";
      }
      setFormErrors(errors);

      toastClientValidationErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/modifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal memperbarui modifikasi");
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

      toast.success("Modifikasi berhasil diperbarui");
      router.push("/admin/price-list/modification");
    } catch {
      toast.error("Gagal memperbarui modifikasi");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Edit Pricelist Modifikasi"
        description="Perbarui data modifikasi"
        backHref="/admin/price-list/modification"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <ModificationForm
          values={values}
          onChange={setValues}
          errors={formErrors}
          thicknessOptions={thicknessOptions}
          allowMultipleRows={false}
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
