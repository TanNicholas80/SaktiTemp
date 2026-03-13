"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Parse stat value seperti "500+", "99%", "15" ke target number dan suffix */
function parseStatValue(str: string): {
  target: number;
  suffix: string;
  isInteger: boolean;
} {
  const match = String(str).match(/^([\d.,]+)(.*)$/);
  if (!match) return { target: 0, suffix: str, isInteger: true };
  const numStr = match[1].replace(/,/g, "");
  const target = parseFloat(numStr) || 0;
  const suffix = match[2] ?? "";
  const isInteger = Number.isInteger(target) || !numStr.includes(".");
  return { target, suffix, isInteger };
}

export type AnimatedStatValueProps = {
  value: string;
  className?: string;
  /** Delay sebelum animasi count dimulai (detik) */
  delay?: number;
  /** ScrollTrigger start (default: "top 92%") */
  scrollStart?: string;
  /** ScrollTrigger end (default: "top 55%") */
  scrollEnd?: string;
};

export function AnimatedStatValue({
  value,
  className,
  delay = 0.35,
  scrollStart = "top 92%",
  scrollEnd = "top 55%",
}: AnimatedStatValueProps) {
  const spanRef = React.useRef<HTMLSpanElement>(null);
  const { target, suffix, isInteger } = parseStatValue(value);

  React.useEffect(() => {
    if (!spanRef.current) return;
    const obj = { value: 0 };
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: spanRef.current,
        start: scrollStart,
        end: scrollEnd,
        toggleActions: "play none none none",
      },
      delay,
    });
    tl.to(obj, {
      value: target,
      duration: 1.5,
      ease: "power2.out",
      overwrite: "auto",
      onUpdate: () => {
        if (spanRef.current) {
          const val = obj.value;
          const display = isInteger
            ? Math.round(val).toLocaleString()
            : val.toFixed(1);
          spanRef.current.textContent = display + suffix;
        }
      },
    });
    return () => {
      tl.kill();
      tl.scrollTrigger?.kill();
    };
  }, [target, suffix, isInteger, delay, scrollStart, scrollEnd]);

  const initialDisplay =
    target === 0 ? "0" + suffix : (isInteger ? "0" : "0.0") + suffix;

  return (
    <span ref={spanRef} className={className}>
      {initialDisplay}
    </span>
  );
}
