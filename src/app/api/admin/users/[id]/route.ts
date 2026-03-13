import { NextResponse } from "next/server";

import { and, eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";

import { db } from "@/db";
import { authAccount, authUser } from "@/db/schema/auth";
import { requireAdminApi } from "@/lib/api-auth";
import { updateUserSchema } from "@/lib/validations/user";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const user = await db.query.authUser.findFirst({
      where: eq(authUser.id, id),
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

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data user" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = updateUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existingUser = await db.query.authUser.findFirst({
      where: eq(authUser.id, id),
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    const { name, email, password, role } = parsed.data;

    if (email && email !== existingUser.email) {
      const emailTaken = await db.query.authUser.findFirst({
        where: eq(authUser.email, email),
      });
      if (emailTaken) {
        return NextResponse.json(
          { error: "Email sudah digunakan user lain" },
          { status: 409 }
        );
      }
    }

    await db
      .update(authUser)
      .set({
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(role !== undefined && { role }),
        updatedAt: new Date(),
      })
      .where(eq(authUser.id, id));

    if (password && password.length >= 8) {
      const passwordHash = await hashPassword(password);
      await db
        .update(authAccount)
        .set({
          password: passwordHash,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(authAccount.userId, id),
            eq(authAccount.providerId, "credential")
          )
        );
    }

    const user = await db.query.authUser.findFirst({
      where: eq(authUser.id, id),
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
      { error: "Gagal memperbarui user" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;
  const session = auth.session;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.id === id) {
    return NextResponse.json(
      { error: "Tidak dapat menghapus akun sendiri" },
      { status: 400 }
    );
  }

  try {
    const existingUser = await db.query.authUser.findFirst({
      where: eq(authUser.id, id),
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    await db.delete(authUser).where(eq(authUser.id, id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus user" },
      { status: 500 }
    );
  }
}
