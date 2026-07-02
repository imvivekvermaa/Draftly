"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  buildExportFileName,
  copyToClipboard,
  downloadTextFile,
} from "@/lib/utils/content-actions";

interface ContentActionsBarProps {
  text: string;
  topic: string;
}

/** Copy-to-clipboard and export buttons, reused by result and history items. */
export function ContentActionsBar({ text, topic }: ContentActionsBarProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    }
  }

  function handleExport() {
    downloadTextFile(buildExportFileName(topic), text);
  }

  return (
    <div className="flex gap-2">
      <Button variant="secondary" onClick={handleCopy}>
        {copied ? "Copied!" : "Copy"}
      </Button>
      <Button variant="secondary" onClick={handleExport}>
        Export
      </Button>
    </div>
  );
}
