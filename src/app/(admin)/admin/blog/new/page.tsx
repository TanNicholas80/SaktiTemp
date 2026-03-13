"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import { BlogForm, type BlogFormValues } from "@/components/blog";
import { createBlogSchema } from "@/lib/validations/blog";

export default function NewBlogPage() {
  const router = useRouter();
  const [categories, setCategories] = React.useState<
    { categoryBlogId: string; categoryBlogName: string; categoryBlogSlug: string }[]
  >([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [values, setValues] = React.useState<BlogFormValues>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: null,
    categoryId: "",
    published: false,
  });

  React.useEffect(() => {
    fetch("/api/admin/blog/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => toast.error("Gagal memuat kategori"));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    const data = {
      blogTitle: values.title.trim(),
      blogSlug: values.slug.trim(),
      blogExcerpt: values.excerpt.trim() || undefined,
      blogContent: values.content,
      blogImageUrl: values.image?.url ?? "",
      blogImagePublicId: values.image?.publicId ?? "",
      categoryBlogId: values.categoryId || null,
      blogIsPublished: values.published,
    };

    const parsed = createBlogSchema.safeParse(data);
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
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal membuat blog");
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

      toast.success("Blog berhasil dibuat");
      router.push(`/admin/blog/${json.blogSlug}`);
    } catch {
      toast.error("Gagal membuat blog");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title="Tambah Blog"
        description="Buat artikel blog baru"
        backHref="/admin/blog"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <BlogForm
          values={values}
          onChange={setValues}
          errors={formErrors}
          categories={categories}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/blog">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
