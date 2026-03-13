import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";

import { db } from "@/db";
import { authAccount, authUser } from "@/db/schema/auth";
import { requireAdminApi } from "@/lib/api-auth";
import { createUserSchema } from "@/lib/validations/user";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const users = await db.query.authUser.findMany({
      columns: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: (u, { desc }) => [desc(u.createdAt)],
    });

    return NextResponse.json(users);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data user" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password, role } = parsed.data;

    const existingUser = await db.query.authUser.findFirst({
      where: eq(authUser.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    const userId = crypto.randomUUID();
    const passwordHash = await hashPassword(password);

    await db.insert(authUser).values({
      id: userId,
      email,
      name,
      emailVerified: false,
      role: role ?? "admin",
    });

    await db.insert(authAccount).values({
      id: crypto.randomUUID(),
      userId,
      providerId: "credential",
      accountId: userId,
      password: passwordHash,
    });

    const user = await db.query.authUser.findFirst({
      where: eq(authUser.id, userId),
      columns: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat user" },
      { status: 500 }
    );
  }
}
