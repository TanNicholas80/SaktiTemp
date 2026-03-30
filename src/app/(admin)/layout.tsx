import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTimeZone } from "next-intl/server";

import { DashboardLayoutShell } from "@/components/shared/dashboard-layout-shell";
import { requireAdminSession } from "@/lib/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();
  const locale = await getLocale();
  const [messages, timeZone] = await Promise.all([getMessages(), getTimeZone()]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
      <DashboardLayoutShell
        userEmail={session.user.email}
        userName={session.user.name}
        userImage={session.user.image}
      >
        {children}
      </DashboardLayoutShell>
    </NextIntlClientProvider>
  );
}
