import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { getAuthenticatedUser } from "@/lib/auth/require-user";

export const metadata = { title: "Dashboard · AI Content Assistant" };

/**
 * Protected dashboard. Middleware already guards this route; we re-check the
 * user here so we can pass their email to the UI and fail safe if the session
 * disappeared between middleware and render.
 */
export default async function DashboardPage() {
  const user = await getAuthenticatedUser();
  if (!user?.email) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader email={user.email} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <DashboardView />
      </main>
    </div>
  );
}
