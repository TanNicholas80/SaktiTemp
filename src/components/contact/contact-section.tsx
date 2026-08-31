"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import {
  Clock,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";

import type { ContactOutput, LocationOutput } from "@/lib/translate";

gsap.registerPlugin(ScrollTrigger);

const CONTACT_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Phone,
  Mail,
  Clock,
  MapPin,
  "map-pin": MapPin,
  WhatsApp: WhatsAppIcon,
};

type ContactSectionProps = {
  locations: LocationOutput[];
  contacts: ContactOutput[];
  contactEmail: string; // reserved for future use (e.g. mailto)
  whatsappPhone: string;
};

function formatWhatsAppNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "62" + cleaned.slice(1);
  else if (!cleaned.startsWith("62")) cleaned = "62" + cleaned;
  return cleaned;
}

export function ContactSection({
  locations,
  contacts,
  contactEmail,
  whatsappPhone,
}: ContactSectionProps) {
  void contactEmail; // reserved for future mailto link
  const t = useTranslations("contactSection");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "success" | "error">(
    "idle",
  );
  const sectionRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const leftRef = React.useRef<HTMLDivElement>(null);
  const formBoxRef = React.useRef<HTMLDivElement>(null);

  const waUrl = React.useMemo(() => {
    const num = formatWhatsAppNumber(whatsappPhone);
    return `https://wa.me/${num}`;
  }, [whatsappPhone]);

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 88%",
              end: "top 45%",
              toggleActions: "play none none none",
            },
          },
        );
      }
      if (leftRef.current) {
        gsap.fromTo(
          leftRef.current,
          { opacity: 0, x: -24 },
          {
            opacity: 1,
            x: 0,
            duration: 0.85,
            delay: 0.1,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: {
              trigger: leftRef.current,
              start: "top 88%",
              end: "top 50%",
              toggleActions: "play none none none",
            },
          },
        );
      }
      if (formBoxRef.current) {
        gsap.fromTo(
          formBoxRef.current,
          { opacity: 0, x: 24 },
          {
            opacity: 1,
            x: 0,
            duration: 0.85,
            delay: 0.18,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: {
              trigger: formBoxRef.current,
              start: "top 88%",
              end: "top 50%",
              toggleActions: "play none none none",
            },
          },
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
    const projectDetails = formData.get("projectDetails") as string;

    if (!name?.trim() || !phone?.trim() || !projectDetails?.trim()) return;

    setIsSubmitting(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          projectDetails: projectDetails.trim(),
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
      className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-24 lg:py-28"
    >
      {/* Header - Maroon band */}
      <div className="bg-primary px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div ref={headerRef} className="space-y-3">
            <Badge
              variant="secondary"
              className="border-accent/30 bg-accent/15 px-3 py-1 text-sm font-medium text-accent"
            >
              {t("badge")}
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
              {t("title")}
            </h2>
            <p className="max-w-3xl text-sm text-white/80 sm:text-base">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Content - 2 Columns (Info & Form) */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: Locations + Contacts + WhatsApp */}
          <div ref={leftRef} className="space-y-6">
            {/* Locations */}
            {locations.map((loc) => {
              const isHead = loc.locationType === "head";
              return (
                <Card
                  key={loc.locationId}
                  className={cn(
                    "group flex flex-row gap-4 border-border/60 p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-md sm:p-5",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-12 shrink-0 items-center bg-primary justify-center rounded-lg transition-colors duration-300 sm:size-14",
                    )}
                  >
                    <MapPin
                      className={cn(
                        "size-6 text-white sm:size-7",
                        "transition-transform duration-300 group-hover:scale-110",
                      )}
                    />
                  </div>
                  <CardContent className="min-w-0 flex-1 gap-0 px-0 py-0">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                      {isHead ? t("headOffice") : t("branchOffice")}
                    </p>
                    <CardTitle className="mt-1 text-base">
                      {loc.locationCity}
                    </CardTitle>
                    <p className="mt-1 text-muted-foreground text-sm">
                      {loc.locationAddress}
                    </p>
                  </CardContent>
                </Card>
              );
            })}

            {/* Contact items (phone, email, operational hours) */}
            {contacts
              .filter(
                (c) =>
                  c.contactType === "phone" ||
                  c.contactType === "email" ||
                  c.contactType === "operational_hours",
              )
              .map((contact) => {
                const IconComponent =
                  CONTACT_ICON_MAP[contact.contactIcon] ?? Phone;
                return (
                  <Card
                    key={contact.contactId}
                    className={cn(
                      "group flex flex-row gap-4 border-border/60 p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-md sm:p-5",
                    )}
                  >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary transition-colors duration-300 group-hover:bg-primary/90 sm:size-14">
                      <IconComponent className="size-6 text-white sm:size-7" />
                    </div>
                    <CardContent className="min-w-0 flex-1 gap-0 px-0 py-0">
                      <CardTitle className="text-base">
                        {contact.contactLabel}
                      </CardTitle>
                      <CardDescription className="mt-0.5">
                        {contact.contactValue}
                      </CardDescription>
                      {contact.contactValueExtra && (
                        <CardDescription className="mt-0.5">
                          {contact.contactValueExtra}
                        </CardDescription>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

            {/* WhatsApp button */}
            {whatsappPhone && (
              <Button
                variant="default"
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                asChild
              >
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white"
                >
                  <WhatsAppIcon className="size-5" />
                  {t("chatWhatsApp")}
                </a>
              </Button>
            )}
          </div>

          {/* Right: Form - centered horizontal & vertical, height fits content */}
          <div ref={formBoxRef} className="flex items-start justify-center">
            <Card className="w-full max-w-lg shrink-0 rounded-2xl border-border/60 p-6 sm:p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl">{t("sendMessage")}</CardTitle>
                <CardDescription>{t("sendMessageDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="contact-name">
                        {t("name")} <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        id="contact-name"
                        name="name"
                        placeholder={t("namePlaceholder")}
                        required
                        className="focus-visible:ring-primary"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="contact-phone">
                        {t("phone")} <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        placeholder={t("phonePlaceholder")}
                        required
                        className="focus-visible:ring-primary"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="contact-project">
                        {t("projectDetails")}{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Textarea
                        id="contact-project"
                        name="projectDetails"
                        placeholder={t("projectPlaceholder")}
                        required
                        rows={4}
                        className="resize-none focus-visible:ring-primary"
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
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <Mail className="mr-2 size-4" />
                    {isSubmitting ? "..." : t("submit")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
