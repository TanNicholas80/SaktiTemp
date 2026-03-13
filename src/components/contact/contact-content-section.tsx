"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import {
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  type LucideIcon,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import type { ContactOutput, LocationOutput } from "@/lib/translate";

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_ICON_MAP: Record<string, LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  linkedin_in: Linkedin,
  tiktok: MessageCircle,
  whatsapp: MessageCircle,
};

type SocialMediaItem = {
  socialMediaId: string;
  platformName: string;
  profileUrl: string;
  iconName: string;
};

type ContactContentSectionProps = {
  locations: LocationOutput[];
  contacts: ContactOutput[];
  socialMedia: SocialMediaItem[];
};

function getSocialIcon(iconName: string): LucideIcon {
  const key = iconName.toLowerCase().replace(/\s+/g, "_");
  return SOCIAL_ICON_MAP[key] ?? MessageCircle;
}

export function ContactContentSection({
  locations,
  contacts,
  socialMedia,
}: ContactContentSectionProps) {
  const t = useTranslations("contactContentSection");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "success" | "error">(
    "idle"
  );
  const sectionRef = React.useRef<HTMLElement>(null);
  const leftRef = React.useRef<HTMLDivElement>(null);
  const rightRef = React.useRef<HTMLDivElement>(null);

  const phoneContact = contacts.find((c) => c.contactType === "phone");
  const emailContact = contacts.find((c) => c.contactType === "email");
  const hoursContact = contacts.find((c) => c.contactType === "operational_hours");

  const projectTypes = [
    { value: "residential", labelKey: "projectTypeResidential" },
    { value: "commercial", labelKey: "projectTypeCommercial" },
    { value: "architecture", labelKey: "projectTypeArchitecture" },
    { value: "interior", labelKey: "projectTypeInterior" },
    { value: "other", labelKey: "projectTypeOther" },
  ] as const;

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      if (leftRef.current) {
        gsap.fromTo(
          leftRef.current,
          { opacity: 0, x: -32 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: {
              trigger: leftRef.current,
              start: "top 88%",
              end: "top 50%",
              toggleActions: "play none none none",
            },
          }
        );
      }
      if (rightRef.current) {
        gsap.fromTo(
          rightRef.current,
          { opacity: 0, x: 32 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            delay: 0.1,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: {
              trigger: rightRef.current,
              start: "top 88%",
              end: "top 50%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const locationValue = formData.get("location") as string;
    const projectType = formData.get("projectType") as string;
    const message = formData.get("message") as string;

    if (!name?.trim() || !phone?.trim() || !message?.trim()) return;

    setIsSubmitting(true);
    setStatus("idle");

    const projectDetails = [
      locationValue && `Lokasi: ${locationValue}`,
      projectType && `Jenis Proyek: ${projectType}`,
      message.trim(),
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          projectDetails,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-[600px] sm:min-h-[700px]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left: Contact Info - Maroon background */}
        <div
          ref={leftRef}
          className="flex flex-col bg-primary p-6 text-primary-foreground sm:p-8 md:p-10 lg:p-12 xl:p-14"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent sm:text-sm">
            {t("contactBadge")}
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl md:text-4xl">
            {t("contactTitle")}
          </h2>

          <div className="mt-8 space-y-6 sm:mt-10 md:mt-12">
            {/* Locations */}
            {locations.map((loc) => {
              const isHead = loc.locationType === "head";
              return (
                <div
                  key={loc.locationId}
                  className="flex gap-3 transition-opacity duration-200 hover:opacity-90"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                    <MapPin className="size-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-primary-foreground/70 text-xs font-medium uppercase tracking-wider">
                      {isHead ? t("headOffice") : t("branchOffice")}
                    </p>
                    <p className="mt-0.5 font-semibold">{loc.locationCity}</p>
                    <p className="mt-0.5 text-sm text-primary-foreground/90">
                      {loc.locationAddress}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Phone */}
            {phoneContact && (
              <a
                href={`tel:${phoneContact.contactValue.replace(/\s/g, "")}`}
                className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-90"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                  <Phone className="size-5 text-accent" />
                </div>
                <div className="flex flex-col">
                  <p className="font-medium">{phoneContact.contactLabel}</p>
                  <p className="mt-0.5 text-sm text-primary-foreground/90">
                    {phoneContact.contactValue}
                  </p>
                </div>
              </a>
            )}

            {/* Email */}
            {emailContact && (
              <a
                href={`mailto:${emailContact.contactValue}`}
                className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-90"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                  <Mail className="size-5 text-accent" />
                </div>
                <div className="flex flex-col">
                  <p className="font-medium">{emailContact.contactLabel}</p>
                  <p className="mt-0.5 text-sm text-primary-foreground/90">
                    {emailContact.contactValue}
                  </p>
                </div>
              </a>
            )}

            {/* Operational Hours */}
            {hoursContact && (
              <div className="flex gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                  <Clock className="size-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium">{hoursContact.contactLabel}</p>
                  <p className="mt-0.5 text-sm text-primary-foreground/90">
                    {hoursContact.contactValue}
                  </p>
                  {hoursContact.contactValueExtra && (
                    <p className="mt-0.5 text-sm text-primary-foreground/90">
                      {hoursContact.contactValueExtra}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Social Media */}
          {socialMedia.length > 0 && (
            <>
              <div className="mt-8 border-t border-primary-foreground/20 pt-8 sm:mt-10">
                <p className="font-medium">{t("followUs")}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {socialMedia.map((sm) => {
                    const Icon = getSocialIcon(sm.iconName);
                    return (
                      <a
                        key={sm.socialMediaId}
                        href={sm.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={sm.platformName}
                        className={cn(
                          "flex size-10 items-center justify-center rounded-lg bg-primary-foreground/10 transition-all duration-200",
                          "hover:bg-primary-foreground/20 hover:text-accent"
                        )}
                      >
                        <Icon className="size-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: Form - Light gray background */}
        <div
          ref={rightRef}
          className="flex flex-col bg-muted/50 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent sm:text-sm">
            {t("formBadge")}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
            {t("formTitle")}
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">
            {t("formDesc")}
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 sm:mt-10"
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="contact-content-name">
                  {t("fullName")} <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="contact-content-name"
                  name="name"
                  placeholder={t("fullNamePlaceholder")}
                  required
                  className="border-border bg-background focus-visible:ring-primary"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="contact-content-phone">
                  {t("phone")} <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="contact-content-phone"
                  name="phone"
                  type="tel"
                  placeholder={t("phonePlaceholder")}
                  required
                  className="border-border bg-background focus-visible:ring-primary"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="contact-content-location">
                  {t("location")} <span className="text-destructive">*</span>
                </FieldLabel>
                {locations.length > 0 ? (
                  <select
                    id="contact-content-location"
                    name="location"
                    required
                    className={cn(
                      "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                  >
                    <option value="">{t("locationPlaceholder")}</option>
                    {locations.map((loc) => (
                      <option key={loc.locationId} value={loc.locationCity}>
                        {loc.locationCity}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id="contact-content-location"
                    name="location"
                    placeholder={t("locationPlaceholder")}
                    required
                    className="border-border bg-background focus-visible:ring-primary"
                  />
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="contact-content-project-type">
                  {t("projectType")} <span className="text-destructive">*</span>
                </FieldLabel>
                <select
                  id="contact-content-project-type"
                  name="projectType"
                  required
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                >
                  <option value="">{t("projectTypePlaceholder")}</option>
                  {projectTypes.map((pt) => (
                    <option key={pt.value} value={pt.value}>
                      {t(pt.labelKey)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field>
                <FieldLabel htmlFor="contact-content-message">
                  {t("message")} <span className="text-destructive">*</span>
                </FieldLabel>
                <Textarea
                  id="contact-content-message"
                  name="message"
                  placeholder={t("messagePlaceholder")}
                  required
                  rows={4}
                  className="resize-none border-border bg-background focus-visible:ring-primary"
                />
              </Field>
            </FieldGroup>

            {status === "success" && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <AlertDescription>{t("successMessage")}</AlertDescription>
              </Alert>
            )}
            {status === "error" && (
              <Alert variant="destructive">
                <AlertDescription>{t("errorMessage")}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full bg-primary hover:bg-primary/90",
                "transition-all duration-200 hover:shadow-lg"
              )}
            >
              <Send className="mr-2 size-4" />
              {isSubmitting ? "..." : t("submit")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
