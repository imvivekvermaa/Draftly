/** Formats an ISO timestamp into a compact, human-readable local string. */
export function formatTimestamp(isoDate: string): string {
  return new Date(isoDate).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
