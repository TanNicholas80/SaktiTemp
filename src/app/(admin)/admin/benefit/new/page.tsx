"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import { BenefitForm, type BenefitFormValues } from "@/components/benefit";
import { createBenefitSchema } from "@/lib/validations/benefit";

export default function NewBenefitPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [values, setValues] = React.useState<BenefitFormValues>({
    name: "",
    description: "",
    icon: "Target",
    published: false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    const data = {
      benefitName: values.name.trim(),
      benefitDescription: values.description.trim(),
      benefitIcon: values.icon,
      benefitIsPublished: values.published,
    };

    const parsed = createBenefitSchema.safeParse(data);
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
      const res = await fetch("/api/admin/benefit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal membuat keunggulan");
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

      toast.success("Keunggulan berhasil dibuat");
      router.push("/admin/benefit");
    } catch {
      toast.error("Gagal membuat keunggulan");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Tambah Keunggulan"
        description="Tambah keunggulan baru"
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
