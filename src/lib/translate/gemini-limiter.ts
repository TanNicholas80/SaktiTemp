/**
 * Global concurrency limiter for Gemini API calls.
 * Prevents 429 Too Many Requests by ensuring at most MAX_CONCURRENT
 * requests are in-flight at any given time across the entire process.
 */

const MAX_CONCURRENT = 2;
let running = 0;
const queue: Array<{ resolve: () => void }> = [];

export async function withGeminiLimit<T>(fn: () => Promise<T>): Promise<T> {
  if (running >= MAX_CONCURRENT) {
    await new Promise<void>((resolve) => {
      queue.push({ resolve });
    });
  }

  running++;
  try {
    return await fn();
  } finally {
    running--;
    const next = queue.shift();
    if (next) next.resolve();
  }
}
