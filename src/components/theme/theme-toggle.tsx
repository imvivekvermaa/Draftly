"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";

/** Switches between light and dark themes and persists the choice. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="secondary"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? "☀️ Light" : "🌙 Dark"}
    </Button>
  );
}
