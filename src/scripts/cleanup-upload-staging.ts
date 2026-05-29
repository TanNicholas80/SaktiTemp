import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

import { STAGING_UPLOAD_DIR } from "@/lib/constants/admin-upload";

function parseArgs(): { maxAgeMs: number } {
  const envHours = process.env.STAGING_CLEANUP_MAX_AGE_HOURS;
  let hours = envHours ? Number.parseFloat(envHours) : 168;
  if (!Number.isFinite(hours) || hours <= 0) hours = 168;

  const argv = process.argv.slice(2);
  for (const a of argv) {
    if (a.startsWith("--hours=")) {
      const n = Number.parseFloat(a.slice("--hours=".length));
      if (Number.isFinite(n) && n > 0) hours = n;
    }
  }

  return { maxAgeMs: hours * 60 * 60 * 1000 };
}

async function main() {
  const { maxAgeMs } = parseArgs();

  const supabaseUrl = process.env.SUPABASE_URL;
  const apiKey = process.env.SUPABASE_API_KEY;
  const bucket =
    process.env.SUPABASE_STORAGE_BUCKET?.trim() || "saktitemp-uploads";

  if (!supabaseUrl || !apiKey) {
    console.error(
      "[cleanup-upload-staging] SUPABASE_URL dan SUPABASE_API_KEY harus diisi."
    );
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, apiKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: files, error: listError } = await supabase.storage
    .from(bucket)
    .list(STAGING_UPLOAD_DIR, { limit: 1000, offset: 0 });

  if (listError) {
    console.error("[cleanup-upload-staging] Gagal list file:", listError.message);
    process.exit(1);
  }

  if (!files || files.length === 0) {
    console.log("[cleanup-upload-staging] Folder staging kosong. Tidak ada yang dihapus.");
    return;
  }

  const now = Date.now();
  const toRemove: string[] = [];
  let skipped = 0;

  for (const file of files) {
    if (!file.name.endsWith(".webp")) continue;
    const createdAt = file.created_at ? new Date(file.created_at).getTime() : null;
    if (createdAt === null) continue;

    if (now - createdAt > maxAgeMs) {
      toRemove.push(`${STAGING_UPLOAD_DIR}/${file.name}`);
    } else {
      skipped += 1;
    }
  }

  if (toRemove.length === 0) {
    console.log(
      `[cleanup-upload-staging] Tidak ada file yang kedaluwarsa. Dipertahankan: ${skipped}. Max usia: ${(maxAgeMs / 3600000).toFixed(2)} jam`
    );
    return;
  }

  const { error: removeError } = await supabase.storage
    .from(bucket)
    .remove(toRemove);

  if (removeError) {
    console.error("[cleanup-upload-staging] Gagal menghapus file:", removeError.message);
    process.exit(1);
  }

  console.log(
    `[cleanup-upload-staging] Selesai. Dihapus: ${toRemove.length}, dipertahankan (masih segar): ${skipped}. Max usia: ${(maxAgeMs / 3600000).toFixed(2)} jam`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
