import { GoogleGenAI } from "@google/genai";

import { withRetry } from "./gemini-retry";

export type BenefitInput = {
  benefitId: string;
  benefitName: string;
  benefitDescription: string;
  benefitIcon: string;
};

export type BenefitOutput = BenefitInput;

export type CompanyStatInput = {
  companyStatId: string;
  value: string;
  label: string;
  displayOrder: number;
};

export type CompanyStatOutput = CompanyStatInput;

const LOCALE_NAMES: Record<string, string> = {
  id: "Indonesian (Bahasa Indonesia)",
  en: "English",
  zh: "Chinese (简体中文)",
};

const SOURCE_LOCALE = "id";

const benefitCache = new Map<string, { name: string; description: string }>();
const statCache = new Map<string, string>();

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return hash.toString(36);
}

async function translateBenefitsAndStatsWithGemini(
  benefits: BenefitInput[],
  stats: CompanyStatInput[],
  targetLocale: string
): Promise<{
  benefits: { name: string; description: string }[];
  stats: { label: string }[];
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const targetLang = LOCALE_NAMES[targetLocale] ?? targetLocale;
  const sourceLang = LOCALE_NAMES[SOURCE_LOCALE] ?? SOURCE_LOCALE;

  const benefitsJson = JSON.stringify(
    benefits.map((b) => ({ name: b.benefitName, description: b.benefitDescription }))
  );
  const statsJson = JSON.stringify(stats.map((s) => ({ label: s.label })));

  const prompt = `You are a professional translator. Translate from ${sourceLang} to ${targetLang}.

BENEFITS (JSON array - preserve order):
${benefitsJson}

STATS (JSON array - preserve order, translate only "label", values like "15+", "500+", "99%" stay as-is):
${statsJson}

Return ONLY valid JSON:
{"benefits":[{"name":"...","description":"..."}],"stats":[{"label":"..."}]}
No markdown. Professional tone for tempered glass company.`;

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
    benefits?: { name: string; description: string }[];
    stats?: { label: string }[];
  };
  return {
    benefits: parsed.benefits ?? [],
    stats: parsed.stats ?? [],
  };
}

export async function translateBenefitsAndStats(
  benefits: BenefitInput[],
  stats: CompanyStatInput[],
  targetLocale: string
): Promise<{ benefits: BenefitOutput[]; stats: CompanyStatOutput[] }> {
  if (targetLocale === SOURCE_LOCALE) {
    return { benefits, stats };
  }
  if (!process.env.GEMINI_API_KEY) {
    return { benefits, stats };
  }

  const benefitResults: BenefitOutput[] = benefits.map((b) => ({ ...b }));
  const statResults: CompanyStatOutput[] = stats.map((s) => ({ ...s }));

  const benefitsToTranslate: { index: number; benefit: BenefitInput }[] = [];
  const statsToTranslate: { index: number; stat: CompanyStatInput }[] = [];

  for (let i = 0; i < benefits.length; i++) {
    const key = `b:${targetLocale}:${simpleHash(benefits[i].benefitName + benefits[i].benefitDescription)}`;
    const cached = benefitCache.get(key);
    if (cached) {
      benefitResults[i] = {
        ...benefits[i],
        benefitName: cached.name,
        benefitDescription: cached.description,
      };
    } else {
      benefitsToTranslate.push({ index: i, benefit: benefits[i] });
    }
  }

  for (let i = 0; i < stats.length; i++) {
    const key = `s:${targetLocale}:${simpleHash(stats[i].label)}`;
    const cached = statCache.get(key);
    if (cached) {
      statResults[i] = { ...stats[i], label: cached };
    } else {
      statsToTranslate.push({ index: i, stat: stats[i] });
    }
  }

  if (benefitsToTranslate.length === 0 && statsToTranslate.length === 0) {
    return { benefits: benefitResults, stats: statResults };
  }

  try {
    const batchBenefits = benefitsToTranslate.map((x) => x.benefit);
    const batchStats = statsToTranslate.map((x) => x.stat);
    if (batchBenefits.length === 0 && batchStats.length === 0) {
      return { benefits: benefitResults, stats: statResults };
    }
    const { benefits: tb, stats: ts } = await translateBenefitsAndStatsWithGemini(
      batchBenefits,
      batchStats,
      targetLocale
    );

    for (let i = 0; i < benefitsToTranslate.length; i++) {
      const { index, benefit } = benefitsToTranslate[i];
      const t = tb[i];
      if (t) {
        benefitResults[index] = {
          ...benefit,
          benefitName: t.name,
          benefitDescription: t.description,
        };
        benefitCache.set(
          `b:${targetLocale}:${simpleHash(benefit.benefitName + benefit.benefitDescription)}`,
          t
        );
      }
    }

    for (let i = 0; i < statsToTranslate.length; i++) {
      const { index, stat } = statsToTranslate[i];
      const t = ts[i];
      if (t) {
        statResults[index] = { ...stat, label: t.label };
        statCache.set(`s:${targetLocale}:${simpleHash(stat.label)}`, t.label);
      }
    }
  } catch {
    // fallback to source on error
  }

  return { benefits: benefitResults, stats: statResults };
}
