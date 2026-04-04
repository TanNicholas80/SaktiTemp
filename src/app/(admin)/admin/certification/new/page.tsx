"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { toastApiValidationError, toastClientValidationErrors } from "@/lib/utils/toast-form";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import {
  CertificationForm,
  type CertificationFormValues,
} from "@/components/certification";
import { createCertificationSchema } from "@/lib/validations/certification";

export default function NewCertificationPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [values, setValues] = React.useState<CertificationFormValues>({
    name: "",
    image: null,
    displayOrder: 1,
    published: true,
  });

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

    const parsed = createCertificationSchema.safeParse(data);
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
      const res = await fetch("/api/admin/certification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal membuat sertifikasi");
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

      toast.success("Sertifikasi berhasil dibuat");
      router.push("/admin/certification");
    } catch {
      toast.error("Gagal membuat sertifikasi");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Tambah Sertifikasi"
        description="Tambah sertifikasi baru"
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
