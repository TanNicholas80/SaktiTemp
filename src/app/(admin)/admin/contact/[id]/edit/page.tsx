"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import {
  ContactForm,
  type ContactFormValues,
} from "@/components/contact";
import { updateContactSchema } from "@/lib/validations/contact";

export default function EditContactPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id ?? "");

  const [loading, setLoading] = React.useState(true);
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

  React.useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/contact/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Gagal memuat data");
        return r.json();
      })
      .then((item) => {
        setValues({
          contactType: item.contactType ?? "phone",
          contactLabel: item.contactLabel ?? "",
          contactValue: item.contactValue ?? "",
          contactValueExtra: item.contactValueExtra ?? "",
          contactIcon: item.contactIcon ?? "Phone",
          published: item.isPublished ?? true,
        });
      })
      .catch(() => toast.error("Gagal memuat data kontak"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    const data = {
      contactType: values.contactType as "phone" | "email" | "address" | "operational_hours",
      contactLabel: values.contactLabel.trim(),
      contactValue: values.contactValue.trim(),
      contactValueExtra: values.contactValueExtra.trim() || null,
      contactIcon: values.contactIcon,
      isPublished: values.published,
    };

    const parsed = updateContactSchema.safeParse(data);
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
      const res = await fetch(`/api/admin/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal memperbarui kontak");
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

      toast.success("Kontak berhasil diperbarui");
      router.push("/admin/contact");
    } catch {
      toast.error("Gagal memperbarui kontak");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Edit Kontak"
        description="Perbarui informasi kontak"
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
