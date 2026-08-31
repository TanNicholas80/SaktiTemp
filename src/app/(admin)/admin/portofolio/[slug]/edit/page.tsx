"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { toastApiValidationError, toastClientValidationErrors } from "@/lib/utils/toast-form";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import { LoadingState } from "@/components/layout/loading-state";
import { PortofolioForm, type PortofolioFormValues } from "@/components/portofolio";
import { updatePortofolioSchema } from "@/lib/validations/portofolio";

export default function EditPortofolioPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [loading, setLoading] = React.useState(true);
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
    galleryImages: [],
    location: "",
    applicators: [],
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
      fetch(`/api/admin/portofolio/${slug}`).then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      }),
    ])
      .then(([cats, types, apps, port]) => {
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
        setValues({
          name: port.portofolioName,
          slug: port.portofolioSlug,
          shortDescription: port.portofolioShortDescription ?? "",
          galleryImages: Array.isArray(port.portofolioGalleryImages)
            ? port.portofolioGalleryImages.filter(
                (img: { url?: string; publicId?: string }) =>
                  !!img?.url && !!img?.publicId
              )
            : [],
          location: port.portofolioLocation,
          applicators: Array.isArray(port.portofolioApplicators)
            ? port.portofolioApplicators
            : [],
          image: {
            url: port.portofolioImageUrl,
            publicId: port.portofolioImagePublicId,
          },
          categoryId: port.categoryPortofolioId ?? "",
          portofolioTypeId: port.portofolioTypeId ?? "",
          productApplicationIds: (port.productApplications ?? []).map(
            (p: { productApplicationId: string }) => p.productApplicationId
          ),
          published: port.portofolioIsPublished ?? false,
        });
      })
      .catch(() => toast.error("Gagal memuat data portofolio"))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    const data = {
      portofolioName: values.name.trim(),
      portofolioSlug: values.slug.trim(),
      portofolioShortDescription: values.shortDescription.trim() || undefined,
      portofolioGalleryImages: values.galleryImages.filter(
        (img) => img.url.trim() && img.publicId.trim()
      ),
      portofolioLocation: values.location.trim(),
      portofolioApplicators: (values.applicators ?? [])
        .map((a) => a.trim())
        .filter(Boolean),
      portofolioImageUrl: values.image?.url ?? "",
      portofolioImagePublicId: values.image?.publicId ?? "",
      categoryPortofolioId: values.categoryId || null,
      portofolioTypeId: values.portofolioTypeId || null,
      portofolioIsPublished: values.published,
      productApplicationIds: values.productApplicationIds,
    };

    const parsed = updatePortofolioSchema.safeParse(data);
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
      const res = await fetch(`/api/admin/portofolio/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal memperbarui portofolio");
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

      toast.success("Portofolio berhasil diperbarui");
      router.push(`/admin/portofolio/${json.portofolioSlug ?? slug}`);
    } catch {
      toast.error("Gagal memperbarui portofolio");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Edit Portofolio"
        description="Perbarui proyek portofolio"
        backHref={`/admin/portofolio/${slug}`}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <PortofolioForm
          values={values}
          onChange={setValues}
          errors={formErrors}
          categories={categories}
          portofolioTypes={portofolioTypes}
          productApplications={productApplications}
          portofolioSlug={slug}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href={`/admin/portofolio/${slug}`}>Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
