import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { isAdminRole, isCmsUserRole } from "@/lib/roles";

export async function requireAdminApi() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || !isAdminRole(session.user.role)) {
    return { error: "Unauthorized", status: 401 as const };
  }

  return { session };
}

/** Admin atau Editor Blog — API blog, kategori blog, upload gambar. */
export async function requireBlogCmsApi() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || !isCmsUserRole(session.user.role)) {
    return { error: "Unauthorized", status: 401 as const };
  }

  return { session };
}
