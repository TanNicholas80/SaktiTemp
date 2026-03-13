"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import { LoadingState } from "@/components/layout/loading-state";
import { ServiceForm, type ServiceFormValues } from "@/components/service";
import { updateServiceSchema } from "@/lib/validations/service";

function parseServicePoints(servicePoints: unknown): string[] {
  if (Array.isArray(servicePoints)) {
    return servicePoints.filter((x): x is string => typeof x === "string");
  }
  return [];
}

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = React.useState(true);
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

  React.useEffect(() => {
    fetch(`/api/admin/service/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((svc) => {
        setValues({
          name: svc.serviceName ?? "",
          description: svc.serviceDescription ?? "",
          icon: svc.serviceIcon ?? "Wrench",
          points: parseServicePoints(svc.servicePoints) ?? [],
          btnText: svc.serviceBtnText ?? "",
          btnLink: svc.serviceBtnLink ?? "",
          published: svc.serviceIsPublished ?? false,
        });
      })
      .catch(() => toast.error("Gagal memuat data layanan"))
      .finally(() => setLoading(false));
  }, [id]);

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

    const parsed = updateServiceSchema.safeParse(data);
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
      const res = await fetch(`/api/admin/service/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal memperbarui layanan");
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

      toast.success("Layanan berhasil diperbarui");
      router.push("/admin/service");
    } catch {
      toast.error("Gagal memperbarui layanan");
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
        title="Edit Layanan"
        description="Perbarui layanan"
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
