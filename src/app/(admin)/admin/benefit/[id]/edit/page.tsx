"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import { LoadingState } from "@/components/layout/loading-state";
import { BenefitForm, type BenefitFormValues } from "@/components/benefit";
import { updateBenefitSchema } from "@/lib/validations/benefit";

export default function EditBenefitPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [values, setValues] = React.useState<BenefitFormValues>({
    name: "",
    description: "",
    icon: "Target",
    published: false,
  });

  React.useEffect(() => {
    fetch(`/api/admin/benefit/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((b) => {
        setValues({
          name: b.benefitName ?? "",
          description: b.benefitDescription ?? "",
          icon: b.benefitIcon ?? "Target",
          published: b.benefitIsPublished ?? false,
        });
      })
      .catch(() => toast.error("Gagal memuat data keunggulan"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    const data = {
      benefitName: values.name.trim(),
      benefitDescription: values.description.trim(),
      benefitIcon: values.icon,
      benefitIsPublished: values.published,
    };

    const parsed = updateBenefitSchema.safeParse(data);
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
      const res = await fetch(`/api/admin/benefit/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal memperbarui keunggulan");
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

      toast.success("Keunggulan berhasil diperbarui");
      router.push("/admin/benefit");
    } catch {
      toast.error("Gagal memperbarui keunggulan");
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
        title="Edit Keunggulan"
        description="Perbarui keunggulan"
        backHref="/admin/benefit"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <BenefitForm
          values={values}
          onChange={setValues}
          errors={formErrors}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/benefit">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
