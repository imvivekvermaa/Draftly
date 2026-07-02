import Link from "next/link";

import type { AuthFeedback } from "@/lib/auth/auth-feedback";
import { cn } from "@/lib/utils/cn";

const TONE_CLASSES: Record<AuthFeedback["tone"], string> = {
  error:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  info: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  success:
    "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300",
};

interface AuthFeedbackBannerProps {
  feedback: AuthFeedback;
  /** Current email, carried to the linked screen so the user needn't retype. */
  email: string;
}

/** Renders an auth outcome message with a tone and a contextual next action. */
export function AuthFeedbackBanner({ feedback, email }: AuthFeedbackBannerProps) {
  const emailParam = email ? `?email=${encodeURIComponent(email)}` : "";

  return (
    <div
      className={cn(
        "rounded-lg border px-3 py-2 text-sm",
        TONE_CLASSES[feedback.tone],
      )}
      role="alert"
    >
      <p>{feedback.message}</p>

      {feedback.kind === "no_account" && (
        <Link
          href={`/register${emailParam}`}
          className="mt-1 inline-block font-medium underline"
        >
          Create an account
        </Link>
      )}

      {feedback.kind === "account_exists" && (
        <Link
          href={`/login${emailParam}`}
          className="mt-1 inline-block font-medium underline"
        >
          Sign in instead
        </Link>
      )}
    </div>
  );
}
