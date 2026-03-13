import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "@/lib/auth";

export const getServerSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
});

export async function requireAdminSession() {
  const session = await getServerSession();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/signin");
  }

  return session;
}
