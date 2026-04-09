import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AnimatedErrorPage } from "@/components/errors/animated-error-page";
import { FooterSection } from "@/components/footer";
import { getFooterData } from "@/lib/footer/get-footer-data";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.error500" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function InternalServerErrorPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.error500" });
  const footerData = await getFooterData(locale);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col lg:min-h-[calc(100vh-4rem)]">
      <AnimatedErrorPage
        code="500"
        title={t("heroTitle")}
        description={t("heroDescription")}
        primaryLabel={t("primaryLabel")}
        primaryHref="/"
        secondaryLabel={t("secondaryLabel")}
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

