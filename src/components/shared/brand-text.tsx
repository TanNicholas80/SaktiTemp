import * as React from "react";

type BrandTextProps = {
  text: string;
  className?: string;
};

// Regex to match "saktitemp" safely (only as a standalone brand name, not in URLs/emails/filenames)
// Also matches optional existing trademark symbols to prevent duplication.
const BRAND_REGEX = /(<[^>]+>|(?<![\w@/-])saktitemp(?![\w.-])(?:\s*®|\s*&reg;|\s*<sup>\s*(?:®|&reg;)\s*<\/sup>)?)/gi;

/**
 * React component that renders text, wrapping any occurrence of "Saktitemp" with a superscript ®.
 * Safe for inline text strings.
 */
export function BrandText({ text, className }: BrandTextProps) {
  if (!text) return null;

  const parts = text.split(BRAND_REGEX);
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (!part) return null;
        
        // If it's a match of our brand name
        const isBrand = part.toLowerCase() === "saktitemp";
        if (isBrand) {
          return (
            <React.Fragment key={index}>
              {part}
              <sup className="select-none font-semibold">®</sup>
            </React.Fragment>
          );
        }
        
        // If it matches the full brand pattern including existing symbols, we skip rendering the duplicate symbol
        // (split captures all groups, so we filter them here)
        if (part.toLowerCase().includes("saktitemp")) {
          const cleanBrand = part.replace(/(?:\s*®|\s*&reg;|\s*<sup>\s*(?:®|&reg;)\s*<\/sup>)/gi, "");
          return (
            <React.Fragment key={index}>
              {cleanBrand}
              <sup className="select-none font-semibold">®</sup>
            </React.Fragment>
          );
        }

        return part;
      })}
    </span>
  );
}

/**
 * Utility function to format raw HTML strings, safely replacing "Saktitemp" with "Saktitemp<sup>®</sup>"
 * without modifying HTML tags or attributes (e.g. href, src).
 */
export function formatBrandHtml(html: string): string {
  if (!html) return "";

  return html.replace(BRAND_REGEX, (match) => {
    if (match.startsWith("<")) {
      // It's an HTML tag, leave it unchanged
      return match;
    }
    // It's the brand name, strip any existing trademark symbol variations and replace with <sup>®</sup>
    const brandName = match.replace(/(?:\s*®|\s*&reg;|\s*<sup>\s*(?:®|&reg;)\s*<\/sup>)/gi, "");
    return `${brandName}<sup>®</sup>`;
  });
}
