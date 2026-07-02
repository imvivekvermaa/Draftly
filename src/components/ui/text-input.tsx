import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";
import { CONTROL_CLASSES } from "./form-field";

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ className, ...props }, ref) {
    return (
      <input ref={ref} className={cn(CONTROL_CLASSES, className)} {...props} />
    );
  },
);
