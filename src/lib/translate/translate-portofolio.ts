import { GoogleGenAI } from "@google/genai";

import { withRetry } from "./gemini-retry";

export type PortofolioInput = {
  portofolioId: string;
  portofolioName: string;
  portofolioSlug: string;
  portofolioShortDescription: string;
  portofolioLocation: string;
  portofolioImageUrl: string;
  portofolioIsPublishedAt: string;
  categoryName: string | null;
  categorySlug: string | null;
};

export type PortofolioOutput = PortofolioInput;

const LOCALE_NAMES: Record<string, string> = {
  id: "Indonesian (Bahasa Indonesia)",
  en: "English",
  zh: "Chinese (简体中文)",
};

const SOURCE_LOCALE = "id";

const portofolioCache = new Map<
  string,
  {
    name: string;
    shortDescription: string;
    location: string;
    categoryName: string | null;
  }
>();

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return hash.toString(36);
}

async function translatePortofoliosWithGemini(
  items: PortofolioInput[],
  targetLocale: string
): Promise<
  {
    name: string;
    shortDescription: string;
    location: string;
    categoryName: string | null;
  }[]
> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const targetLang = LOCALE_NAMES[targetLocale] ?? targetLocale;
  const sourceLang = LOCALE_NAMES[SOURCE_LOCALE] ?? SOURCE_LOCALE;

  const inputJson = JSON.stringify(
    items.map((p) => ({
      name: p.portofolioName,
      shortDescription: p.portofolioShortDescription,
      location: p.portofolioLocation,
      categoryName: p.categoryName,
    }))
  );

  const prompt = `You are a professional translator. Translate portfolio/project content from ${sourceLang} to ${targetLang}.

INPUT (JSON array - preserve order):
${inputJson}

Return ONLY valid JSON array:
[{"name":"...","shortDescription":"...","location":"...","categoryName":"..." or null}]
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
  const parsed = JSON.parse(cleaned) as {
    name: string;
    shortDescription: string;
    location: string;
    categoryName: string | null;
  }[];
  return Array.isArray(parsed) ? parsed : [];
}

export async function translatePortofolios(
  items: PortofolioInput[],
  targetLocale: string
): Promise<PortofolioOutput[]> {
  if (items.length === 0) return [];
  if (targetLocale === SOURCE_LOCALE) return items;
  if (!process.env.GEMINI_API_KEY) return items;

  const results: PortofolioOutput[] = items.map((p) => ({ ...p }));
  const toTranslate: { index: number; item: PortofolioInput }[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const key = `pf:${targetLocale}:${simpleHash(item.portofolioName + item.portofolioShortDescription + item.portofolioLocation + (item.categoryName ?? ""))}`;
    const cached = portofolioCache.get(key);
    if (cached) {
      results[i] = {
        ...item,
        portofolioName: cached.name,
        portofolioShortDescription: cached.shortDescription,
        portofolioLocation: cached.location,
        categoryName: cached.categoryName,
      };
    } else {
      toTranslate.push({ index: i, item });
    }
  }

  if (toTranslate.length === 0) return results;

  try {
    const batch = toTranslate.map((x) => x.item);
    const translated = await translatePortofoliosWithGemini(batch, targetLocale);

    for (let i = 0; i < toTranslate.length; i++) {
      const { index, item } = toTranslate[i];
      const t = translated[i];
      if (t) {
        results[index] = {
          ...item,
          portofolioName: t.name,
          portofolioShortDescription: t.shortDescription,
          portofolioLocation: t.location,
          categoryName: t.categoryName,
        };
        portofolioCache.set(
          `pf:${targetLocale}:${simpleHash(item.portofolioName + item.portofolioShortDescription + item.portofolioLocation + (item.categoryName ?? ""))}`,
          t
        );
      }
    }
  } catch {
    // fallback to source
  }

  return results;
}
