"use client";

import * as React from "react";
import { ImagePlusIcon, Loader2Icon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCEPT_TYPES = "image/jpeg,image/png,image/webp";
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

function isImageFile(file: File): boolean {
  return ACCEPT_TYPES.split(",").includes(file.type);
}

type ImageUploadFieldProps = {
  value?: { url: string; publicId: string } | null;
  onChange: (value: { url: string; publicId: string } | null) => void;
  disabled?: boolean;
  className?: string;
  error?: string;
  size?: "default" | "compact";
  /** Folder untuk simpan file: "blog" (default), "product", "portofolio", "carousel", "hero", "certification", atau "category" */
  folder?: "blog" | "product" | "portofolio" | "carousel" | "hero" | "certification" | "category";
};

export function ImageUploadField({
  value,
  onChange,
  disabled,
  className,
  error,
  size = "default",
  folder = "blog",
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = React.useState(false);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    if (!isImageFile(file)) return;
    if (file.size > MAX_SIZE) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const res = await fetch(`/api/admin/upload?folder=${folder}`, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Gagal mengunggah");
      }

      onChange({ url: json.url, publicId: json.publicId });
    } catch (err) {
      console.error(err);
      onChange(null);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || uploading || value) return;
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled || uploading || value) return;
    const file = e.dataTransfer.files?.[0];
    if (file) await uploadFile(file);
  }

  function handleRemove() {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "border-input flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all duration-200",
          size === "compact" ? "min-h-[120px]" : "min-h-[180px]",
          error && "border-destructive",
          value && "border-solid",
          isDragOver && "border-primary bg-primary/5"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {value ? (
          <div className="relative w-full p-4">
            <img
              src={value.url}
              alt="Preview"
              className={cn(
                "mx-auto rounded-md object-cover",
                size === "compact" ? "max-h-28" : "max-h-48"
              )}
            />
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-6 top-6"
                onClick={handleRemove}
              >
                <XIcon className="size-4" />
              </Button>
            )}
          </div>
        ) : (
          <label
            className={cn(
              "flex w-full cursor-pointer flex-col items-center gap-2 p-6",
              (disabled || uploading) && "cursor-not-allowed opacity-60"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT_TYPES}
              className="hidden"
              disabled={disabled || uploading}
              onChange={handleFileChange}
            />
            {uploading ? (
              <Loader2Icon className="text-muted-foreground size-10 animate-spin" />
            ) : (
              <ImagePlusIcon
                className={cn(
                  "text-muted-foreground size-10 transition-transform",
                  isDragOver && "scale-110 text-primary"
                )}
              />
            )}
            <span className="text-muted-foreground text-center text-sm">
              {uploading
                ? "Mengunggah..."
                : isDragOver
                  ? "Lepaskan untuk mengunggah"
                  : "Klik atau seret gambar ke sini (JPEG, PNG, WebP, max 2MB)"}
            </span>
          </label>
        )}
      </div>
      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
