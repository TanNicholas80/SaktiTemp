import gsap from "gsap";

function reducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Animasi masuk area utama kalkulator (accordion kiri + ringkasan kanan).
 */
export function createCalculatorSectionEntrance(root: HTMLElement) {
  if (reducedMotion()) {
    return gsap.context(() => {}, root);
  }

  return gsap.context(() => {
    const left = root.querySelector<HTMLElement>("[data-calculator-left]");
    const right = root.querySelector<HTMLElement>("[data-calculator-right]");
    const leftItems = left?.querySelectorAll<HTMLElement>(
      ":scope > *"
    );

    if (leftItems && leftItems.length > 0) {
      gsap.fromTo(
        leftItems,
        { opacity: 0, y: 24, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.62,
          stagger: { each: 0.075, ease: "power1.out" },
          ease: "power4.out",
        }
      );
    }

    if (right) {
      gsap.fromTo(
        right,
        { opacity: 0, y: 18, scale: 0.99 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          delay: 0.1,
          ease: "power4.out",
        }
      );
    }
  }, root);
}

/**
 * Animasi halaman rincian (breadcrumb, judul, kartu, tombol).
 */
export function createCalculatorRincianEntrance(root: HTMLElement) {
  if (reducedMotion()) {
    return gsap.context(() => {}, root);
  }

  return gsap.context(() => {
    const steps = root.querySelectorAll<HTMLElement>("[data-rincian-step]");
    const card = root.querySelector<HTMLElement>("[data-rincian-card]");
    const ctaGroup = root.querySelector<HTMLElement>("[data-rincian-cta-group]");
    const ctaButtons = ctaGroup?.querySelectorAll<HTMLElement>("button, a");

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      steps,
      { opacity: 0, y: 18, filter: "blur(3px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.55,
        stagger: 0.09,
      }
    );

    if (card) {
      tl.fromTo(
        card,
        { boxShadow: "0 0 0 rgba(114,29,29,0)", scale: 1 },
        {
          boxShadow: "0 18px 40px rgba(114,29,29,0.14)",
          scale: 1.005,
          duration: 0.45,
          yoyo: true,
          repeat: 1,
        },
        "-=0.2"
      );
    }

    if (ctaButtons && ctaButtons.length > 0) {
      tl.fromTo(
        ctaButtons,
        { opacity: 0, y: 10, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.32, stagger: 0.08 },
        "-=0.15"
      );
    }
  }, root);
}
