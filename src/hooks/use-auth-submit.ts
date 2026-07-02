"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { checkAccountExists } from "@/lib/api/auth-client";
import {
  buildFeedback,
  isRateLimitCode,
  SUPABASE_ERROR_CODE,
  type AuthFeedback,
} from "@/lib/auth/auth-feedback";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

type AuthMode = "login" | "register";

interface UseAuthSubmitResult {
  submit: (email: string, password: string) => Promise<void>;
  isSubmitting: boolean;
  feedback: AuthFeedback | null;
  clearFeedback: () => void;
}

/**
 * Drives sign-in / sign-up and turns each outcome into user-facing feedback.
 * For the ambiguous `invalid_credentials` case it asks the server whether the
 * email is registered, so we can tell "no account" apart from "wrong password".
 */
export function useAuthSubmit(mode: AuthMode): UseAuthSubmitResult {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<AuthFeedback | null>(null);

  const goToDashboard = useCallback(() => {
    router.push("/dashboard");
    router.refresh();
  }, [router]);

  const submitLogin = useCallback(
    async (email: string, password: string) => {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error) return goToDashboard();

      if (error.code === SUPABASE_ERROR_CODE.emailNotConfirmed) {
        return setFeedback(buildFeedback("unconfirmed"));
      }

      if (isRateLimitCode(error.code)) {
        return setFeedback(buildFeedback("rate_limited"));
      }

      if (error.code === SUPABASE_ERROR_CODE.invalidCredentials) {
        try {
          const exists = await checkAccountExists(email);
          return setFeedback(
            buildFeedback(exists ? "wrong_password" : "no_account"),
          );
        } catch {
          return setFeedback(buildFeedback("generic"));
        }
      }

      setFeedback(buildFeedback("generic"));
    },
    [goToDashboard],
  );

  const submitRegister = useCallback(
    async (email: string, password: string) => {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        if (error.code === SUPABASE_ERROR_CODE.userAlreadyExists) {
          return setFeedback(buildFeedback("account_exists"));
        }
        if (error.code === SUPABASE_ERROR_CODE.weakPassword) {
          return setFeedback(buildFeedback("weak_password"));
        }
        if (isRateLimitCode(error.code)) {
          return setFeedback(buildFeedback("rate_limited"));
        }
        return setFeedback(buildFeedback("generic"));
      }

      // With email confirmation on, Supabase obscures an existing email by
      // returning a user with no identities and no session.
      if (data.user && data.user.identities?.length === 0) {
        return setFeedback(buildFeedback("account_exists"));
      }

      if (data.session) return goToDashboard();

      // New user, confirmation required.
      setFeedback(buildFeedback("check_email"));
    },
    [goToDashboard],
  );

  const submit = useCallback(
    async (email: string, password: string) => {
      setIsSubmitting(true);
      setFeedback(null);
      try {
        if (mode === "login") await submitLogin(email, password);
        else await submitRegister(email, password);
      } finally {
        setIsSubmitting(false);
      }
    },
    [mode, submitLogin, submitRegister],
  );

  const clearFeedback = useCallback(() => setFeedback(null), []);

  return { submit, isSubmitting, feedback, clearFeedback };
}
