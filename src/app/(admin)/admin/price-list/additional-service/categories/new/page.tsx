"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { toastApiValidationError, toastClientValidationErrors } from "@/lib/utils/toast-form";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import {
  ProcessingCategoryForm,
  type ProcessingCategoryFormValues,
} from "@/components/price-list/processing-category-form";
import { createProcessingCategorySchema } from "@/lib/validations/processing-categories";

export default function NewProcessingCategoryPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {}
  );
  const [values, setValues] =
    React.useState<ProcessingCategoryFormValues>({
      categoryName: "",
      image: null,
    });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    const data = {
      categoryName: values.categoryName.trim(),
      categoryImageUrl: values.image?.url ?? "",
      categoryImagePublicId: values.image?.publicId ?? "",
    };
    const parsed = createProcessingCategorySchema.safeParse(data);

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
      const res = await fetch("/api/admin/processing-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal membuat kategori");
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

      toast.success("Kategori berhasil dibuat");
      router.push("/admin/price-list/additional-service");
    } catch {
      toast.error("Gagal membuat kategori");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Tambah Kategori Layanan"
        description="Kategori untuk mengelompokkan harga proses tambahan"
        backHref="/admin/price-list/additional-service"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <ProcessingCategoryForm
          values={values}
          onChange={setValues}
          errors={formErrors}
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
