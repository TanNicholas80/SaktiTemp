import { redirect } from "next/navigation";

import { AdminSignInForm } from "@/components/shared/admin-signin-form";
import { getCmsHomeHref } from "@/lib/admin-nav";
import { isCmsUserRole } from "@/lib/roles";
import { getServerSession } from "@/lib/session";

export default async function SignInPage() {
  const session = await getServerSession();

  if (session?.user && isCmsUserRole(session.user.role)) {
    redirect(getCmsHomeHref(session.user.role));
  }

  return <AdminSignInForm />;
}
