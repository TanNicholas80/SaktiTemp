import { AdminDashboardClient } from "./admin-dashboard-client";
import { requireAdminSession } from "@/lib/session";

export default async function AdminDashboardPage() {
  await requireAdminSession();
  return <AdminDashboardClient />;
}
