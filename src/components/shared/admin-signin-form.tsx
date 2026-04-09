"use client";

import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { getCmsHomeHref } from "@/lib/admin-nav";
import { PasswordInput } from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(1, "Password wajib diisi."),
});

type FormState = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type FormErrors = Partial<Record<"email" | "password" | "form", string>>;

export function AdminSignInForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const parsed = loginSchema.safeParse({
      email: form.email,
      password: form.password,
    });

    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors;
      setErrors({
        email: fields.email?.[0],
        password: fields.password?.[0],
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await authClient.signIn.email({
        email: parsed.data.email,
        password: parsed.data.password,
        rememberMe: form.rememberMe,
        callbackURL: "/admin",
      });

      if (response.error) {
        const message = response.error.message || "Email atau password salah.";
        setErrors({ form: message });
        toast.error(message);
        return;
      }

      toast.success("Login berhasil.");
      const sess = await authClient.getSession();
      const user = sess.data?.user as { role?: string } | undefined;
      router.replace(getCmsHomeHref(user?.role));
      router.refresh();
    } catch {
      const message = "Terjadi kesalahan saat login. Silakan coba lagi.";
      setErrors({ form: message });
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">Sign In Admin</h1>
        <p className="text-sm text-muted-foreground">
          Masukkan email dan password untuk masuk ke dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@saktitemp.com"
              autoComplete="email"
              value={form.email}
              onChange={(event) => {
                const target = event?.currentTarget ?? event?.target;
                setForm((state) => ({ ...state, email: target?.value ?? "" }));
              }}
              aria-invalid={Boolean(errors.email)}
              disabled={isSubmitting}
            />
            <FieldError>{errors.email}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <PasswordInput
              id="password"
              name="password"
              value={form.password}
              onChange={(value) =>
                setForm((state) => ({ ...state, password: value }))
              }
              invalid={Boolean(errors.password)}
              disabled={isSubmitting}
            />
            <FieldError>{errors.password}</FieldError>
          </Field>
        </FieldGroup>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            className="size-4 rounded border-border text-primary focus-visible:ring-ring/50"
            checked={form.rememberMe}
            onChange={(event) => {
              const target = event?.currentTarget ?? event?.target as HTMLInputElement | null;
              setForm((state) => ({ ...state, rememberMe: target?.checked ?? false }));
            }}
            disabled={isSubmitting}
          />
          Tetap masuk di perangkat ini
        </label>

        <FieldError>{errors.form}</FieldError>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Memproses..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
