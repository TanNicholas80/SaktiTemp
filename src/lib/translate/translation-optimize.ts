/**
 * Helpers to skip redundant Gemini calls when translatable text did not change.
 */

export function normalizeText(value: unknown): string {
  if (value == null) return "";
  return String(value);
}

/**
 * Returns true when all listed keys have identical string values between previous and current
 * (after normalization). If previous is null/undefined, returns false (always translate).
 */
export function translatableTextsUnchanged(
  previous: Record<string, unknown> | null | undefined,
  current: Record<string, unknown>,
  keys: readonly string[]
): boolean {
  if (!previous) return false;
  for (const k of keys) {
    if (normalizeText(previous[k]) !== normalizeText(current[k])) return false;
  }
  return true;
}

/** Stable JSON compare for jsonb fields (e.g. servicePoints, breadcrumbItems). */
export function jsonFieldUnchanged(
  previous: Record<string, unknown> | null | undefined,
  current: Record<string, unknown>,
  key: string
): boolean {
  if (!previous) return false;
  return (
    JSON.stringify(previous[key] ?? null) === JSON.stringify(current[key] ?? null)
  );
}

/**
 * Compare ordered excellence descriptions (product may be delete+reinsert so IDs can change).
 */
export function excellenceDescriptionsUnchanged(
  previous: readonly string[] | null | undefined,
  current: readonly string[]
): boolean {
  if (current.length === 0) {
    return !previous || previous.length === 0;
  }
  if (!previous || previous.length !== current.length) return false;
  for (let i = 0; i < current.length; i++) {
    if (normalizeText(previous[i]) !== normalizeText(current[i])) return false;
  }
  return true;
}

/** Max characters per blog content segment in one Gemini request (output stays ~3× per locale). */
export const BLOG_CONTENT_CHUNK_CHARS = 9000;

/**
 * Split long HTML/text into chunks, preferring newline boundaries.
 */
export function splitBlogContentForTranslation(
  content: string,
  maxChunk = BLOG_CONTENT_CHUNK_CHARS
): string[] {
  if (content.length <= maxChunk) return [content];
  const chunks: string[] = [];
  let start = 0;
  while (start < content.length) {
    let end = Math.min(start + maxChunk, content.length);
    if (end < content.length) {
      const nl = content.lastIndexOf("\n", end);
      if (nl > start + Math.floor(maxChunk * 0.5)) {
        end = nl + 1;
      }
    }
    chunks.push(content.slice(start, end));
    start = end;
  }
  return chunks;
}
