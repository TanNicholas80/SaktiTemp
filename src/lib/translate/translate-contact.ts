import { GoogleGenAI } from "@google/genai";

import { withRetry } from "./gemini-retry";

export type LocationInput = {
  locationId: string;
  locationCity: string;
  locationType: "head" | "branch";
  locationAddress: string;
  locationMapUrl: string;
  locationMapEmbedUrl: string;
};

export type LocationOutput = LocationInput;

export type ContactInput = {
  contactId: string;
  contactType: string;
  contactLabel: string;
  contactValue: string;
  contactValueExtra: string | null;
  contactIcon: string;
};

export type ContactOutput = ContactInput;

const LOCALE_NAMES: Record<string, string> = {
  id: "Indonesian (Bahasa Indonesia)",
  en: "English",
  zh: "Chinese (简体中文)",
};

const SOURCE_LOCALE = "id";

const locationCache = new Map<string, { city: string; address: string }>();
const contactCache = new Map<
  string,
  { label: string; value: string; valueExtra: string | null }
>();

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return hash.toString(36);
}

async function translateLocationsWithGemini(
  items: LocationInput[],
  targetLocale: string
): Promise<{ city: string; address: string }[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const targetLang = LOCALE_NAMES[targetLocale] ?? targetLocale;
  const sourceLang = LOCALE_NAMES[SOURCE_LOCALE] ?? SOURCE_LOCALE;

  const inputJson = JSON.stringify(
    items.map((l) => ({ city: l.locationCity, address: l.locationAddress }))
  );

  const prompt = `You are a professional translator. Translate location content from ${sourceLang} to ${targetLang}. Keep proper nouns (e.g. "Semarang", "Jakarta") as-is when they are place names.

INPUT (JSON array):
${inputJson}

Return ONLY valid JSON array: [{"city":"...","address":"..."}]
No markdown.`;

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
  const parsed = JSON.parse(cleaned) as { city: string; address: string }[];
  return Array.isArray(parsed) ? parsed : [];
}

async function translateContactsWithGemini(
  items: ContactInput[],
  targetLocale: string
): Promise<
  { label: string; value: string; valueExtra: string | null }[]
> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const targetLang = LOCALE_NAMES[targetLocale] ?? targetLocale;
  const sourceLang = LOCALE_NAMES[SOURCE_LOCALE] ?? SOURCE_LOCALE;

  const inputJson = JSON.stringify(
    items.map((c) => ({
      type: c.contactType,
      label: c.contactLabel,
      value: c.contactValue,
      valueExtra: c.contactValueExtra,
    }))
  );

  const prompt = `You are a professional translator. Translate contact content from ${sourceLang} to ${targetLang}. 
Rules: For type "email" or "phone", keep value EXACTLY as-is (do not translate). Only translate label. For valueExtra, translate if it contains translatable text.
For type "operational_hours", translate label, value, and valueExtra.

INPUT (JSON array):
${inputJson}

Return ONLY valid JSON array: [{"label":"...","value":"...","valueExtra":"..." or null}]
No markdown.`;

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
    label: string;
    value: string;
    valueExtra: string | null;
  }[];
  return Array.isArray(parsed) ? parsed : [];
}

export async function translateLocations(
  items: LocationInput[],
  targetLocale: string
): Promise<LocationOutput[]> {
  if (items.length === 0) return [];
  if (targetLocale === SOURCE_LOCALE) return items;
  if (!process.env.GEMINI_API_KEY) return items;

  const results: LocationOutput[] = items.map((l) => ({ ...l }));
  const toTranslate: { index: number; item: LocationInput }[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const key = `loc:${targetLocale}:${simpleHash(item.locationCity + item.locationAddress)}`;
    const cached = locationCache.get(key);
    if (cached) {
      results[i] = {
        ...item,
        locationCity: cached.city,
        locationAddress: cached.address,
      };
    } else {
      toTranslate.push({ index: i, item });
    }
  }

  if (toTranslate.length === 0) return results;

  try {
    const batch = toTranslate.map((x) => x.item);
    const translated = await translateLocationsWithGemini(batch, targetLocale);
    for (let i = 0; i < toTranslate.length; i++) {
      const { index, item } = toTranslate[i];
      const t = translated[i];
      if (t) {
        results[index] = {
          ...item,
          locationCity: t.city,
          locationAddress: t.address,
        };
        locationCache.set(
          `loc:${targetLocale}:${simpleHash(item.locationCity + item.locationAddress)}`,
          t
        );
      }
    }
  } catch {
    // fallback
  }
  return results;
}

export async function translateContacts(
  items: ContactInput[],
  targetLocale: string
): Promise<ContactOutput[]> {
  if (items.length === 0) return [];
  if (targetLocale === SOURCE_LOCALE) return items;
  if (!process.env.GEMINI_API_KEY) return items;

  const results: ContactOutput[] = items.map((c) => ({ ...c }));
  const toTranslate: { index: number; item: ContactInput }[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const key = `con:${targetLocale}:${simpleHash(item.contactLabel + item.contactValue + (item.contactValueExtra ?? ""))}`;
    const cached = contactCache.get(key);
    if (cached) {
      results[i] = {
        ...item,
        contactLabel: cached.label,
        contactValue: cached.value,
        contactValueExtra: cached.valueExtra,
      };
    } else {
      toTranslate.push({ index: i, item });
    }
  }

  if (toTranslate.length === 0) return results;

  try {
    const batch = toTranslate.map((x) => x.item);
    const translated = await translateContactsWithGemini(batch, targetLocale);
    for (let i = 0; i < toTranslate.length; i++) {
      const { index, item } = toTranslate[i];
      const t = translated[i];
      if (t) {
        results[index] = {
          ...item,
          contactLabel: t.label,
          contactValue: t.value,
          contactValueExtra: t.valueExtra,
        };
        contactCache.set(
          `con:${targetLocale}:${simpleHash(item.contactLabel + item.contactValue + (item.contactValueExtra ?? ""))}`,
          t
        );
      }
    }
  } catch {
    // fallback
  }
  return results;
}
