"use client";

import { useState } from "react";

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className={`eyebrow link-draw pb-1 transition-colors ${ok ? "text-accent" : ""}`}
      aria-label={`Copiar ${label}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setOk(true);
          setTimeout(() => setOk(false), 2000);
        } catch {}
      }}
    >
      <span aria-live="polite">{ok ? "Copiado" : "Copiar"}</span>
    </button>
  );
}
