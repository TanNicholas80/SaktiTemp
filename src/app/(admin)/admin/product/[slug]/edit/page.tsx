"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import { LoadingState } from "@/components/layout/loading-state";
import {
  ProductForm,
  type ProductFormValues,
  type CategoryProductOption,
  type PortofolioOption,
  type ThicknessOption,
} from "@/components/product";
import { updateProductSchema } from "@/lib/validations/product";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [loading, setLoading] = React.useState(true);
  const [categories, setCategories] = React.useState<CategoryProductOption[]>(
    []
  );
  const [thicknessOptions, setThicknessOptions] = React.useState<
    ThicknessOption[]
  >([]);
  const [portofolios, setPortofolios] = React.useState<PortofolioOption[]>([]);
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
      fetch(`/api/admin/product/${slug}`).then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      }),
    ])
      .then(([cats, thickness, product]) => {
        setCategories(cats);
        setThicknessOptions(
          thickness.map((t: { thicknessId: string; thicknessValue: number; thicknessUnit: string }) => ({
            thicknessId: t.thicknessId,
            thicknessValue: t.thicknessValue,
            thicknessUnit: t.thicknessUnit,
          }))
        );
        setPortofolios(Array.isArray(product.portofolios) ? product.portofolios : []);
        setValues({
          name: product.productName,
          slug: product.productSlug,
          shortDescription: product.productShortDescription ?? "",
          description: product.productDescription ?? "",
          image: product.productImageUrl
            ? {
                url: product.productImageUrl,
                publicId: product.productImagePublicId ?? "",
              }
            : null,
          categoryId: product.categoryProductId ?? product.category?.id ?? "",
          thicknessIds:
            product.thicknesses?.map((t: { thicknessId: string }) => t.thicknessId) ?? [],
          excellences:
            product.excellences?.map((e: { productExellenceDescription: string }) => ({
              productExellenceDescription: e.productExellenceDescription,
            })) ?? [],
          published: product.productIsPublished ?? false,
        });
      })
      .catch(() => toast.error("Gagal memuat data produk"))
      .finally(() => setLoading(false));
  }, [slug]);

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

    const parsed = updateProductSchema.safeParse(data);
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
      const res = await fetch(`/api/admin/product/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal memperbarui produk");
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

      toast.success("Produk berhasil diperbarui");
      router.push(`/admin/product/${json.productSlug ?? slug}`);
    } catch {
      toast.error("Gagal memperbarui produk");
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
        title="Edit Product"
        description="Perbarui produk"
        backHref={`/admin/product/${slug}`}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <ProductForm
          values={values}
          onChange={setValues}
          errors={formErrors}
          categories={categories}
          thicknessOptions={thicknessOptions}
          portofolios={portofolios}
          productSlug={slug}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href={`/admin/product/${slug}`}>Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
