import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/api-auth";
import { revalidateAllCache } from "@/lib/cache/revalidate";

export async function DELETE() {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    await revalidateAllCache();
    return NextResponse.json({ success: true, message: "Cache berhasil di-flush" });
  } catch {
    return NextResponse.json(
      { error: "Gagal melakukan flush cache" },
      { status: 500 }
    );
  }
}
