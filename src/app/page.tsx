import { redirect } from "next/navigation";

import { getAuthenticatedUser } from "@/lib/auth/require-user";

/** Entry point: routes users to the dashboard or the login screen. */
export default async function HomePage() {
  const user = await getAuthenticatedUser();
  redirect(user ? "/dashboard" : "/login");
}
