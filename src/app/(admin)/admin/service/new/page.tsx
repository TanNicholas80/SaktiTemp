"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import { ServiceForm, type ServiceFormValues } from "@/components/service";
import { createServiceSchema } from "@/lib/validations/service";

export default function NewServicePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [values, setValues] = React.useState<ServiceFormValues>({
    name: "",
    description: "",
    icon: "Wrench",
    points: [],
    btnText: "",
    btnLink: "",
    published: false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    const data = {
      serviceName: values.name.trim(),
      serviceDescription: values.description.trim(),
      serviceIcon: values.icon,
      servicePoints: values.points.filter((p) => p.trim().length > 0),
      serviceBtnText: values.btnText.trim(),
      serviceBtnLink: values.btnLink.trim(),
      serviceIsPublished: values.published,
    };

    const parsed = createServiceSchema.safeParse(data);
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
      const res = await fetch("/api/admin/service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal membuat layanan");
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

      toast.success("Layanan berhasil dibuat");
      router.push("/admin/service");
    } catch {
      toast.error("Gagal membuat layanan");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Tambah Layanan"
        description="Tambah layanan baru"
        backHref="/admin/service"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <ServiceForm
          values={values}
          onChange={setValues}
          errors={formErrors}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/service">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
