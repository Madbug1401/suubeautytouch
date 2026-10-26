"use client";

import { useState } from "react";

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-outline btn-sm"
      aria-label={`Copiar ${label}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setOk(true);
          setTimeout(() => setOk(false), 2000);
        } catch {}
      }}
    >
      {ok ? "Copiado ✓" : "Copiar"}
    </button>
  );
}
