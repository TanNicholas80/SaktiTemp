/** Nilai role di kolom `user.role` (Better Auth + Drizzle). */
export const ROLE_ADMIN = "admin" as const;
export const ROLE_USER = "user" as const;
export const ROLE_BLOG_EDITOR = "blog_editor" as const;

export type AppUserRole =
  | typeof ROLE_ADMIN
  | typeof ROLE_USER
  | typeof ROLE_BLOG_EDITOR;

export function isAdminRole(role: string | undefined | null): boolean {
  return role === ROLE_ADMIN;
}

export function isBlogEditorRole(role: string | undefined | null): boolean {
  return role === ROLE_BLOG_EDITOR;
}

/** Boleh masuk shell CMS (admin layout). */
export function isCmsUserRole(role: string | undefined | null): boolean {
  return role === ROLE_ADMIN || role === ROLE_BLOG_EDITOR;
}

/** Prefix path yang boleh diakses blog editor (selain profil). */
export const BLOG_EDITOR_CMS_PREFIX = "/admin/blog" as const;

export function isBlogEditorAllowedPath(pathname: string): boolean {
  if (!pathname.startsWith("/admin")) return false;
  if (pathname === "/admin/profile" || pathname.startsWith("/admin/profile/")) {
    return true;
  }
  return (
    pathname === BLOG_EDITOR_CMS_PREFIX ||
    pathname.startsWith(`${BLOG_EDITOR_CMS_PREFIX}/`)
  );
}
