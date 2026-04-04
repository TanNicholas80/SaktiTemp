"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { toastApiValidationError, toastClientValidationErrors } from "@/lib/utils/toast-form";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import {
  CompanyStatForm,
  type CompanyStatFormValues,
} from "@/components/company-stat";
import { updateCompanyStatSchema } from "@/lib/validations/company-stat";

export default function EditCompanyStatPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id ?? "");

  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [values, setValues] = React.useState<CompanyStatFormValues>({
    value: "",
    label: "",
    displayOrder: 1,
    published: true,
  });

  React.useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/company-stat/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Gagal memuat data");
        return r.json();
      })
      .then((item) => {
        setValues({
          value: item.value ?? "",
          label: item.label ?? "",
          displayOrder: Math.max(1, item.displayOrder ?? 1),
          published: item.isPublished ?? true,
        });
      })
      .catch(() => toast.error("Gagal memuat data statistik"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    const data = {
      value: values.value.trim(),
      label: values.label.trim(),
      displayOrder: values.displayOrder,
      isPublished: values.published,
    };

    const parsed = updateCompanyStatSchema.safeParse(data);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = String(issue.path[0] ?? "");
        if (path && !errors[path]) errors[path] = issue.message;
      }
      setFormErrors(errors);

      toastClientValidationErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/company-stat/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal memperbarui statistik");
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

      toast.success("Statistik berhasil diperbarui");
      router.push("/admin/company-stat");
    } catch {
      toast.error("Gagal memperbarui statistik");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Edit Statistik"
        description="Perbarui data statistik perusahaan"
        backHref="/admin/company-stat"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <CompanyStatForm
          values={values}
          onChange={setValues}
          errors={formErrors}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/company-stat">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
