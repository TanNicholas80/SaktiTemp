import { GoogleGenAI } from "@google/genai";

import { withRetry } from "./gemini-retry";

export type BlogInput = {
  blogId: string;
  blogTitle: string;
  blogSlug: string;
  blogExcerpt: string;
  blogImageUrl: string;
  blogIsPublishedAt: string;
  categoryName: string | null;
  categorySlug: string | null;
};

export type BlogOutput = BlogInput;

const LOCALE_NAMES: Record<string, string> = {
  id: "Indonesian (Bahasa Indonesia)",
  en: "English",
  zh: "Chinese (简体中文)",
};

const SOURCE_LOCALE = "id";

const blogCache = new Map<
  string,
  { title: string; excerpt: string; categoryName: string | null }
>();

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return hash.toString(36);
}

async function translateBlogsWithGemini(
  blogs: BlogInput[],
  targetLocale: string
): Promise<
  { title: string; excerpt: string; categoryName: string | null }[]
> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const targetLang = LOCALE_NAMES[targetLocale] ?? targetLocale;
  const sourceLang = LOCALE_NAMES[SOURCE_LOCALE] ?? SOURCE_LOCALE;

  const inputJson = JSON.stringify(
    blogs.map((b) => ({
      title: b.blogTitle,
      excerpt: b.blogExcerpt,
      categoryName: b.categoryName,
    }))
  );

  const prompt = `You are a professional translator. Translate blog content from ${sourceLang} to ${targetLang}.

INPUT (JSON array - preserve order):
${inputJson}

Return ONLY valid JSON array:
[{"title":"...","excerpt":"...","categoryName":"..." or null}]
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
    title: string;
    excerpt: string;
    categoryName: string | null;
  }[];
  return Array.isArray(parsed) ? parsed : [];
}

export async function translateBlogs(
  blogs: BlogInput[],
  targetLocale: string
): Promise<BlogOutput[]> {
  if (blogs.length === 0) return [];
  if (targetLocale === SOURCE_LOCALE) return blogs;
  if (!process.env.GEMINI_API_KEY) return blogs;

  const results: BlogOutput[] = blogs.map((b) => ({ ...b }));
  const toTranslate: { index: number; blog: BlogInput }[] = [];

  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i];
    const key = `blog:${targetLocale}:${simpleHash(blog.blogTitle + blog.blogExcerpt + (blog.categoryName ?? ""))}`;
    const cached = blogCache.get(key);
    if (cached) {
      results[i] = {
        ...blog,
        blogTitle: cached.title,
        blogExcerpt: cached.excerpt,
        categoryName: cached.categoryName,
      };
    } else {
      toTranslate.push({ index: i, blog });
    }
  }

  if (toTranslate.length === 0) return results;

  try {
    const batch = toTranslate.map((x) => x.blog);
    const translated = await translateBlogsWithGemini(batch, targetLocale);

    for (let i = 0; i < toTranslate.length; i++) {
      const { index, blog } = toTranslate[i];
      const t = translated[i];
      if (t) {
        results[index] = {
          ...blog,
          blogTitle: t.title,
          blogExcerpt: t.excerpt,
          categoryName: t.categoryName,
        };
        blogCache.set(
          `blog:${targetLocale}:${simpleHash(blog.blogTitle + blog.blogExcerpt + (blog.categoryName ?? ""))}`,
          t
        );
      }
    }
  } catch {
    // fallback to source
  }

  return results;
}
