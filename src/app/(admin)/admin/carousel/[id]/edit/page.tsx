"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import { LoadingState } from "@/components/layout/loading-state";
import { CarouselForm, type CarouselFormValues } from "@/components/carousel";
import { updateCarouselSchema } from "@/lib/validations/carousel";

export default function EditCarouselPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [totalSlides, setTotalSlides] = React.useState<number | undefined>(
    undefined
  );
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [values, setValues] = React.useState<CarouselFormValues>({
    heading: "",
    subheading: "",
    description: "",
    image: null,
    order: 1,
    published: false,
  });

  React.useEffect(() => {
    Promise.all([
      fetch(`/api/admin/carousel/${id}`).then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      }),
      fetch("/api/admin/carousel").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([c, list]) => {
        setValues({
          heading: c.carouselHeading ?? "",
          subheading: c.carouselSubheading ?? "",
          description: c.carouselDescription ?? "",
          image: c.carouselImageUrl
            ? { url: c.carouselImageUrl, publicId: c.carouselImagePublicId }
            : null,
          order: Math.max(1, c.carouselOrder ?? 1),
          published: c.carouselIsPublished ?? false,
        });
        setTotalSlides(Array.isArray(list) ? list.length : 0);
      })
      .catch(() => toast.error("Gagal memuat data carousel"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    if (!values.image) {
      setFormErrors({
        carouselImageUrl: "Gambar wajib diunggah",
        carouselImagePublicId: "Gambar wajib diunggah",
      });
      return;
    }

    const data = {
      carouselHeading: values.heading.trim(),
      carouselSubheading: values.subheading.trim(),
      carouselDescription: values.description.trim(),
      carouselImageUrl: values.image.url,
      carouselImagePublicId: values.image.publicId,
      carouselOrder: values.order,
      carouselIsPublished: values.published,
    };

    const parsed = updateCarouselSchema.safeParse(data);
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
      const res = await fetch(`/api/admin/carousel/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal memperbarui slide");
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

      toast.success("Slide berhasil diperbarui");
      router.push("/admin/carousel");
    } catch {
      toast.error("Gagal memperbarui slide");
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
        title="Edit Slide Carousel"
        description="Perbarui slide carousel"
        backHref="/admin/carousel"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <CarouselForm
          values={values}
          onChange={setValues}
          errors={formErrors}
          totalSlides={totalSlides}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/carousel">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
