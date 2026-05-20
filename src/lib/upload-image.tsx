"use client";

import Image, { type ImageProps } from "next/image";

/** Path gambar CMS lokal — hindari optimizer agar tidak tertahan cache edge. */
export function isLocalUploadImageSrc(src: string): boolean {
  return (
    src.startsWith("/uploads/") ||
    src.startsWith("/uploads\\") ||
    src.includes("/uploads/")
  );
}

type UploadImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

/**
 * next/image untuk aset /uploads/* (unoptimized) atau remote (optimized default).
 */
export function UploadImage({ src, alt, ...props }: UploadImageProps) {
  const unoptimized = isLocalUploadImageSrc(src);
  return <Image src={src} alt={alt} unoptimized={unoptimized} {...props} />;
}
