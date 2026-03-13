"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import { LocationForm, type LocationFormValues } from "@/components/location";
import { createLocationSchema } from "@/lib/validations/location";

export default function NewLocationPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [values, setValues] = React.useState<LocationFormValues>({
    city: "",
    type: "head",
    address: "",
    mapUrl: "",
    mapEmbedUrl: "",
    published: false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    const data = {
      locationCity: values.city.trim(),
      locationType: values.type,
      locationAddress: values.address.trim(),
      locationMapUrl: values.mapUrl.trim(),
      locationMapEmbedUrl: values.mapEmbedUrl.trim(),
      locationIsPublished: values.published,
    };

    const parsed = createLocationSchema.safeParse(data);
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
      const res = await fetch("/api/admin/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal membuat lokasi");
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

      toast.success("Lokasi berhasil dibuat");
      router.push("/admin/location");
    } catch {
      toast.error("Gagal membuat lokasi");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Tambah Lokasi"
        description="Tambah lokasi kantor baru"
        backHref="/admin/location"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <LocationForm
          values={values}
          onChange={setValues}
          errors={formErrors}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/location">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
