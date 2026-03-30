import type { Metadata } from "next";

import { AnimatedErrorPage } from "@/components/errors/animated-error-page";
import { FooterSection } from "@/components/footer";
import { getFooterData } from "@/lib/footer/get-footer-data";

export const metadata: Metadata = {
  title: "500 - Gangguan Sistem",
  description:
    "Terjadi kendala teknis pada server. Silakan coba lagi beberapa saat.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function InternalServerErrorPage({ params }: Props) {
  const { locale } = await params;
  const footerData = await getFooterData(locale);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col lg:min-h-[calc(100vh-4rem)]">
      <AnimatedErrorPage
        code="500"
        title="Terjadi Gangguan Pada Sistem."
        description="Maaf, server kami sedang mengalami kendala teknis. Kami akan segera memperbaikinya. Silakan coba lagi nanti."
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

