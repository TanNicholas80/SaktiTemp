import "dotenv/config";
import { and, eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";

import { db, pool } from "../db";
import { authAccount, authUser } from "../db/schema/auth";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Super Admin";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL dan ADMIN_PASSWORD wajib diisi di environment.");
  }

  const existingUser = await db.query.authUser.findFirst({
    where: eq(authUser.email, email),
  });

  if (!existingUser) {
    const userId = crypto.randomUUID();
    const passwordHash = await hashPassword(password);

    await db.insert(authUser).values({
      id: userId,
      email,
      name,
      emailVerified: true,
      role: "admin",
    });

    await db.insert(authAccount).values({
      id: crypto.randomUUID(),
      userId,
      providerId: "credential",
      accountId: userId,
      password: passwordHash,
    });

    console.log(`Admin baru berhasil dibuat: ${email}`);
    return;
  }

  const credentialAccount = await db.query.authAccount.findFirst({
    where: and(
      eq(authAccount.userId, existingUser.id),
      eq(authAccount.providerId, "credential")
    ),
  });

  if (!credentialAccount) {
    const passwordHash = await hashPassword(password);

    await db.insert(authAccount).values({
      id: crypto.randomUUID(),
      userId: existingUser.id,
      providerId: "credential",
      accountId: existingUser.id,
      password: passwordHash,
    });
  }

  await db
    .update(authUser)
    .set({
      role: "admin",
      emailVerified: true,
      updatedAt: new Date(),
    })
    .where(eq(authUser.id, existingUser.id));

  console.log(`Admin sudah ada, role dipastikan admin: ${email}`);
}

seedAdmin()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
