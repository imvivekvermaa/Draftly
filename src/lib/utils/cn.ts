type ClassValue = string | false | null | undefined;

/**
 * Minimal className joiner: filters out falsy values and joins with spaces.
 * Avoids a dependency for the small amount of conditional styling we need.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
