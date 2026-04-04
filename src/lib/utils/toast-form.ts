import { toast } from "sonner";

const VALIDATION_TITLE = "Validasi form gagal";

/**
 * Toast setelah validasi klien (Zod) gagal; field error tetap di-set oleh caller.
 */
export function toastClientValidationErrors(
  errors: Record<string, string>
): void {
  const messages = [...new Set(Object.values(errors).filter(Boolean))];
  if (messages.length === 0) {
    toast.error(VALIDATION_TITLE, {
      description: "Periksa kembali isian yang ditandai.",
    });
    return;
  }
  if (messages.length === 1) {
    toast.error(messages[0]!);
    return;
  }
  toast.error(VALIDATION_TITLE, {
    description: messages.slice(0, 8).join(" · "),
  });
}

type ApiErrorJson = {
  error?: string;
  details?: {
    fieldErrors?: Record<string, string[] | string | undefined>;
  };
};

/**
 * Toast untuk respons API gagal; jika ada fieldErrors, ringkas di deskripsi.
 */
export function toastApiValidationError(
  json: ApiErrorJson,
  fallbackMessage = "Permintaan gagal"
): void {
  const main = json.error ?? fallbackMessage;
  const raw = json.details?.fieldErrors;
  if (!raw || Object.keys(raw).length === 0) {
    toast.error(main);
    return;
  }
  const parts: string[] = [];
  for (const v of Object.values(raw)) {
    const msg = Array.isArray(v) ? v[0] : typeof v === "string" ? v : "";
    if (msg) parts.push(msg);
  }
  const unique = [...new Set(parts)];
  const description = unique.slice(0, 8).join(" · ");
  toast.error(main, description ? { description } : undefined);
}
