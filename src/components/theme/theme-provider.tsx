"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const THEME_STORAGE_KEY = "ai-assistant-theme";
const THEME_CHANGE_EVENT = "ai-assistant-theme-change";

/**
 * The theme lives on the <html> `.dark` class (set pre-paint by the boot
 * script in the root layout). We read it via `useSyncExternalStore` so React
 * stays in sync with that external DOM state without a setState-in-effect.
 */
function subscribe(onChange: () => void): () => void {
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, onChange);
}

function getClientTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

// Server render has no DOM; default to light and let hydration reconcile.
function getServerTheme(): Theme {
  return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribe,
    getClientTheme,
    getServerTheme,
  );

  const toggleTheme = useCallback(() => {
    const next: Theme = getClientTheme() === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
