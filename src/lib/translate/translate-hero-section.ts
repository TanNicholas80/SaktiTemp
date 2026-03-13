import { GoogleGenAI } from "@google/genai";

import { withRetry } from "./gemini-retry";

export type BreadcrumbItem = { label: string; href: string };

export type HeroSectionInput = {
  heroSectionId: string;
  pageKey: string;
  preHeading: string | null;
  mainHeading: string;
  subHeading: string;
  description: string;
  backgroundImageUrl: string;
  scrollIndicatorText: string | null;
  scrollIndicatorVisible: boolean;
  breadcrumbItems?: BreadcrumbItem[] | null;
};

export type HeroSectionOutput = {
  heroSectionId: string;
  pageKey: string;
  preHeading: string | null;
  mainHeading: string;
  subHeading: string;
  description: string;
  backgroundImageUrl: string;
  scrollIndicatorText: string | null;
  scrollIndicatorVisible: boolean;
  breadcrumbItems?: BreadcrumbItem[] | null;
};

const LOCALE_NAMES: Record<string, string> = {
  id: "Indonesian (Bahasa Indonesia)",
  en: "English",
  zh: "Chinese (简体中文)",
};

const SOURCE_LOCALE = "id";

const cache = new Map<
  string,
  {
    preHeading: string | null;
    mainHeading: string;
    subHeading: string;
    description: string;
    breadcrumbItems?: BreadcrumbItem[] | null;
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

async function translateHeroSectionWithGemini(
  item: HeroSectionInput,
  targetLocale: string
): Promise<{
  preHeading: string | null;
  mainHeading: string;
  subHeading: string;
  description: string;
  breadcrumbItems?: BreadcrumbItem[] | null;
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const targetLang = LOCALE_NAMES[targetLocale] ?? targetLocale;
  const sourceLang = LOCALE_NAMES[SOURCE_LOCALE] ?? SOURCE_LOCALE;

  const input: Record<string, unknown> = {
    preHeading: item.preHeading,
    mainHeading: item.mainHeading,
    subHeading: item.subHeading,
    description: item.description,
  };
  if (item.breadcrumbItems && item.breadcrumbItems.length > 0) {
    input.breadcrumbItems = item.breadcrumbItems;
  }
  const inputJson = JSON.stringify(input);

  const prompt = `You are a professional translator. Translate hero section content from ${sourceLang} to ${targetLang}.
If preHeading is null or empty, return null for preHeading. Otherwise translate it.
Keep brand names and proper nouns as-is when appropriate.
If breadcrumbItems exists, translate each "label" field. Keep "href" unchanged.

INPUT (JSON object):
${inputJson}

Return ONLY valid JSON: {"preHeading":"..." or null,"mainHeading":"...","subHeading":"...","description":"...","breadcrumbItems":[{"label":"...","href":"..."}]}
No markdown. Professional tone for tempered glass/architecture company.`;

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
    preHeading?: string | null;
    mainHeading?: string;
    subHeading?: string;
    description?: string;
    breadcrumbItems?: BreadcrumbItem[];
  };
  return {
    preHeading: parsed.preHeading ?? item.preHeading,
    mainHeading: parsed.mainHeading ?? item.mainHeading,
    subHeading: parsed.subHeading ?? item.subHeading,
    description: parsed.description ?? item.description,
    breadcrumbItems:
      parsed.breadcrumbItems ?? item.breadcrumbItems ?? null,
  };
}

export async function translateHeroSection(
  item: HeroSectionInput,
  targetLocale: string
): Promise<HeroSectionOutput> {
  if (targetLocale === SOURCE_LOCALE) {
    return { ...item };
  }
  if (!process.env.GEMINI_API_KEY) {
    return { ...item };
  }

  const key = `hero:${targetLocale}:${simpleHash(
    item.mainHeading +
      item.subHeading +
      item.description +
      (item.preHeading ?? "") +
      JSON.stringify(item.breadcrumbItems ?? [])
  )}`;
  const cached = cache.get(key);
  if (cached) {
    return {
      ...item,
      preHeading: cached.preHeading,
      mainHeading: cached.mainHeading,
      subHeading: cached.subHeading,
      description: cached.description,
      breadcrumbItems: cached.breadcrumbItems ?? item.breadcrumbItems,
    };
  }

  try {
    const t = await translateHeroSectionWithGemini(item, targetLocale);
    cache.set(key, t);
    return {
      ...item,
      ...t,
    };
  } catch {
    return { ...item };
  }
}
