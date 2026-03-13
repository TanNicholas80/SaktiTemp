"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import { LoadingState } from "@/components/layout/loading-state";
import { BlogDetailHero, ConsultationCard } from "@/components/blog";
import type { BlogDetailData } from "@/components/blog";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [blog, setBlog] = React.useState<BlogDetailData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!slug) return;
    fetch(`/api/admin/blog/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setBlog)
      .catch(() => setBlog(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <LoadingState />;
  }

  if (!blog) {
    return (
      <div className="space-y-4 py-12 text-center">
        <p className="text-muted-foreground">Blog tidak ditemukan</p>
        <Button asChild>
          <Link href="/admin/blog">← Kembali ke Daftar Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeaderWithBack
        title=""
        backHref="/admin/blog"
        action={
          <Button variant="outline" asChild>
            <Link href={`/admin/blog/${blog.blogSlug}/edit`}>Edit</Link>
          </Button>
        }
      />

      <BlogDetailHero blog={blog} />

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0">
          <div
            className="prose prose-sm dark:prose-invert max-w-none [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:first:mt-0 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:first:mt-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_li]:my-0.5"
            dangerouslySetInnerHTML={{ __html: blog.blogContent }}
          />
        </div>

        <aside>
          <ConsultationCard />
        </aside>
      </div>
    </div>
  );
}
