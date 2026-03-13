"use client";

import * as React from "react";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { RichTextEditor } from "@/components/shared/rich-text-editor";
import { slugify } from "@/lib/utils/slug";
import { BlogFormPreviewCard } from "./blog-form-preview-card";
import type { CategoryOption } from "./types";

export type BlogFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: { url: string; publicId: string } | null;
  categoryId: string;
  published: boolean;
};

type BlogFormProps = {
  values: BlogFormValues;
  onChange: (values: BlogFormValues) => void;
  errors: Record<string, string>;
  categories: CategoryOption[];
  /** Slug blog untuk link preview (hanya saat edit) */
  blogSlug?: string;
  /** Tanggal publikasi untuk preview (hanya saat edit, dari blogIsPublishedAt) */
  publishedAt?: string | null;
};

export function BlogForm({
  values,
  onChange,
  errors,
  categories,
  blogSlug,
  publishedAt,
}: BlogFormProps) {
  React.useEffect(() => {
    const newSlug = slugify(values.title);
    if (newSlug !== values.slug) {
      onChange({ ...values, slug: newSlug });
    }
    // Hanya sinkronkan slug saat judul berubah
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.title]);

  const selectedCategory = React.useMemo(
    () => categories.find((c) => c.categoryBlogId === values.categoryId) ?? null,
    [categories, values.categoryId]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="title">Judul</FieldLabel>
        <Input
          id="title"
          value={values.title}
          onChange={(e) => onChange({ ...values, title: e.target.value })}
          placeholder="Judul artikel"
          aria-invalid={!!errors.blogTitle}
        />
        <FieldError
          errors={
            errors.blogTitle ? [{ message: errors.blogTitle }] : []
          }
        />
      </Field>
      <Field>
        <FieldLabel>Kategori</FieldLabel>
        <Combobox
          items={categories}
          itemToStringLabel={(cat) => cat.categoryBlogName}
          itemToStringValue={(cat) => cat.categoryBlogId}
          isItemEqualToValue={(a, b) => a?.categoryBlogId === b?.categoryBlogId}
          value={selectedCategory}
          onValueChange={(cat) =>
            onChange({ ...values, categoryId: cat?.categoryBlogId ?? "" })
          }
        >
          <ComboboxInput
            placeholder="Pilih kategori"
            className="w-full"
            aria-invalid={!!errors.categoryBlogId}
          />
          <ComboboxContent>
            <ComboboxEmpty>Tidak ada kategori ditemukan.</ComboboxEmpty>
            <ComboboxList>
              {(cat) => (
                <ComboboxItem key={cat.categoryBlogId} value={cat}>
                  {cat.categoryBlogName}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
      <Field>
        <FieldLabel htmlFor="excerpt">Deskripsi Singkat</FieldLabel>
        <Input
          id="excerpt"
          value={values.excerpt}
          onChange={(e) => onChange({ ...values, excerpt: e.target.value })}
          placeholder="Ringkasan artikel (untuk card/list, maks 500 karakter)"
          className="resize-none"
          aria-invalid={!!errors.blogExcerpt}
        />
        <FieldError
          errors={
            errors.blogExcerpt ? [{ message: errors.blogExcerpt }] : []
          }
        />
      </Field>
      <Field>
        <FieldLabel>Gambar Cover</FieldLabel>
        <ImageUploadField
          value={values.image}
          onChange={(image) => onChange({ ...values, image })}
          error={errors.blogImageUrl}
          folder="blog"
        />
      </Field>
      <Field>
        <FieldLabel>Konten</FieldLabel>
        <RichTextEditor
          value={values.content}
          onChange={(content) => onChange({ ...values, content })}
          minHeight="300px"
        />
        <FieldError
          errors={
            errors.blogContent ? [{ message: errors.blogContent }] : []
          }
        />
      </Field>
      <Field orientation="horizontal">
        <Checkbox
          id="published"
          checked={values.published}
          onCheckedChange={(v) => onChange({ ...values, published: !!v })}
        />
        <FieldLabel htmlFor="published">Publikasikan</FieldLabel>
      </Field>
    </FieldGroup>

      <div className="lg:sticky lg:top-4">
        <p className="text-muted-foreground mb-3 text-sm font-medium">
          Preview Tampilan Card Blog
        </p>
        <BlogFormPreviewCard
          blogTitle={values.title}
          excerpt={values.excerpt}
          imageUrl={values.image?.url ?? null}
          categoryName={selectedCategory?.categoryBlogName ?? null}
          publishedAt={publishedAt ?? null}
          blogSlug={blogSlug}
        />
      </div>
    </div>
  );
}
