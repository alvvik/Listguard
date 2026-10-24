"use client";

import { useState } from "react";
import { config } from "../../../config";

export default function ConnectBox() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(config.connectLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="bg-base-300 text-base-content border border-base-content/15 rounded-box p-3 flex items-center justify-between font-mono text-xs shadow-md cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:border-primary group w-full"
      title="Kliknij, aby skopiować adres serwera"
    >
      <div className="flex items-center gap-2.5 overflow-hidden">
        <span className="text-primary font-bold select-none">&gt;</span>
        <span className="truncate font-semibold">{config.connectLink}</span>
      </div>
      <span className="badge badge-sm badge-ghost group-hover:badge-primary transition-all font-sans text-[11px] shrink-0">
        {copied ? "Skopiowano!" : "Kopiuj"}
      </span>
    </button>
  );
}
