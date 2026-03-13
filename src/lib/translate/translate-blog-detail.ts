import { GoogleGenAI } from "@google/genai";

import { withRetry } from "./gemini-retry";

export type BlogDetailInput = {
  blogId: string;
  blogTitle: string;
  blogSlug: string;
  blogExcerpt: string;
  blogContent: string;
  blogImageUrl: string;
  blogIsPublishedAt: string;
  categoryName: string | null;
  categorySlug: string | null;
};

export type BlogDetailOutput = BlogDetailInput;

const LOCALE_NAMES: Record<string, string> = {
  id: "Indonesian (Bahasa Indonesia)",
  en: "English",
  zh: "Chinese (简体中文)",
};

const SOURCE_LOCALE = "id";

const cache = new Map<
  string,
  { title: string; excerpt: string; content: string; categoryName: string | null }
>();

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return hash.toString(36);
}

async function translateBlogDetailWithGemini(
  item: BlogDetailInput,
  targetLocale: string
): Promise<{ title: string; excerpt: string; content: string; categoryName: string | null }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const targetLang = LOCALE_NAMES[targetLocale] ?? targetLocale;
  const sourceLang = LOCALE_NAMES[SOURCE_LOCALE] ?? SOURCE_LOCALE;

  const prompt = `You are a professional translator. Translate blog article content from ${sourceLang} to ${targetLang}.

Translate the following fields. Preserve HTML structure in blogContent. Keep tags like <h1>, <h2>, <p>, <ul>, <li>, <strong>, etc. Only translate the text content inside the tags, not the tags themselves.

INPUT (JSON):
{
  "title": ${JSON.stringify(item.blogTitle)},
  "excerpt": ${JSON.stringify(item.blogExcerpt)},
  "content": ${JSON.stringify(item.blogContent)},
  "categoryName": ${JSON.stringify(item.categoryName)}
}

Return ONLY valid JSON:
{"title":"...","excerpt":"...","content":"...","categoryName":"..." or null}
No markdown. Professional tone for tempered glass industry blog.`;

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
    title?: string;
    excerpt?: string;
    content?: string;
    categoryName?: string | null;
  };
  return {
    title: parsed.title ?? item.blogTitle,
    excerpt: parsed.excerpt ?? item.blogExcerpt,
    content: parsed.content ?? item.blogContent,
    categoryName: parsed.categoryName ?? item.categoryName,
  };
}

export async function translateBlogDetail(
  item: BlogDetailInput,
  targetLocale: string
): Promise<BlogDetailOutput> {
  if (targetLocale === SOURCE_LOCALE) return { ...item };
  if (!process.env.GEMINI_API_KEY) return { ...item };

  const key = `blogdetail:${targetLocale}:${simpleHash(
    item.blogTitle + item.blogExcerpt + item.blogContent + (item.categoryName ?? "")
  )}`;
  const cached = cache.get(key);
  if (cached) {
    return {
      ...item,
      blogTitle: cached.title,
      blogExcerpt: cached.excerpt,
      blogContent: cached.content,
      categoryName: cached.categoryName,
    };
  }

  try {
    const t = await translateBlogDetailWithGemini(item, targetLocale);
    cache.set(key, t);
    return {
      ...item,
      blogTitle: t.title,
      blogExcerpt: t.excerpt,
      blogContent: t.content,
      categoryName: t.categoryName,
    };
  } catch {
    return { ...item };
  }
}
