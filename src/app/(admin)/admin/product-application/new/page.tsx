"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import {
  ProductApplicationForm,
  type ProductApplicationFormValues,
} from "@/components/product-application";
import { createProductApplicationSchema } from "@/lib/validations/product-application";

export default function NewProductApplicationPage() {
  const router = useRouter();
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
    fetch("/api/admin/product")
      .then((r) => r.json())
      .then((list: { productId: string; productName: string; productSlug: string }[]) =>
        Array.isArray(list) ? list : []
      )
      .then(setProducts)
      .catch(() => toast.error("Gagal memuat data produk"));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    if (!values.image?.url) {
      setFormErrors({ productApplicationImageUrl: "Gambar wajib diunggah" });
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

    const parsed = createProductApplicationSchema.safeParse(data);
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
      const res = await fetch("/api/admin/product-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal membuat aplikasi produk");
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

      toast.success("Aplikasi produk berhasil dibuat");
      router.push("/admin/product-application");
    } catch {
      toast.error("Gagal membuat aplikasi produk");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Tambah Aplikasi Produk"
        description="Buat aplikasi kaca baru (e.g. Glass Railing System)"
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
