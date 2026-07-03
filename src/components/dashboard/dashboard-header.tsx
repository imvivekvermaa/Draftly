import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";

/** Top bar of the dashboard: brand, current user, theme toggle, sign out. */
export function DashboardHeader({ email }: { email: string }) {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-5 sm:px-8">
        <div>
          <h1 className="text-3xl font-black leading-none tracking-normal text-neutral-950 dark:text-neutral-50">
            Draftly
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
