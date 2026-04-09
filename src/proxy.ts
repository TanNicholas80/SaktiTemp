import { getSessionCookie } from "better-auth/cookies";
import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = getSessionCookie(request);
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/signin";
      url.search = "";
      return NextResponse.redirect(url);
    }
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|trpc|signin|_next|_vercel|.*\\..*).*)",
  ],
};
