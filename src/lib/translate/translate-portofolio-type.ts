import { GoogleGenAI } from "@google/genai";

import { withRetry } from "./gemini-retry";

export type PortofolioTypeInput = {
  portofolioTypeId: string;
  portofolioTypeName: string;
  portofolioTypeSlug: string;
};

export type PortofolioTypeOutput = PortofolioTypeInput;

const LOCALE_NAMES: Record<string, string> = {
  id: "Indonesian (Bahasa Indonesia)",
  en: "English",
  zh: "Chinese (简体中文)",
};

const SOURCE_LOCALE = "id";

const cache = new Map<string, string>();

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return hash.toString(36);
}

async function translatePortofolioTypesWithGemini(
  items: PortofolioTypeInput[],
  targetLocale: string
): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const targetLang = LOCALE_NAMES[targetLocale] ?? targetLocale;
  const sourceLang = LOCALE_NAMES[SOURCE_LOCALE] ?? SOURCE_LOCALE;

  const inputJson = JSON.stringify(items.map((p) => ({ name: p.portofolioTypeName })));

  const prompt = `You are a professional translator for a tempered glass/architecture company. Translate project type names from ${sourceLang} to ${targetLang}.

INPUT (JSON array):
${inputJson}

Return ONLY valid JSON array: [{"name":"..."}]
No markdown. Professional tone for construction/architecture industry.`;

  const ai = new GoogleGenAI({ apiKey });
  const response = await withRetry(async () => {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });
    const text = result.text;
    if (!text) throw new Error("Empty response from Gemini");
    return text;
  });

  const cleaned = response
    .replace(/^```json\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
  const parsed = JSON.parse(cleaned) as { name: string }[];
  const arr = Array.isArray(parsed) ? parsed : [];
  return arr.map((x) => x?.name ?? "");
}

export async function translatePortofolioTypes(
  items: PortofolioTypeInput[],
  targetLocale: string
): Promise<PortofolioTypeOutput[]> {
  if (items.length === 0) return [];
  if (targetLocale === SOURCE_LOCALE) {
    return items.map((p) => ({ ...p }));
  }
  if (!process.env.GEMINI_API_KEY) {
    return items.map((p) => ({ ...p }));
  }

  const results: PortofolioTypeOutput[] = items.map((p) => ({ ...p }));
  const toTranslate: { index: number; item: PortofolioTypeInput }[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const key = `pt:${targetLocale}:${simpleHash(item.portofolioTypeName)}`;
    const cached = cache.get(key);
    if (cached) {
      results[i] = { ...item, portofolioTypeName: cached };
    } else {
      toTranslate.push({ index: i, item });
    }
  }

  if (toTranslate.length === 0) return results;

  try {
    const batch = toTranslate.map((x) => x.item);
    const translated = await translatePortofolioTypesWithGemini(batch, targetLocale);
    for (let i = 0; i < toTranslate.length; i++) {
      const { index, item } = toTranslate[i];
      const name = translated[i];
      if (name) {
        results[index] = { ...item, portofolioTypeName: name };
        cache.set(`pt:${targetLocale}:${simpleHash(item.portofolioTypeName)}`, name);
      }
    }
  } catch {
    // fallback to original
  }

  return results;
}
