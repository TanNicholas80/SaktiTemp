import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CalculatorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold">Calculator</h1>
      <p className="text-muted-foreground mt-2">Calculator page</p>
    </div>
  );
}
