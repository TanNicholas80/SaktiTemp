import { GoogleGenAI } from "@google/genai";

import { withRetry } from "./gemini-retry";

export type ServiceInput = {
  serviceId: string;
  serviceName: string;
  serviceDescription: string;
  serviceIcon: string;
  serviceIsPublished: boolean;
  servicePoints: string[];
  serviceBtnText: string;
  serviceBtnLink: string;
};

export type ServiceOutput = ServiceInput;

const LOCALE_NAMES: Record<string, string> = {
  id: "Indonesian (Bahasa Indonesia)",
  en: "English",
  zh: "Chinese (简体中文)",
};

const SOURCE_LOCALE = "id";

const cache = new Map<string, ServiceOutput>();

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return hash.toString(36);
}

async function translateServicesWithGemini(
  items: ServiceInput[],
  targetLocale: string
): Promise<
  {
    name: string;
    description: string;
    points: string[];
    btnText: string;
  }[]
> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const targetLang = LOCALE_NAMES[targetLocale] ?? targetLocale;
  const sourceLang = LOCALE_NAMES[SOURCE_LOCALE] ?? SOURCE_LOCALE;

  const inputJson = JSON.stringify(
    items.map((s) => ({
      name: s.serviceName,
      description: s.serviceDescription,
      points: s.servicePoints,
      btnText: s.serviceBtnText,
    }))
  );

  const prompt = `You are a professional translator for a tempered glass manufacturing company. Translate from ${sourceLang} to ${targetLang}.

INPUT (JSON array):
${inputJson}

Return ONLY valid JSON array:
[{"name":"...","description":"...","points":["...","..."],"btnText":"..."}]
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
    description: string;
    points: string[];
    btnText: string;
  }[];
  return Array.isArray(parsed)
    ? parsed
    : items.map((s) => ({
        name: s.serviceName,
        description: s.serviceDescription,
        points: s.servicePoints,
        btnText: s.serviceBtnText,
      }));
}

export async function translateServices(
  items: ServiceInput[],
  targetLocale: string
): Promise<ServiceOutput[]> {
  if (items.length === 0) return [];
  if (targetLocale === SOURCE_LOCALE) {
    return items.map((s) => ({ ...s }));
  }
  if (!process.env.GEMINI_API_KEY) {
    return items.map((s) => ({ ...s }));
  }

  const results: ServiceOutput[] = items.map((s) => ({ ...s }));
  const toTranslate: { index: number; item: ServiceInput }[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const key = `svc:${targetLocale}:${simpleHash(item.serviceName)}`;
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
    const translated = await translateServicesWithGemini(batch, targetLocale);
    for (let i = 0; i < toTranslate.length; i++) {
      const { index, item } = toTranslate[i];
      const t = translated[i];
      if (t) {
        const out: ServiceOutput = {
          ...item,
          serviceName: t.name,
          serviceDescription: t.description,
          servicePoints: t.points,
          serviceBtnText: t.btnText,
        };
        results[index] = out;
        cache.set(`svc:${targetLocale}:${simpleHash(item.serviceName)}`, out);
      }
    }
  } catch {
    // fallback to original
  }

  return results;
}
