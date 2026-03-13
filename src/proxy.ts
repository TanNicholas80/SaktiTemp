import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/((?!admin|signin|api|trpc|_next|_vercel|.*\\..*).*)",
  ],
};
