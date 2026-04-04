"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { toastApiValidationError, toastClientValidationErrors } from "@/lib/utils/toast-form";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import {
  ProductForm,
  type ProductFormValues,
  type CategoryProductOption,
  type ThicknessOption,
} from "@/components/product";
import { createProductSchema } from "@/lib/validations/product";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = React.useState<CategoryProductOption[]>(
    []
  );
  const [thicknessOptions, setThicknessOptions] = React.useState<
    ThicknessOption[]
  >([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {}
  );
  const [values, setValues] = React.useState<ProductFormValues>({
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    image: null,
    categoryId: "",
    thicknessIds: [],
    excellences: [],
    published: false,
  });

  React.useEffect(() => {
    Promise.all([
      fetch("/api/admin/product/categories").then((r) => r.json()),
      fetch("/api/admin/thickness").then((r) => r.json()),
    ])
      .then(([cats, thickness]) => {
        setCategories(cats);
        setThicknessOptions(
          thickness.map((t: { thicknessId: string; thicknessValue: number; thicknessUnit: string }) => ({
            thicknessId: t.thicknessId,
            thicknessValue: t.thicknessValue,
            thicknessUnit: t.thicknessUnit,
          }))
        );
      })
      .catch(() => toast.error("Gagal memuat data"));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    const data = {
      productName: values.name.trim(),
      productSlug: values.slug.trim(),
      productShortDescription: values.shortDescription.trim() || undefined,
      productDescription: values.description.trim(),
      productImageUrl: values.image?.url ?? "",
      productImagePublicId: values.image?.publicId ?? "",
      categoryProductId: values.categoryId || null,
      productIsPublished: values.published,
      thicknessIds: values.thicknessIds,
      excellences: values.excellences.filter((e) =>
        e.productExellenceDescription.trim()
      ),
    };

    const parsed = createProductSchema.safeParse(data);
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
      const res = await fetch("/api/admin/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal membuat produk");
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

      toast.success("Produk berhasil dibuat");
      router.push(`/admin/product/${json.productSlug}`);
    } catch {
      toast.error("Gagal membuat produk");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Tambah Product"
        description="Buat produk baru"
        backHref="/admin/product"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <ProductForm
          values={values}
          onChange={setValues}
          errors={formErrors}
          categories={categories}
          thicknessOptions={thicknessOptions}
          portofolios={[]}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/product">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
