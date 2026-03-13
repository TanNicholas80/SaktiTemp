import { GoogleGenAI } from "@google/genai";

import { withRetry } from "./gemini-retry";

export type CategoryPortofolioInput = {
  categoryPortofolioId: string;
  categoryPortofolioName: string;
  categoryPortofolioSlug: string;
  categoryPortofolioIcon: string;
  categoryPortofolioImage: string;
  categoryPortofolioDescription: string;
};

export type CategoryPortofolioOutput = CategoryPortofolioInput;

const LOCALE_NAMES: Record<string, string> = {
  id: "Indonesian (Bahasa Indonesia)",
  en: "English",
  zh: "Chinese (简体中文)",
};

const SOURCE_LOCALE = "id";

const cache = new Map<string, { name: string; description: string }>();

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return hash.toString(36);
}

async function translateCategoryPortofolioWithGemini(
  items: { name: string; description: string }[],
  targetLocale: string
): Promise<{ name: string; description: string }[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const targetLang = LOCALE_NAMES[targetLocale] ?? targetLocale;
  const sourceLang = LOCALE_NAMES[SOURCE_LOCALE] ?? SOURCE_LOCALE;

  const inputJson = JSON.stringify(items);

  const prompt = `You are a professional translator. Translate industry/category names and descriptions for a tempered glass company from ${sourceLang} to ${targetLang}.
Keep industry terms consistent (e.g. "Residential", "Commercial", "Architectural"). Preserve proper nouns and brand names.

INPUT (JSON array of {name, description}):
${inputJson}

Return ONLY valid JSON array: [{"name":"...","description":"..."}]
No markdown. Professional tone for tempered glass/architecture industry.`;

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
  const parsed = JSON.parse(cleaned) as { name: string; description: string }[];
  return Array.isArray(parsed) ? parsed : items.map((i) => ({ name: i.name, description: i.description }));
}

export async function translateCategoryPortofolios(
  items: CategoryPortofolioInput[],
  targetLocale: string
): Promise<CategoryPortofolioOutput[]> {
  if (items.length === 0) return [];
  if (targetLocale === SOURCE_LOCALE) {
    return items.map((c) => ({ ...c }));
  }
  if (!process.env.GEMINI_API_KEY) {
    return items.map((c) => ({ ...c }));
  }

  const results: CategoryPortofolioOutput[] = items.map((c) => ({ ...c }));
  const toTranslate: { index: number; item: CategoryPortofolioInput }[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const key = `catport:${targetLocale}:${simpleHash(item.categoryPortofolioName)}:${simpleHash(item.categoryPortofolioDescription)}`;
    const cached = cache.get(key);
    if (cached) {
      results[i] = {
        ...item,
        categoryPortofolioName: cached.name,
        categoryPortofolioDescription: cached.description,
      };
    } else {
      toTranslate.push({ index: i, item });
    }
  }

  if (toTranslate.length === 0) return results;

  try {
    const batch = toTranslate.map((x) => ({
      name: x.item.categoryPortofolioName,
      description: x.item.categoryPortofolioDescription || "",
    }));
    const translated = await translateCategoryPortofolioWithGemini(
      batch,
      targetLocale
    );
    for (let i = 0; i < toTranslate.length; i++) {
      const { index, item } = toTranslate[i];
      const t = translated[i];
      if (t) {
        results[index] = {
          ...item,
          categoryPortofolioName: t.name,
          categoryPortofolioDescription: t.description,
        };
        cache.set(
          `catport:${targetLocale}:${simpleHash(item.categoryPortofolioName)}:${simpleHash(item.categoryPortofolioDescription)}`,
          t
        );
      }
    }
  } catch {
    // fallback to original
  }
  return results;
}
