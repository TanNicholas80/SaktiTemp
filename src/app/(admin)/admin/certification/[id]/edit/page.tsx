"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { toastApiValidationError, toastClientValidationErrors } from "@/lib/utils/toast-form";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import {
  CertificationForm,
  type CertificationFormValues,
} from "@/components/certification";
import { updateCertificationSchema } from "@/lib/validations/certification";

export default function EditCertificationPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id ?? "");

  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [values, setValues] = React.useState<CertificationFormValues>({
    name: "",
    image: null,
    displayOrder: 1,
    published: true,
  });

  React.useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/certification/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Gagal memuat data");
        return r.json();
      })
      .then((item) => {
        setValues({
          name: item.name ?? "",
          image: item.image
            ? { url: item.image, publicId: "" }
            : null,
          displayOrder: Math.max(1, item.displayOrder ?? 1),
          published: item.isPublished ?? true,
        });
      })
      .catch(() => toast.error("Gagal memuat data sertifikasi"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    if (!values.image?.url) {
      const imgErr = { image: "Gambar logo wajib diunggah" };
      setFormErrors(imgErr);
      toastClientValidationErrors(imgErr);
      return;
    }

    const data = {
      name: values.name.trim(),
      image: values.image.url,
      displayOrder: values.displayOrder,
      isPublished: values.published,
    };

    const parsed = updateCertificationSchema.safeParse(data);
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
      const res = await fetch(`/api/admin/certification/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal memperbarui sertifikasi");
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

      toast.success("Sertifikasi berhasil diperbarui");
      router.push("/admin/certification");
    } catch {
      toast.error("Gagal memperbarui sertifikasi");
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
        title="Edit Sertifikasi"
        description="Perbarui data sertifikasi"
        backHref="/admin/certification"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <CertificationForm
          values={values}
          onChange={setValues}
          errors={formErrors}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/certification">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
