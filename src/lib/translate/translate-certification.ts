import { GoogleGenAI } from "@google/genai";

import { withRetry } from "./gemini-retry";

export type CertificationInput = {
  certificationId: string;
  name: string;
  image: string;
  displayOrder: number;
};

export type CertificationOutput = CertificationInput;

const LOCALE_NAMES: Record<string, string> = {
  id: "Indonesian (Bahasa Indonesia)",
  en: "English",
  zh: "Chinese (简体中文)",
};

const SOURCE_LOCALE = "id";

const nameCache = new Map<string, string>();

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return hash.toString(36);
}

async function translateCertificationNamesWithGemini(
  names: string[],
  targetLocale: string
): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const targetLang = LOCALE_NAMES[targetLocale] ?? targetLocale;
  const sourceLang = LOCALE_NAMES[SOURCE_LOCALE] ?? SOURCE_LOCALE;

  const namesJson = JSON.stringify(names);

  const prompt = `You are a professional translator. Translate certification names from ${sourceLang} to ${targetLang}.

CERTIFICATION NAMES (JSON array - preserve order, translate only if needed for target language; keep technical terms like ISO 9001:2015, SNI as-is):
${namesJson}

Return ONLY valid JSON array of translated names: ["name1","name2",...]
No markdown. Professional tone for tempered glass company. Keep brand names and standard codes unchanged.`;

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
  const parsed = JSON.parse(cleaned) as string[];
  return Array.isArray(parsed) ? parsed : names;
}

export async function translateCertifications(
  certifications: CertificationInput[],
  targetLocale: string
): Promise<CertificationOutput[]> {
  if (targetLocale === SOURCE_LOCALE) {
    return certifications;
  }
  if (!process.env.GEMINI_API_KEY) {
    return certifications;
  }

  const results: CertificationOutput[] = certifications.map((c) => ({ ...c }));
  const toTranslate: { index: number; name: string }[] = [];

  for (let i = 0; i < certifications.length; i++) {
    const c = certifications[i];
    const key = `cert:${targetLocale}:${simpleHash(c.name)}`;
    const cached = nameCache.get(key);
    if (cached) {
      results[i] = { ...c, name: cached };
    } else {
      toTranslate.push({ index: i, name: c.name });
    }
  }

  if (toTranslate.length === 0) {
    return results;
  }

  try {
    const namesToTranslate = toTranslate.map((x) => x.name);
    const translated = await translateCertificationNamesWithGemini(
      namesToTranslate,
      targetLocale
    );

    for (let i = 0; i < toTranslate.length; i++) {
      const { index } = toTranslate[i];
      const name = translated[i];
      if (name) {
        results[index] = { ...results[index], name };
        nameCache.set(
          `cert:${targetLocale}:${simpleHash(toTranslate[i].name)}`,
          name
        );
      }
    }
  } catch {
    // fallback to source on error
  }

  return results;
}
