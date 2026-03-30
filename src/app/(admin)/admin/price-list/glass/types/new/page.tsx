"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import {
  GlassTypeForm,
  type GlassTypeFormValues,
} from "@/components/price-list/glass-type-form";
import { createGlassTypeSchema } from "@/lib/validations/glass-types";

export default function NewGlassTypePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {}
  );
  const [values, setValues] = React.useState<GlassTypeFormValues>({
    glassTypeName: "",
    image: null,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    const data = {
      glassTypeName: values.glassTypeName.trim(),
      glassTypeImageUrl: values.image?.url ?? "",
      glassTypeImagePublicId: values.image?.publicId ?? "",
    };
    const parsed = createGlassTypeSchema.safeParse(data);

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
      const res = await fetch("/api/admin/glass-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal membuat tipe kaca");
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

      toast.success("Tipe kaca berhasil dibuat");
      router.push("/admin/price-list/glass");
    } catch {
      toast.error("Gagal membuat tipe kaca");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Tambah Tipe Kaca"
        description="Tambah master tipe kaca untuk pricelist"
        backHref="/admin/price-list/glass"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <GlassTypeForm values={values} onChange={setValues} errors={formErrors} />
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/price-list/glass">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}

