import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "@/lib/auth";
import { isAdminRole, isCmsUserRole } from "@/lib/roles";

export const getServerSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
});

/** Hanya admin (kelola user, dashboard, dll.). */
export async function requireAdminSession() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/signin");
  }

  if (!isAdminRole(session.user.role)) {
    redirect("/admin/blog");
  }

  return session;
}

/** Admin atau Editor Blog — shell CMS. */
export async function requireCmsSession() {
  const session = await getServerSession();

  if (!session?.user || !isCmsUserRole(session.user.role)) {
    redirect("/signin");
  }

  return session;
}
