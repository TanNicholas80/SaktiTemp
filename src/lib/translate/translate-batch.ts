import { GoogleGenAI } from "@google/genai";

import { withRetry } from "./gemini-retry";
import {
  getCached,
  setCached,
  type CachedTranslation,
} from "./translate-cache";

export type CarouselSlideInput = {
  carouselId: string;
  carouselHeading: string;
  carouselSubheading: string;
  carouselDescription: string;
  carouselImageUrl: string;
  carouselOrder: number;
};

export type CarouselSlideOutput = CarouselSlideInput;

const LOCALE_NAMES: Record<string, string> = {
  id: "Indonesian (Bahasa Indonesia)",
  en: "English",
  zh: "Chinese (简体中文)",
};

const BATCH_SIZE = 5;
const SOURCE_LOCALE = "id";

function parseJsonResponse(text: string): CachedTranslation[] {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
  const parsed = JSON.parse(cleaned) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error("Expected array response from Gemini");
  }
  return parsed.map((item) => {
    if (
      typeof item !== "object" ||
      item === null ||
      !("heading" in item) ||
      !("subheading" in item) ||
      !("description" in item)
    ) {
      throw new Error("Invalid translation item structure");
    }
    return {
      heading: String(item.heading),
      subheading: String(item.subheading),
      description: String(item.description),
    };
  });
}

async function translateBatchWithGemini(
  slides: CarouselSlideInput[],
  targetLocale: string
): Promise<CachedTranslation[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const targetLang = LOCALE_NAMES[targetLocale] ?? targetLocale;
  const sourceLang = LOCALE_NAMES[SOURCE_LOCALE] ?? SOURCE_LOCALE;

  const inputJson = JSON.stringify(
    slides.map((s) => ({
      heading: s.carouselHeading,
      subheading: s.carouselSubheading,
      description: s.carouselDescription,
    }))
  );

  const prompt = `You are a professional translator. Translate the following carousel content from ${sourceLang} to ${targetLang}.

INPUT (JSON array - preserve exact order and structure):
${inputJson}

RULES:
- Return ONLY a valid JSON array. No markdown, no explanation.
- Each element: {"heading": "...", "subheading": "...", "description": "..."}
- Preserve the same number of elements and order.
- Keep tone professional and suitable for a tempered glass company website.`;

  const ai = new GoogleGenAI({ apiKey });

  const response = await withRetry(async () => {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
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
  });

  return parseJsonResponse(response);
}

export async function translateCarouselSlides(
  slides: CarouselSlideInput[],
  targetLocale: string
): Promise<CarouselSlideOutput[]> {
  if (slides.length === 0) return [];
  if (targetLocale === SOURCE_LOCALE) {
    return slides;
  }

  if (!process.env.GEMINI_API_KEY) {
    return slides;
  }

  const results: CarouselSlideOutput[] = slides.map((s) => ({ ...s }));
  const toTranslate: { index: number; slide: CarouselSlideInput }[] = [];

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const cached = getCached(
      slide.carouselHeading,
      slide.carouselSubheading,
      slide.carouselDescription,
      targetLocale
    );
    if (cached) {
      results[i] = {
        ...slide,
        carouselHeading: cached.heading,
        carouselSubheading: cached.subheading,
        carouselDescription: cached.description,
      };
    } else {
      toTranslate.push({ index: i, slide });
    }
  }

  if (toTranslate.length === 0) {
    return results;
  }

  const batches: { index: number; slide: CarouselSlideInput }[][] = [];
  for (let i = 0; i < toTranslate.length; i += BATCH_SIZE) {
    batches.push(toTranslate.slice(i, i + BATCH_SIZE));
  }

  for (const batch of batches) {
    const batchSlides = batch.map((b) => b.slide);
    let translated: CachedTranslation[];

    try {
      translated = await translateBatchWithGemini(batchSlides, targetLocale);
    } catch (e) {
      for (const { index, slide } of batch) {
        results[index] = slide;
      }
      continue;
    }

    for (let i = 0; i < batch.length; i++) {
      const { index, slide } = batch[i];
      const t = translated[i];
      if (t) {
        results[index] = {
          ...slide,
          carouselHeading: t.heading,
          carouselSubheading: t.subheading,
          carouselDescription: t.description,
        };
        setCached(
          slide.carouselHeading,
          slide.carouselSubheading,
          slide.carouselDescription,
          targetLocale,
          t
        );
      } else {
        results[index] = slide;
      }
    }
  }

  return results;
}
