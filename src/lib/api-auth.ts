import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export async function requireAdminApi() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "admin") {
    return { error: "Unauthorized", status: 401 as const };
  }

  return { session };
}
