import type { Metadata } from "next";

import { AnimatedErrorPage } from "@/components/errors/animated-error-page";
import { FooterSection } from "@/components/footer";
import { getFooterData } from "@/lib/footer/get-footer-data";

export const metadata: Metadata = {
  title: "403 - Akses Ditolak",
  description:
    "Anda tidak memiliki izin untuk mengakses halaman ini. Silakan kembali ke beranda.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ForbiddenPage({ params }: Props) {
  const { locale } = await params;
  const footerData = await getFooterData(locale);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col lg:min-h-[calc(100vh-4rem)]">
      <AnimatedErrorPage
        code="403"
        title="Akses Terbatas."
        description="Mohon maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi admin jika ini adalah kesalahan."
        primaryLabel="Kembali Ke Beranda"
        primaryHref="/"
        secondaryLabel="Hubungi Kami"
        secondaryHref="/about/contact"
      />
      <FooterSection
        contacts={footerData.contacts}
        socialMedia={footerData.socialMedia}
        categories={footerData.categories}
      />
    </div>
  );
}

