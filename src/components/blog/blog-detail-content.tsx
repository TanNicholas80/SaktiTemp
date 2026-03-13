"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { BlogDetailData } from "./types";

gsap.registerPlugin(ScrollTrigger);

type BlogDetailContentProps = {
  blog: BlogDetailData;
};

const PROSE_CLASS =
  "prose prose-sm dark:prose-invert max-w-none text-foreground [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:first:mt-0 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:my-3 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_li]:my-1 [&_strong]:font-semibold [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/90";

export function BlogDetailContent({ blog }: BlogDetailContentProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );
      }
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={contentRef}>
      <article
        className={PROSE_CLASS}
        dangerouslySetInnerHTML={{ __html: blog.blogContent }}
      />
    </div>
  );
}
