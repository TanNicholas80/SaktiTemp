"use client";

import * as React from "react";
import { ImagePlusIcon, Loader2Icon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  ADMIN_IMAGE_ACCEPT_ATTR,
  ADMIN_IMAGE_ACCEPT_MIME,
  ADMIN_IMAGE_MAX_BYTES,
  STAGING_URL_SEGMENT,
  type FinalUploadFolder,
} from "@/lib/constants/admin-upload";
import { cn } from "@/lib/utils";

/**
 * Deteksi URL staging untuk local (/uploads/staging/...) dan
 * Supabase (...supabase.co/.../staging/...).
 */
function isStagingImageUrl(url: string): boolean {
  return url.includes(STAGING_URL_SEGMENT);
}

function isImageFile(file: File): boolean {
  return (ADMIN_IMAGE_ACCEPT_MIME as readonly string[]).includes(file.type);
}

async function deleteStagingFile(publicId: string): Promise<void> {
  if (!publicId) return;
  await fetch(
    `/api/admin/upload?publicId=${encodeURIComponent(publicId)}`,
    { method: "DELETE" }
  );
}

type ImageUploadFieldProps = {
  value?: { url: string; publicId: string } | null;
  onChange: (value: { url: string; publicId: string } | null) => void;
  disabled?: boolean;
  className?: string;
  error?: string;
  size?: "default" | "compact";
  /**
   * Folder tujuan setelah simpan (promote). Query `folder` tetap dikirim agar konsisten dengan API;
   * berkas disimpan di staging hingga submit.
   */
  folder?: FinalUploadFolder;
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
  const valueRef = React.useRef(value);
  valueRef.current = value;

  React.useEffect(() => {
    return () => {
      const v = valueRef.current;
      if (v && isStagingImageUrl(v.url)) {
        void deleteStagingFile(v.publicId);
      }
    };
  }, []);

  async function uploadFile(file: File) {
    if (!isImageFile(file)) {
      toast.error("Format gambar tidak didukung", {
        description: "Gunakan JPEG, PNG, atau WebP.",
      });
      return;
    }
    if (file.size > ADMIN_IMAGE_MAX_BYTES) {
      toast.error("Ukuran file terlalu besar", {
        description: `Maksimal ${Math.round(ADMIN_IMAGE_MAX_BYTES / (1024 * 1024))}MB.`,
      });
      return;
    }

    const previous = valueRef.current;
    if (previous && isStagingImageUrl(previous.url)) {
      await deleteStagingFile(previous.publicId);
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const res = await fetch(`/api/admin/upload?folder=${folder}`, {
        method: "POST",
        body: formData,
      });
      let json: { error?: string; url?: string; publicId?: string } = {};
      try {
        json = await res.json();
      } catch {
        toast.error("Gagal membaca respons server");
        onChange(null);
        return;
      }

      if (!res.ok) {
        toast.error(json.error ?? "Gagal mengunggah gambar");
        onChange(null);
        return;
      }

      if (!json.url || !json.publicId) {
        toast.error("Respons unggah tidak valid");
        onChange(null);
        return;
      }

      onChange({ url: json.url, publicId: json.publicId });
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengunggah gambar", {
        description: err instanceof Error ? err.message : undefined,
      });
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

  async function handleRemove() {
    const current = valueRef.current;
    if (current && isStagingImageUrl(current.url)) {
      await deleteStagingFile(current.publicId);
    }
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
                onClick={() => void handleRemove()}
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
              accept={ADMIN_IMAGE_ACCEPT_ATTR}
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
                  : `Klik atau seret gambar ke sini (JPEG, PNG, WebP, max ${Math.round(ADMIN_IMAGE_MAX_BYTES / (1024 * 1024))}MB)`}
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
