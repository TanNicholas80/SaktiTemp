import { requireAdminSession } from "@/lib/session";

export default async function AdminUsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();
  return <>{children}</>;
}
