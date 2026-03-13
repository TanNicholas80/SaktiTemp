/**
 * Retry helper dengan exponential backoff + jitter untuk handle 429 (Too Many Requests).
 * Mencegah thundering herd dengan menambah random jitter pada delay.
 */

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000;
const MAX_DELAY_MS = 60_000;

function getRetryDelay(attempt: number): number {
  const exponential = Math.min(
    BASE_DELAY_MS * Math.pow(2, attempt),
    MAX_DELAY_MS
  );
  const jitter = exponential * 0.5 * Math.random();
  return exponential + jitter;
}

function isRetryableError(e: unknown): boolean {
  const err = e as { status?: number; code?: number; cause?: { status?: number } };
  const status = err?.status ?? err?.code ?? err?.cause?.status;
  return status === 429;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: { isRetryable?: (e: unknown) => boolean }
): Promise<T> {
  const isRetryable = options?.isRetryable ?? isRetryableError;
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      if (attempt === MAX_RETRIES || !isRetryable(e)) {
        throw e;
      }
      const delay = getRetryDelay(attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
