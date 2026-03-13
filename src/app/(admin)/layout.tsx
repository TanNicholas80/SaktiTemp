import { DashboardLayoutShell } from "@/components/shared/dashboard-layout-shell";
import { requireAdminSession } from "@/lib/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();

  return (
    <DashboardLayoutShell
      userEmail={session.user.email}
      userName={session.user.name}
      userImage={session.user.image}
    >
      {children}
    </DashboardLayoutShell>
  );
}
