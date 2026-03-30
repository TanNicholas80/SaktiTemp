import { getLocale } from "next-intl/server";

import { AnimatedErrorPage } from "@/components/errors/animated-error-page";
import { FooterSection } from "@/components/footer";
import { getFooterData } from "@/lib/footer/get-footer-data";
import { routing } from "@/i18n/routing";

type Props = {
  /** Di beberapa skenario render not-found, Next.js tidak mengirim `params`. */
  params?: Promise<{ locale: string }>;
};

function normalizeLocale(locale: string | undefined): string {
  if (locale && (routing.locales as readonly string[]).includes(locale)) {
    return locale;
  }
  return routing.defaultLocale;
}

export default async function NotFoundPage({ params }: Props) {
  const resolved = params != null ? await params : undefined;
  const locale = normalizeLocale(
    resolved?.locale ?? (await getLocale().catch(() => routing.defaultLocale))
  );
  const footerData = await getFooterData(locale);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col lg:min-h-[calc(100vh-4rem)]">
      <AnimatedErrorPage
        code="404"
        title="Halaman Tidak Ditemukan."
        description="Kami tidak bisa menemukan halaman yang kamu tuju. Yuk, balik lagi ke halaman utama."
        primaryLabel="Kembali Ke Beranda"
        primaryHref="/"
        secondaryLabel="Lihat Produk"
        secondaryHref="/product"
      />
      <FooterSection
        contacts={footerData.contacts}
        socialMedia={footerData.socialMedia}
        categories={footerData.categories}
      />
    </div>
  );
}

