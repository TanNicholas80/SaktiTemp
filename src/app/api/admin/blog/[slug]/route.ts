import { NextResponse } from "next/server";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { deleteBlogImageFile } from "@/lib/utils/blog-image";
import { blog } from "@/db/schema/blog";
import { categoryBlog } from "@/db/schema/category-blog";
import { requireAdminApi } from "@/lib/api-auth";
import { updateBlogSchema } from "@/lib/validations/blog";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { slug } = await params;

  try {
    const rows = await db
      .select({
        blogId: blog.blogId,
        blogTitle: blog.blogTitle,
        blogSlug: blog.blogSlug,
        blogExcerpt: blog.blogExcerpt,
        blogContent: blog.blogContent,
        blogImageUrl: blog.blogImageUrl,
        blogImagePublicId: blog.blogImagePublicId,
        blogViews: blog.blogViews,
        blogIsPublished: blog.blogIsPublished,
        blogIsPublishedAt: blog.blogIsPublishedAt,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        categoryBlogId: blog.categoryBlogId,
        categoryBlogName: categoryBlog.categoryBlogName,
        categoryBlogSlug: categoryBlog.categoryBlogSlug,
      })
      .from(blog)
      .leftJoin(categoryBlog, eq(blog.categoryBlogId, categoryBlog.categoryBlogId))
      .where(eq(blog.blogSlug, slug))
      .limit(1);

    const row = rows[0];
    if (!row) {
      return NextResponse.json({ error: "Blog tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      ...row,
      category: row.categoryBlogName
        ? { name: row.categoryBlogName, slug: row.categoryBlogSlug }
        : null,
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data blog" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { slug } = await params;

  try {
    const body = await request.json();
    const parsed = updateBlogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.query.blog.findFirst({
      where: eq(blog.blogSlug, slug),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Blog tidak ditemukan" },
        { status: 404 }
      );
    }

    const newSlug = parsed.data.blogSlug?.trim();
    if (newSlug && newSlug !== slug) {
      const existingSlug = await db.query.blog.findFirst({
        where: eq(blog.blogSlug, newSlug),
      });
      if (existingSlug) {
        return NextResponse.json(
          { error: "Slug sudah digunakan" },
          { status: 409 }
        );
      }
    }

    const updateData: Partial<typeof blog.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (parsed.data.blogTitle !== undefined)
      updateData.blogTitle = parsed.data.blogTitle;
    if (parsed.data.blogSlug !== undefined)
      updateData.blogSlug = parsed.data.blogSlug.trim();
    if (parsed.data.blogExcerpt !== undefined)
      updateData.blogExcerpt = parsed.data.blogExcerpt ?? "";
    if (parsed.data.blogContent !== undefined)
      updateData.blogContent = parsed.data.blogContent;
    if (parsed.data.blogImageUrl !== undefined)
      updateData.blogImageUrl = parsed.data.blogImageUrl;
    if (parsed.data.blogImagePublicId !== undefined)
      updateData.blogImagePublicId = parsed.data.blogImagePublicId;
    if (parsed.data.categoryBlogId !== undefined)
      updateData.categoryBlogId = parsed.data.categoryBlogId;
    if (parsed.data.blogIsPublished !== undefined) {
      updateData.blogIsPublished = parsed.data.blogIsPublished;
      if (parsed.data.blogIsPublished) {
        updateData.blogIsPublishedAt = new Date();
      }
    }

    const newPublicId = parsed.data.blogImagePublicId;
    const oldPublicId = existing.blogImagePublicId;
    const imageChanged =
      newPublicId !== undefined && oldPublicId && newPublicId !== oldPublicId;

    const [updated] = await db
      .update(blog)
      .set(updateData)
      .where(eq(blog.blogId, existing.blogId))
      .returning();

    // Replace image: hapus file lama setelah update berhasil
    if (imageChanged && updated) {
      await deleteBlogImageFile(oldPublicId);
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { slug } = await params;

  try {
    const existing = await db.query.blog.findFirst({
      where: eq(blog.blogSlug, slug),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Blog tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus file gambar dari folder public saat blog dihapus
    if (existing.blogImagePublicId) {
      await deleteBlogImageFile(existing.blogImagePublicId);
    }

    await db.delete(blog).where(eq(blog.blogId, existing.blogId));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus blog" },
      { status: 500 }
    );
  }
}
