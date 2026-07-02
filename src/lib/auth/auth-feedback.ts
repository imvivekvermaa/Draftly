/**
 * Pure mapping from an auth outcome to the message shown to the user.
 * No React or network here, so it is trivially testable.
 */

export type AuthFeedbackKind =
  | "wrong_password"
  | "no_account"
  | "unconfirmed"
  | "account_exists"
  | "weak_password"
  | "rate_limited"
  | "check_email"
  | "generic";

export type AuthFeedbackTone = "error" | "info" | "success";

export interface AuthFeedback {
  kind: AuthFeedbackKind;
  message: string;
  tone: AuthFeedbackTone;
}

const FEEDBACK: Record<AuthFeedbackKind, Omit<AuthFeedback, "kind">> = {
  wrong_password: {
    tone: "error",
    message:
      "Incorrect password. Please check your credentials and try again.",
  },
  no_account: {
    tone: "info",
    message: "No account found for that email.",
  },
  unconfirmed: {
    tone: "info",
    message:
      "Please confirm your email first — check your inbox for the link.",
  },
  account_exists: {
    tone: "info",
    message: "An account with this email already exists.",
  },
  weak_password: {
    tone: "error",
    message: "Please choose a stronger password (at least 6 characters).",
  },
  rate_limited: {
    tone: "error",
    message: "Too many attempts. Please wait a moment and try again.",
  },
  check_email: {
    tone: "success",
    message: "Account created — check your inbox to confirm, then sign in.",
  },
  generic: {
    tone: "error",
    message: "Something went wrong. Please try again.",
  },
};

export function buildFeedback(kind: AuthFeedbackKind): AuthFeedback {
  return { kind, ...FEEDBACK[kind] };
}

/** Supabase Auth error codes we branch on. */
export const SUPABASE_ERROR_CODE = {
  invalidCredentials: "invalid_credentials",
  emailNotConfirmed: "email_not_confirmed",
  userAlreadyExists: "user_already_exists",
  weakPassword: "weak_password",
  overEmailRateLimit: "over_email_send_rate_limit",
  overRequestRateLimit: "over_request_rate_limit",
} as const;

/** True when the error is one of Supabase's rate-limit codes. */
export function isRateLimitCode(code: string | undefined): boolean {
  return (
    code === SUPABASE_ERROR_CODE.overEmailRateLimit ||
    code === SUPABASE_ERROR_CODE.overRequestRateLimit
  );
}
