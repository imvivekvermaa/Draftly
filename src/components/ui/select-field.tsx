import { forwardRef, type SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";
import { CONTROL_CLASSES } from "./form-field";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  options: readonly SelectOption[];
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField({ options, className, ...props }, ref) {
    return (
      <select ref={ref} className={cn(CONTROL_CLASSES, className)} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  },
);
