import type { ReactNode } from "react";

/** Centers auth screens (login / register) in the viewport. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      {children}
    </main>
  );
}
