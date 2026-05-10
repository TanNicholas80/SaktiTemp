import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTimeZone } from "next-intl/server";

import { DashboardLayoutShell } from "@/components/shared/dashboard-layout-shell";
import { requireCmsSession } from "@/lib/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireCmsSession();
  const locale = await getLocale();
  const [messages, timeZone] = await Promise.all([getMessages(), getTimeZone()]);
  const role = session.user.role;

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
      <DashboardLayoutShell
        userRole={role}
        userEmail={session.user.email}
        userName={session.user.name}
        userImage={session.user.image}
      >
        {children}
      </DashboardLayoutShell>
    </NextIntlClientProvider>
  );
}
