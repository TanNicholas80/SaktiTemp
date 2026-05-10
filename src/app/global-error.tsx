"use client";

import { useEffect } from "react";

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
      <body className="min-h-screen bg-white text-black antialiased">
        <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-5 px-6 text-center">
          <p className="text-7xl font-black leading-none text-orange-600">500</p>
          <h1 className="text-2xl font-bold">Terjadi Gangguan Pada Sistem.</h1>
          <p className="text-sm text-gray-600 sm:text-base">
            Maaf, aplikasi mengalami kendala tak terduga. Silakan coba lagi. Jika masih berulang, hubungi tim kami.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                window.location.href = "/";
              }}
              className="inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white"
            >
              Kembali Ke Beranda
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-10 items-center justify-center rounded-md border border-gray-300 px-4 text-sm font-medium"
            >
              Coba Lagi
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}

