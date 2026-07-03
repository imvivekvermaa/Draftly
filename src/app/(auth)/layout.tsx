import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/theme/theme-toggle";

/** Branded auth shell shared by login and registration. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen flex-1 overflow-hidden bg-neutral-50 px-5 py-6 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50 sm:px-8">
      <div
        aria-hidden="true"
        className="auth-reveal-overlay fixed inset-0 z-20 bg-neutral-950 dark:bg-neutral-50"
      />

      <div className="absolute right-5 top-5 z-50 sm:right-8 sm:top-6">
        <ThemeToggle />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-8 z-30 flex select-none flex-col items-center px-4 text-center mix-blend-difference"
      >
        <h1 className="text-[29vw] font-black leading-[0.72] tracking-normal text-white sm:text-[21vw]">
          Draftly
        </h1>
        <p className="mt-3 whitespace-nowrap text-[clamp(0.78rem,2.7vw,1rem)] font-medium leading-6 text-white">
          Generate, save and refine content without losing momentum.
        </p>
      </div>

      <div className="auth-content-layer relative z-40 mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center justify-center">
        {children}
      </div>
    </main>
  );
}
