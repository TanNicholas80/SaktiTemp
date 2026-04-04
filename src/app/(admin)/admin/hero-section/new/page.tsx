"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { toastApiValidationError, toastClientValidationErrors } from "@/lib/utils/toast-form";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import {
  HeroSectionForm,
  type HeroSectionFormValues,
} from "@/components/hero-section";
import { createHeroSectionSchema } from "@/lib/validations/hero-section";

export default function NewHeroSectionPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [values, setValues] = React.useState<HeroSectionFormValues>({
    pageKey: "",
    preHeading: "",
    mainHeading: "",
    subHeading: "",
    description: "",
    image: null,
    breadcrumbItems: [],
    scrollIndicatorText: "SCROLL",
    scrollIndicatorVisible: true,
    published: true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    if (!values.image) {
      const imgErr = {
        backgroundImageUrl: "Gambar background wajib diunggah",
        backgroundImagePublicId: "Gambar background wajib diunggah",
      };
      setFormErrors(imgErr);
      toastClientValidationErrors(imgErr);
      return;
    }

    const data = {
      pageKey: values.pageKey.trim().toLowerCase(),
      preHeading: values.preHeading.trim() || null,
      mainHeading: values.mainHeading.trim(),
      subHeading: values.subHeading.trim(),
      description: values.description.trim(),
      backgroundImageUrl: values.image.url,
      backgroundImagePublicId: values.image.publicId,
      breadcrumbItems:
        values.breadcrumbItems.filter((b) => b.label || b.href).length > 0
          ? values.breadcrumbItems.filter((b) => b.label || b.href)
          : null,
      scrollIndicatorText: values.scrollIndicatorText.trim() || "SCROLL",
      scrollIndicatorVisible: values.scrollIndicatorVisible,
      isPublished: values.published,
    };

    const parsed = createHeroSectionSchema.safeParse(data);
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
      const res = await fetch("/api/admin/hero-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal membuat hero section");
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

      toast.success("Hero section berhasil dibuat");
      router.push("/admin/hero-section");
    } catch {
      toast.error("Gagal membuat hero section");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Tambah Hero Section"
        description="Tambah hero section baru untuk halaman"
        backHref="/admin/hero-section"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <HeroSectionForm
          values={values}
          onChange={setValues}
          errors={formErrors}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/hero-section">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
