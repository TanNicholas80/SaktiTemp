"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { Play } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "/aset_video_saktitemp.mp4";
const POSTER_SRC = "/about-video.jpg";

export function VideoSection() {
  const t = useTranslations("videoSection");
  const sectionRef = React.useRef<HTMLElement>(null);
  const videoColRef = React.useRef<HTMLDivElement>(null);
  const textColRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const togglePlay = React.useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      if (videoColRef.current) {
        gsap.fromTo(
          videoColRef.current,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: videoColRef.current,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      }
      if (textColRef.current) {
        const nodes = textColRef.current.querySelectorAll("[data-animate-video]");
        gsap.fromTo(
          nodes,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: textColRef.current,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex w-full overflow-hidden"
    >
      <div
        className={cn(
          "flex w-full flex-col",
          "min-h-[480px] sm:min-h-[550px] md:min-h-[60vh] lg:min-h-[70vh]",
          "md:flex-row"
        )}
      >
        {/* Left: Video area 30% width - thumbnail bawaan video */}
        <div
          ref={videoColRef}
          className={cn(
            "relative order-2 w-full shrink-0 md:order-1 md:w-[30%] md:min-h-0",
            "h-[220px] min-h-[220px] sm:h-[280px] sm:min-h-[280px]",
            "md:h-auto md:min-h-[60vh] lg:min-h-[70vh]"
          )}
        >
          <div className="relative h-full w-full overflow-hidden bg-primary">
            {/* Video element - thumbnail default dari video (first frame) */}
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              preload="metadata"
              className="absolute inset-0 z-0 h-full w-full object-cover"
              playsInline
              onClick={togglePlay}
            />
            {/* Red-maroon overlay - lighter when playing so video is visible */}
            <div
              className={cn(
                "absolute inset-0 cursor-pointer bg-primary/70 transition-opacity duration-500",
                isPlaying && "pointer-events-none bg-primary/30"
              )}
              aria-hidden
              onClick={togglePlay}
            />
            {/* Logo + Play button overlay - visible when not playing */}
            <div
              className={cn(
                "absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 transition-opacity duration-300 sm:gap-5 md:gap-6",
                isPlaying && "pointer-events-none opacity-0"
              )}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className={cn(
                  "rounded-full border-2 border-accent bg-accent/90 text-primary-foreground shadow-xl transition-all duration-300 hover:scale-110 hover:bg-accent hover:shadow-2xl",
                  "size-14 sm:size-16 md:size-[4.25rem] lg:size-20"
                )}
                aria-label={t("playVideo")}
              >
                <Play className="size-7 fill-current pl-0.5 sm:size-8 sm:pl-1 md:size-9 lg:size-10 lg:pl-1" strokeWidth={2.5} />
              </Button>
              <Image
                src="/sakti_putih.png"
                alt="SAKTITEMP"
                width={120}
                height={48}
                className="h-6 w-auto object-contain opacity-90 sm:h-8 md:h-9 lg:h-10"
              />
            </div>
          </div>
        </div>

        {/* Right: Content area 70% width - bg image + overlay */}
        <div
          ref={textColRef}
          className={cn(
            "relative order-1 flex w-full flex-col justify-center md:order-2 md:w-[70%]",
            "min-h-[260px] sm:min-h-[300px] md:min-h-[60vh] lg:min-h-[70vh]"
          )}
        >
          {/* Background image */}
          <Image
            src={POSTER_SRC}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 70vw"
            priority={false}
          />
          {/* Red-maroon overlay */}
          <div className="absolute inset-0 bg-primary/70" aria-hidden />
          {/* Content */}
          <div
            className={cn(
              "relative z-10",
              "px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12",
              "lg:px-12 lg:py-16 xl:px-16 xl:py-20"
            )}
          >
            <Badge
              data-animate-video
              variant="secondary"
              className="mb-3 w-fit border-accent/30 bg-accent/15 px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-accent sm:mb-4 sm:px-3 sm:text-sm"
            >
              {t("badge")}
            </Badge>
            <h2
              data-animate-video
              className="text-xl font-bold tracking-tight text-primary-foreground sm:text-2xl md:text-3xl lg:text-4xl xl:text-[2.75rem]"
            >
              {t("title")}
            </h2>
            <p
              data-animate-video
              className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/95 sm:mt-4 sm:text-base md:text-lg"
            >
              {t("subtitle")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
