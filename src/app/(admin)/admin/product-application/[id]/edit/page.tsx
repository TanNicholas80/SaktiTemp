"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { toastApiValidationError, toastClientValidationErrors } from "@/lib/utils/toast-form";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import { LoadingState } from "@/components/layout/loading-state";
import {
  ProductApplicationForm,
  type ProductApplicationFormValues,
} from "@/components/product-application";
import { updateProductApplicationSchema } from "@/lib/validations/product-application";

export default function EditProductApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id ?? "");

  const [loading, setLoading] = React.useState(true);
  const [products, setProducts] = React.useState<
    { productId: string; productName: string; productSlug: string }[]
  >([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [values, setValues] = React.useState<ProductApplicationFormValues>({
    name: "",
    description: "",
    image: null,
    productId: "",
    published: false,
  });

  React.useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch("/api/admin/product").then((r) =>
        r.json().then((list: { productId: string; productName: string; productSlug: string }[]) =>
          Array.isArray(list) ? list : []
        )
      ),
      fetch(`/api/admin/product-application/${id}`).then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      }),
    ])
      .then(([prods, item]) => {
        setProducts(prods);
        setValues({
          name: item.productApplicationName ?? "",
          description: item.productApplicationDescription ?? "",
          image: item.productApplicationImageUrl
            ? {
                url: item.productApplicationImageUrl,
                publicId: item.productApplicationImagePublicId ?? "",
              }
            : null,
          productId: item.productId ?? "",
          published: item.productApplicationIsPublished ?? false,
        });
      })
      .catch(() => toast.error("Gagal memuat data aplikasi produk"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    if (!values.image?.url) {
      const imgErr = {
        productApplicationImageUrl: "Gambar wajib diunggah",
      };
      setFormErrors(imgErr);
      toastClientValidationErrors(imgErr);
      return;
    }

    const data = {
      productApplicationName: values.name.trim(),
      productApplicationDescription: values.description,
      productApplicationImageUrl: values.image.url,
      productApplicationImagePublicId: values.image.publicId,
      productId: values.productId || null,
      productApplicationIsPublished: values.published,
    };

    const parsed = updateProductApplicationSchema.safeParse(data);
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
      const res = await fetch(`/api/admin/product-application/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal memperbarui aplikasi produk");
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

      toast.success("Aplikasi produk berhasil diperbarui");
      router.push("/admin/product-application");
    } catch {
      toast.error("Gagal memperbarui aplikasi produk");
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
        title="Edit Aplikasi Produk"
        description="Perbarui data aplikasi kaca"
        backHref="/admin/product-application"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <ProductApplicationForm
          values={values}
          onChange={setValues}
          errors={formErrors}
          products={products}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/product-application">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
