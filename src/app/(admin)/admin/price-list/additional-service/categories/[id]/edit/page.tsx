"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import { LoadingState } from "@/components/layout/loading-state";
import {
  ProcessingCategoryForm,
  type ProcessingCategoryFormValues,
} from "@/components/price-list/processing-category-form";
import { updateProcessingCategorySchema } from "@/lib/validations/processing-categories";

export default function EditProcessingCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {}
  );
  const [values, setValues] =
    React.useState<ProcessingCategoryFormValues>({
      categoryName: "",
      image: null,
    });

  React.useEffect(() => {
    fetch(`/api/admin/processing-categories/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setValues({
          categoryName: data.categoryName ?? "",
          image:
            data.categoryImageUrl && data.categoryImagePublicId
              ? {
                  url: data.categoryImageUrl,
                  publicId: data.categoryImagePublicId,
                }
              : null,
        });
      })
      .catch(() => toast.error("Gagal memuat kategori"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    const data = {
      categoryName: values.categoryName.trim(),
      categoryImageUrl: values.image?.url ?? "",
      categoryImagePublicId: values.image?.publicId ?? "",
    };
    const parsed = updateProcessingCategorySchema.safeParse(data);

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = String(issue.path[0] ?? "");
        if (path && !errors[path]) errors[path] = issue.message;
      }
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/processing-categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal memperbarui kategori");
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

      toast.success("Kategori berhasil diperbarui");
      router.push("/admin/price-list/additional-service");
    } catch {
      toast.error("Gagal memperbarui kategori");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Edit kategori layanan"
        description="Perbarui nama dan gambar kategori"
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
