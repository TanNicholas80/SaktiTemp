import { createAuthClient } from "better-auth/react";

const serverBaseURL =
  typeof window === "undefined" ? process.env.BETTER_AUTH_URL : undefined;

export const authClient = createAuthClient({
  baseURL: serverBaseURL,
  basePath: "/api/auth",
});

export type SessionData = typeof authClient.$Infer.Session;
