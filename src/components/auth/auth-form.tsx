"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { AuthFeedbackBanner } from "@/components/auth/auth-feedback-banner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { TextInput } from "@/components/ui/text-input";
import { useAuthSubmit } from "@/hooks/use-auth-submit";

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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await submit(email, password);
  }

  const emailParam = email ? `?email=${encodeURIComponent(email)}` : "";

  return (
    <Card className="w-full max-w-sm">
      <CardHeader title={copy.title} description="AI Content Assistant" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <FormField label="Email" htmlFor="email">
          <TextInput
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </FormField>
        <FormField label="Password" htmlFor="password">
          <TextInput
            id="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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
  );
}
