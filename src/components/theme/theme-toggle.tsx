"use client";

import { useTheme } from "./theme-provider";

/**
 * Switches between light and dark themes and persists the choice. Renders as a
 * round, icon-only button on mobile and a labelled pill from `sm` upwards.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="inline-flex size-10 items-center justify-center gap-2 rounded-full bg-neutral-950 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 sm:size-auto sm:rounded-lg sm:px-4 sm:py-2 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
    >
      <span aria-hidden="true">{isDark ? "☀️" : "🌙"}</span>
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
