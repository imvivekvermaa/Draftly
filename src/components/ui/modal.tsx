"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils/cn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** id of the element that labels the dialog, for accessibility. */
  labelledBy?: string;
  /** Tailwind max-width for the panel (e.g. "max-w-md" for a compact dialog). */
  maxWidthClassName?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Accessible, reusable modal overlay rendered in a portal on <body>, so it sits
 * above everything and isn't clipped by parent containers. The backdrop fades
 * and the panel zooms in on open (and reverses on close). Closes on backdrop
 * click, the ✕ button, or Escape, and locks background scroll while open.
 */
export function Modal({
  isOpen,
  onClose,
  labelledBy,
  maxWidthClassName = "max-w-2xl",
  children,
  className,
}: ModalProps) {
  // `visible` drives the enter/exit transition. The node stays mounted while
  // open OR while the closing animation is still running, then unmounts on
  // `onTransitionEnd`. Keeping this derived avoids setState-in-effect churn.
  const [visible, setVisible] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const shouldRender = isOpen || visible;
  const show = isOpen && visible;

  // On open, flip to the shown state on the next frame so the panel animates in.
  useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll while the modal is on screen.
  useEffect(() => {
    if (!shouldRender) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldRender]);

  // Move focus into the dialog once it is shown.
  useEffect(() => {
    if (show) closeRef.current?.focus();
  }, [show]);

  if (!shouldRender || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={cn(
          "absolute inset-0 bg-neutral-950/50 backdrop-blur-sm transition-opacity duration-200",
          show ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(event) => event.stopPropagation()}
        onTransitionEnd={() => {
          // Once the closing animation finishes, unmount the node.
          if (!isOpen) setVisible(false);
        }}
        className={cn(
          "relative z-10 flex max-h-[85vh] w-full flex-col overflow-hidden rounded-2xl",
          maxWidthClassName,
          "border border-neutral-200 bg-white shadow-xl",
          "dark:border-neutral-800 dark:bg-neutral-900",
          "transition duration-200",
          show ? "scale-100 opacity-100" : "scale-95 opacity-0",
          className,
        )}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={cn(
            "absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full",
            "text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500",
            "dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {children}
      </div>
    </div>,
    document.body,
  );
}
