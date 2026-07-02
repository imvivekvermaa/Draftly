import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
}

/** Surface container used to group related content across the dashboard. */
export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-neutral-200 bg-white p-6 shadow-sm",
        "dark:border-neutral-800 dark:bg-neutral-900",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, description }: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      )}
    </div>
  );
}
