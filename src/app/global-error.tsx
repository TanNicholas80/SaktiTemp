"use client";

import { useEffect } from "react";

import { AnimatedErrorPage } from "@/components/errors/animated-error-page";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="id">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AnimatedErrorPage
          code="500"
          title="Terjadi Gangguan Pada Sistem."
          description="Maaf, aplikasi mengalami kendala tak terduga. Silakan coba lagi. Jika masih berulang, hubungi tim kami."
          primaryLabel="Kembali Ke Beranda"
          primaryHref="/"
          onRetry={reset}
        />
      </body>
    </html>
  );
}

