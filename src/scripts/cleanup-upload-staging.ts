import "dotenv/config";
import { readdir, stat, unlink } from "fs/promises";
import path from "path";

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
  const stagingDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    STAGING_UPLOAD_DIR
  );

  let removed = 0;
  let skipped = 0;

  try {
    const names = await readdir(stagingDir);
    const now = Date.now();

    for (const name of names) {
      if (!name.endsWith(".webp")) continue;
      const full = path.join(stagingDir, name);
      const st = await stat(full);
      if (!st.isFile()) continue;

      if (now - st.mtimeMs > maxAgeMs) {
        await unlink(full);
        removed += 1;
      } else {
        skipped += 1;
      }
    }
  } catch (err: unknown) {
    const code =
      err && typeof err === "object" && "code" in err
        ? (err as { code?: string }).code
        : undefined;
    if (code === "ENOENT") {
      console.log(
        `[cleanup-upload-staging] Folder tidak ada: ${stagingDir} (lewati)`
      );
      return;
    }
    throw err;
  }

  console.log(
    `[cleanup-upload-staging] Selesai. Dihapus: ${removed}, dipertahankan (masih segar): ${skipped}. Max usia: ${(maxAgeMs / 3600000).toFixed(2)} jam`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
