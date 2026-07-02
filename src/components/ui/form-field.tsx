import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}

/** Wraps a control with a consistent label and inline validation message. */
export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** Shared input/select styling so all controls look identical. */
export const CONTROL_CLASSES =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 " +
  "placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none " +
  "dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100";
