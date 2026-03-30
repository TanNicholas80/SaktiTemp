export type ViewIntentKind = "article" | "product" | "portofolio";

const PREFIX = "saktitemp:view-intent";
const DEFAULT_TTL_MS = 10 * 60 * 1000; // 10 minutes

function key(kind: ViewIntentKind, slug: string) {
  return `${PREFIX}:${kind}:${slug}`;
}

function now() {
  return Date.now();
}

export function markViewIntent(kind: ViewIntentKind, slug: string) {
  if (typeof window === "undefined") return;
  const s = slug?.trim();
  if (!s) return;
  try {
    sessionStorage.setItem(key(kind, s), String(now()));
  } catch {
    // ignore storage errors (private mode, quota, etc.)
  }
}

/**
 * Returns true only once after markViewIntent(), then consumes it.
 * This prevents view increments on refresh or direct URL access.
 */
export function consumeViewIntent(
  kind: ViewIntentKind,
  slug: string,
  ttlMs: number = DEFAULT_TTL_MS
): boolean {
  if (typeof window === "undefined") return false;
  const s = slug?.trim();
  if (!s) return false;
  try {
    const k = key(kind, s);
    const raw = sessionStorage.getItem(k);
    if (!raw) return false;
    const ts = Number(raw);
    sessionStorage.removeItem(k);
    if (!Number.isFinite(ts)) return false;
    if (now() - ts > ttlMs) return false;
    return true;
  } catch {
    return false;
  }
}

