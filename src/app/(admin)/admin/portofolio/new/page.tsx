"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { toastApiValidationError, toastClientValidationErrors } from "@/lib/utils/toast-form";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import { PortofolioForm, type PortofolioFormValues } from "@/components/portofolio";
import { createPortofolioSchema } from "@/lib/validations/portofolio";

export default function NewPortofolioPage() {
  const router = useRouter();
  const [categories, setCategories] = React.useState<
    {
      categoryPortofolioId: string;
      categoryPortofolioName: string;
      categoryPortofolioSlug: string;
    }[]
  >([]);
  const [portofolioTypes, setPortofolioTypes] = React.useState<
    {
      portofolioTypeId: string;
      portofolioTypeName: string;
      portofolioTypeSlug: string;
    }[]
  >([]);
  const [productApplications, setProductApplications] = React.useState<
    {
      productApplicationId: string;
      productApplicationName: string;
      productName: string | null;
    }[]
  >([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [values, setValues] = React.useState<PortofolioFormValues>({
    name: "",
    slug: "",
    shortDescription: "",
    about: "",
    location: "",
    image: null,
    categoryId: "",
    portofolioTypeId: "",
    productApplicationIds: [],
    published: false,
  });

  React.useEffect(() => {
    Promise.all([
      fetch("/api/admin/portofolio/categories").then((r) => r.json()),
      fetch("/api/admin/portofolio/types").then((r) => r.json()),
      fetch("/api/admin/product-application").then((r) => r.json()),
    ])
      .then(([cats, types, apps]) => {
        setCategories(cats);
        setPortofolioTypes(Array.isArray(types) ? types : []);
        setProductApplications(
          Array.isArray(apps)
            ? apps.map((a: { productApplicationId: string; productApplicationName: string; productName: string | null }) => ({
                productApplicationId: a.productApplicationId,
                productApplicationName: a.productApplicationName,
                productName: a.productName ?? null,
              }))
            : []
        );
      })
      .catch(() => toast.error("Gagal memuat data"));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    const data = {
      portofolioName: values.name.trim(),
      portofolioSlug: values.slug.trim(),
      portofolioShortDescription: values.shortDescription.trim() || undefined,
      portofolioAbout: values.about,
      portofolioLocation: values.location.trim(),
      portofolioImageUrl: values.image?.url ?? "",
      portofolioImagePublicId: values.image?.publicId ?? "",
      categoryPortofolioId: values.categoryId || null,
      portofolioTypeId: values.portofolioTypeId || null,
      portofolioIsPublished: values.published,
      productApplicationIds: values.productApplicationIds,
    };

    const parsed = createPortofolioSchema.safeParse(data);
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
      const res = await fetch("/api/admin/portofolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal membuat portofolio");
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

      toast.success("Portofolio berhasil dibuat");
      router.push(`/admin/portofolio/${json.portofolioSlug}`);
    } catch {
      toast.error("Gagal membuat portofolio");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Tambah Portofolio"
        description="Buat proyek portofolio baru"
        backHref="/admin/portofolio"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <PortofolioForm
          values={values}
          onChange={setValues}
          errors={formErrors}
          categories={categories}
          portofolioTypes={portofolioTypes}
          productApplications={productApplications}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/portofolio">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
