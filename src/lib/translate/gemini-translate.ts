import { GoogleGenAI } from "@google/genai";

import { withGeminiLimit } from "./gemini-limiter";
import { withRetry } from "./gemini-retry";

const LOCALE_NAMES: Record<string, string> = {
  id: "Indonesian (Bahasa Indonesia)",
  en: "English",
  zh: "Chinese (简体中文)",
};

/** All stored translation rows: canonical Indonesian, English, and Chinese. */
const ALL_LOCALES = ["id", "en", "zh"] as const;
export type StoredLocale = (typeof ALL_LOCALES)[number];
export const ALL_STORED_LOCALES: readonly StoredLocale[] = ALL_LOCALES;

/** @deprecated Use ALL_STORED_LOCALES */
export const ALL_TARGET_LOCALES = ALL_STORED_LOCALES;
/** @deprecated Use StoredLocale */
export type TargetLocale = StoredLocale;

export type TranslationResult = Record<
  StoredLocale,
  Record<string, string | string[] | null>
>;

/**
 * Normalizes input (any language) into three parallel versions: Indonesian, English, and Chinese.
 * The admin-facing row in the main table can be in any language; Gemini fills id / en / zh rows.
 */
export async function translateFields(
  fields: Record<string, string | string[] | null>,
  context: string
): Promise<TranslationResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const localeList = ALL_LOCALES.map(
    (l) => `${LOCALE_NAMES[l]} (JSON key: "${l}")`
  ).join(", ");

  const inputJson = JSON.stringify(fields, null, 2);

  const prompt = `You are a professional translator for a tempered glass manufacturing company website.

INPUT may be written in Indonesian, English, Chinese, or a mix. Your job is to produce THREE parallel versions of the same content.

TARGET LANGUAGES (all required): ${localeList}

INPUT (JSON object with field names as keys):
${inputJson}

RULES:
- Return ONLY valid JSON. No markdown, no explanation, no code fences.
- Output format: { "id": { ...same keys... }, "en": { ... }, "zh": { ... } }
- Each of "id", "en", and "zh" must have exactly the same keys as the input.
- "id" must be natural Bahasa Indonesia; "en" natural English; "zh" Simplified Chinese (简体中文).
- If the input is already in one language, still produce all three (translate or paraphrase as needed).
- If a field value is an array of strings, return a translated array of the same length for each locale.
- Keys ending with "Parts" (e.g. blogContentParts, productDescriptionParts) are ordered segments of one long text: keep the same number of segments; translate each segment; concatenating segments in order must yield the full document for that locale.
- Field "excellenceDescriptions" is an array of short bullet texts aligned by index with the product's excellence rows — same length in every locale output.
- If a field value is null, keep it null in all locales.
- Preserve phone numbers, emails, URLs, and slugs unchanged where they must not be translated.
- Keep technical terms for the glass/construction industry accurate.
- Professional corporate tone.
- Context: ${context}`;

  const ai = new GoogleGenAI({ apiKey });

  const response = await withGeminiLimit(() =>
    withRetry(async () => {
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = result.text;
      if (!text) {
        throw new Error("Empty response from Gemini");
      }
      return text;
    })
  );

  const cleaned = response
    .replace(/^```json\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned) as TranslationResult;

  for (const locale of ALL_LOCALES) {
    if (!parsed[locale] || typeof parsed[locale] !== "object") {
      throw new Error(`Missing or invalid locale "${locale}" in Gemini response`);
    }
  }

  return parsed;
}
