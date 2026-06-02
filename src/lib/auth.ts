import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import {
  authUser,
  authSession,
  authAccount,
  authVerification,
} from "@/db/schema/auth";

export const auth = betterAuth({
  // Izinkan kedua origin production (www & non-www)
  trustedOrigins: ["https://saktitemp.com", "https://www.saktitemp.com"],
  session: {
    expiresIn: 60 * 60 * 8, // 8 jam total lifetime
    updateAge: 60 * 60, // refresh tiap 1 jam jika user aktif
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: authUser,
      session: authSession,
      account: authAccount,
      verification: authVerification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
  plugins: [nextCookies()],
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
        defaultValue: "admin",
      },
    },
  },
});