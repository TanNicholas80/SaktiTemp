"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import { LoadingState } from "@/components/layout/loading-state";
import { BlogForm, type BlogFormValues } from "@/components/blog";
import { updateBlogSchema } from "@/lib/validations/blog";

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [loading, setLoading] = React.useState(true);
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
  const [publishedAt, setPublishedAt] = React.useState<string | null>(null);

  React.useEffect(() => {
    Promise.all([
      fetch("/api/admin/blog/categories").then((r) => r.json()),
      fetch(`/api/admin/blog/${slug}`).then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      }),
    ])
      .then(([cats, blog]) => {
        setCategories(cats);
        setPublishedAt(blog.blogIsPublishedAt ?? null);
        setValues({
          title: blog.blogTitle,
          slug: blog.blogSlug,
          excerpt: blog.blogExcerpt ?? "",
          content: blog.blogContent,
          image: {
            url: blog.blogImageUrl,
            publicId: blog.blogImagePublicId,
          },
          categoryId: blog.categoryBlogId ?? "",
          published: blog.blogIsPublished ?? false,
        });
      })
      .catch(() => toast.error("Gagal memuat data blog"))
      .finally(() => setLoading(false));
  }, [slug]);

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

    const parsed = updateBlogSchema.safeParse(data);
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
      const res = await fetch(`/api/admin/blog/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal memperbarui blog");
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

      toast.success("Blog berhasil diperbarui");
      router.push(`/admin/blog/${json.blogSlug}`);
    } catch {
      toast.error("Gagal memperbarui blog");
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
        title="Edit Blog"
        description="Perbarui artikel blog"
        backHref={`/admin/blog/${slug}`}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <BlogForm
          values={values}
          onChange={setValues}
          errors={formErrors}
          categories={categories}
          blogSlug={slug}
          publishedAt={publishedAt}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href={`/admin/blog/${slug}`}>Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
