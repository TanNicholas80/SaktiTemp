"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import { LoadingState } from "@/components/layout/loading-state";
import {
  GlassTypeForm,
  type GlassTypeFormValues,
} from "@/components/price-list/glass-type-form";
import { updateGlassTypeSchema } from "@/lib/validations/glass-types";

export default function EditGlassTypePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {}
  );
  const [values, setValues] = React.useState<GlassTypeFormValues>({
    glassTypeName: "",
    image: null,
  });

  React.useEffect(() => {
    fetch(`/api/admin/glass-types/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setValues({
          glassTypeName: data.glassTypeName ?? "",
          image:
            data.glassTypeImageUrl && data.glassTypeImagePublicId
              ? { url: data.glassTypeImageUrl, publicId: data.glassTypeImagePublicId }
              : null,
        });
      })
      .catch(() => toast.error("Gagal memuat data tipe kaca"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    const data = {
      glassTypeName: values.glassTypeName.trim(),
      glassTypeImageUrl: values.image?.url ?? "",
      glassTypeImagePublicId: values.image?.publicId ?? "",
    };
    const parsed = updateGlassTypeSchema.safeParse(data);

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
      const res = await fetch(`/api/admin/glass-types/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal memperbarui tipe kaca");
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

      toast.success("Tipe kaca berhasil diperbarui");
      router.push("/admin/price-list/glass");
    } catch {
      toast.error("Gagal memperbarui tipe kaca");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Edit Tipe Kaca"
        description="Perbarui master tipe kaca"
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

