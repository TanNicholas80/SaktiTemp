import { GoogleGenAI } from "@google/genai";

import { withRetry } from "./gemini-retry";

export type ProductInput = {
  productId: string;
  productName: string;
  productShortDescription: string;
  productDescription: string;
  excellences: string[];
};

export type ProductOutput = {
  productId: string;
  productName: string;
  productShortDescription: string;
  productDescription: string;
  excellences: string[];
};

const LOCALE_NAMES: Record<string, string> = {
  id: "Indonesian (Bahasa Indonesia)",
  en: "English",
  zh: "Chinese (简体中文)",
};

const SOURCE_LOCALE = "id";

const cache = new Map<string, ProductOutput>();

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return hash.toString(36);
}

async function translateProductsWithGemini(
  items: ProductInput[],
  targetLocale: string
): Promise<
  { name: string; shortDescription: string; description: string; excellences: string[] }[]
> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const targetLang = LOCALE_NAMES[targetLocale] ?? targetLocale;
  const sourceLang = LOCALE_NAMES[SOURCE_LOCALE] ?? SOURCE_LOCALE;

  const inputJson = JSON.stringify(
    items.map((p) => ({
      name: p.productName,
      shortDescription: p.productShortDescription,
      description: p.productDescription,
      excellences: p.excellences,
    }))
  );

  const prompt = `You are a professional translator for a tempered glass manufacturing company. Translate from ${sourceLang} to ${targetLang}.

INPUT (JSON array):
${inputJson}

Return ONLY valid JSON array:
[{"name":"...","shortDescription":"...","description":"...","excellences":["...","..."]}]
No markdown. Keep technical terms for glass/construction industry. Professional tone.`;

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
  const parsed = JSON.parse(cleaned) as {
    name: string;
    shortDescription: string;
    description: string;
    excellences: string[];
  }[];
  return Array.isArray(parsed)
    ? parsed
    : items.map((p) => ({
        name: p.productName,
        shortDescription: p.productShortDescription,
        description: p.productDescription,
        excellences: p.excellences,
      }));
}

export async function translateProducts(
  items: ProductInput[],
  targetLocale: string
): Promise<ProductOutput[]> {
  if (items.length === 0) return [];
  if (targetLocale === SOURCE_LOCALE) {
    return items.map((p) => ({ ...p }));
  }
  if (!process.env.GEMINI_API_KEY) {
    return items.map((p) => ({ ...p }));
  }

  const results: ProductOutput[] = items.map((p) => ({ ...p }));
  const toTranslate: { index: number; item: ProductInput }[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const key = `prod:${targetLocale}:${simpleHash(item.productName)}`;
    const cached = cache.get(key);
    if (cached) {
      results[i] = cached;
    } else {
      toTranslate.push({ index: i, item });
    }
  }

  if (toTranslate.length === 0) return results;

  try {
    const batch = toTranslate.map((x) => x.item);
    const translated = await translateProductsWithGemini(batch, targetLocale);
    for (let i = 0; i < toTranslate.length; i++) {
      const { index, item } = toTranslate[i];
      const t = translated[i];
      if (t) {
        const out: ProductOutput = {
          ...item,
          productName: t.name,
          productShortDescription: t.shortDescription,
          productDescription: t.description,
          excellences: t.excellences,
        };
        results[index] = out;
        cache.set(`prod:${targetLocale}:${simpleHash(item.productName)}`, out);
      }
    }
  } catch {
    // fallback to original
  }

  return results;
}
