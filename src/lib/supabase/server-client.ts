import { createClient } from "@supabase/supabase-js";

function createSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseApiKey = process.env.SUPABASE_API_KEY;

  if (!supabaseUrl || !supabaseApiKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_API_KEY harus diisi di environment variables."
    );
  }

  return createClient(supabaseUrl, supabaseApiKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

type SupabaseAdminClient = ReturnType<typeof createSupabaseAdmin>;
let _client: SupabaseAdminClient | null = null;

/**
 * Supabase client dengan service role key untuk operasi storage server-side.
 * Lazy-initialized agar build tidak gagal jika env belum diisi.
 * Hanya digunakan di server (API route, server action). Jangan import di komponen client.
 */
export function getSupabaseAdmin() {
  if (!_client) {
    _client = createSupabaseAdmin();
  }
  return _client;
}

/** Shorthand alias — sama dengan getSupabaseAdmin(). */
export const supabaseAdmin = new Proxy({} as SupabaseAdminClient, {
  get(_target, prop) {
    return getSupabaseAdmin()[prop as keyof SupabaseAdminClient];
  },
});

export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "SaktiTemp Storage";
