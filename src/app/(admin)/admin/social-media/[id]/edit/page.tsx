"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { toastApiValidationError, toastClientValidationErrors } from "@/lib/utils/toast-form";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import {
  SocialMediaForm,
  type SocialMediaFormValues,
} from "@/components/social-media";
import { updateSocialMediaSchema } from "@/lib/validations/social-media";

export default function EditSocialMediaPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id ?? "");

  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [values, setValues] = React.useState<SocialMediaFormValues>({
    platformName: "",
    profileUrl: "",
    iconName: "Facebook",
    published: true,
  });

  React.useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/social-media/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Gagal memuat data");
        return r.json();
      })
      .then((item) => {
        setValues({
          platformName: item.platformName ?? "",
          profileUrl: item.profileUrl ?? "",
          iconName: item.iconName ?? "Facebook",
          published: item.isPublished ?? true,
        });
      })
      .catch(() => toast.error("Gagal memuat data media sosial"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    const data = {
      platformName: values.platformName.trim(),
      profileUrl: values.profileUrl.trim(),
      iconName: values.iconName,
      isPublished: values.published,
    };

    const parsed = updateSocialMediaSchema.safeParse(data);
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
      const res = await fetch(`/api/admin/social-media/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal memperbarui media sosial");
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

      toast.success("Media sosial berhasil diperbarui");
      router.push("/admin/social-media");
    } catch {
      toast.error("Gagal memperbarui media sosial");
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
        title="Edit Media Sosial"
        description="Perbarui data media sosial"
        backHref="/admin/social-media"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <SocialMediaForm
          values={values}
          onChange={setValues}
          errors={formErrors}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/social-media">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
