"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { AuthFeedbackBanner } from "@/components/auth/auth-feedback-banner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { TextInput } from "@/components/ui/text-input";
import { useAuthSubmit } from "@/hooks/use-auth-submit";
import { credentialsSchema } from "@/lib/validation/auth-schemas";

type AuthMode = "login" | "register";

const COPY: Record<AuthMode, {
  title: string;
  action: string;
  prompt: string;
  linkLabel: string;
  linkHref: string;
}> = {
  login: {
    title: "Sign in",
    action: "Sign in",
    prompt: "Don't have an account?",
    linkLabel: "Create one",
    linkHref: "/register",
  },
  register: {
    title: "Create account",
    action: "Sign up",
    prompt: "Already have an account?",
    linkLabel: "Sign in",
    linkHref: "/login",
  },
};

interface AuthFormProps {
  mode: AuthMode;
  /** Email carried over from the other screen, so the user needn't retype it. */
  initialEmail?: string;
}

export function AuthForm({ mode, initialEmail = "" }: AuthFormProps) {
  const copy = COPY[mode];
  const { submit, isSubmitting, feedback } = useAuthSubmit(mode);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    // Validate on the client so empty/short/malformed input gets a clear
    // per-field message instead of a generic error from Supabase.
    const parsed = credentialsSchema.safeParse({ email, password });
    if (!parsed.success) {
      const errors: { email?: string; password?: string } = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if ((key === "email" || key === "password") && !errors[key]) {
          errors[key] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    await submit(parsed.data.email, parsed.data.password);
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
    }
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: undefined }));
    }
  }

  const emailParam = email ? `?email=${encodeURIComponent(email)}` : "";

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Draftly
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          AI Content Assistant
        </p>
      </div>
      <Card>
        <CardHeader title={copy.title} />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <FormField label="Email" htmlFor="email" error={fieldErrors.email}>
            <TextInput
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => handleEmailChange(event.target.value)}
              placeholder="you@example.com"
            />
          </FormField>
          <FormField
            label="Password"
            htmlFor="password"
            error={fieldErrors.password}
          >
            <TextInput
              id="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              minLength={6}
              value={password}
              onChange={(event) => handlePasswordChange(event.target.value)}
              placeholder="At least 6 characters"
            />
          </FormField>

          {feedback && <AuthFeedbackBanner feedback={feedback} email={email} />}

          <Button type="submit" isLoading={isSubmitting}>
            {copy.action}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
          {copy.prompt}{" "}
          <Link
            href={`${copy.linkHref}${emailParam}`}
            className="font-medium underline"
          >
            {copy.linkLabel}
          </Link>
        </p>
      </Card>
    </div>
  );
}
