"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { toastApiValidationError, toastClientValidationErrors } from "@/lib/utils/toast-form";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import {
  CompanyStatForm,
  type CompanyStatFormValues,
} from "@/components/company-stat";
import { createCompanyStatSchema } from "@/lib/validations/company-stat";

export default function NewCompanyStatPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [values, setValues] = React.useState<CompanyStatFormValues>({
    value: "",
    label: "",
    displayOrder: 1,
    published: true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    const data = {
      value: values.value.trim(),
      label: values.label.trim(),
      displayOrder: values.displayOrder,
      isPublished: values.published,
    };

    const parsed = createCompanyStatSchema.safeParse(data);
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
      const res = await fetch("/api/admin/company-stat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal membuat statistik");
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

      toast.success("Statistik berhasil dibuat");
      router.push("/admin/company-stat");
    } catch {
      toast.error("Gagal membuat statistik");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Tambah Statistik"
        description="Tambah statistik perusahaan baru"
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
