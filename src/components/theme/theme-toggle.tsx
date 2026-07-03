"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";

/** Switches between light and dark themes and persists the choice. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
    >
      {isDark ? "☀️ Light" : "🌙 Dark"}
    </Button>
  );
}
