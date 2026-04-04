"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { toastApiValidationError, toastClientValidationErrors } from "@/lib/utils/toast-form";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import {
  ContactForm,
  type ContactFormValues,
} from "@/components/contact";
import { createContactSchema } from "@/lib/validations/contact";

export default function NewContactPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [values, setValues] = React.useState<ContactFormValues>({
    contactType: "phone",
    contactLabel: "",
    contactValue: "",
    contactValueExtra: "",
    contactIcon: "Phone",
    published: true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    const data = {
      contactType: values.contactType as "phone" | "email" | "address" | "operational_hours",
      contactLabel: values.contactLabel.trim(),
      contactValue: values.contactValue.trim(),
      contactValueExtra: values.contactValueExtra.trim() || undefined,
      contactIcon: values.contactIcon,
      isPublished: values.published,
    };

    const parsed = createContactSchema.safeParse(data);
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
      const res = await fetch("/api/admin/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal membuat kontak");
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

      toast.success("Kontak berhasil dibuat");
      router.push("/admin/contact");
    } catch {
      toast.error("Gagal membuat kontak");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Tambah Kontak"
        description="Tambah informasi kontak baru"
        backHref="/admin/contact"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <ContactForm
          values={values}
          onChange={setValues}
          errors={formErrors}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/contact">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
