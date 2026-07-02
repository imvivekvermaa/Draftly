import { JSON_HEADERS, parseApiResponse } from "./parse-response";

/** Asks the server whether an account exists for the given email. */
export async function checkAccountExists(email: string): Promise<boolean> {
  const response = await fetch("/api/auth/account-exists", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ email }),
  });
  const { exists } = await parseApiResponse<{ exists: boolean }>(response);
  return exists;
}
