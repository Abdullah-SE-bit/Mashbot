"use client";

import { useState, useTransition } from "react";
import type { ActionResult } from "@/lib/types";

export function ActionButton({
  action,
  children,
  className,
  confirmMessage,
  variant = "default",
}: {
  action: () => Promise<ActionResult>;
  children: React.ReactNode;
  className?: string;
  confirmMessage?: string;
  variant?: "default" | "danger";
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<ActionResult | null>(null);

  const colors =
    variant === "danger"
      ? "border-red-300 text-red-700 hover:bg-red-50"
      : "border-zinc-300 text-zinc-800 hover:bg-zinc-100";

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (confirmMessage && !window.confirm(confirmMessage)) return;
          startTransition(async () => {
            const result = await action();
            setMessage(result);
          });
        }}
        className={`rounded-md border px-3 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-60 ${colors} ${className ?? ""}`}
      >
        {isPending ? "Working…" : children}
      </button>
      {message && !message.success && (
        <p role="alert" className="text-xs text-red-700">
          {message.message}
        </p>
      )}
    </div>
  );
}
