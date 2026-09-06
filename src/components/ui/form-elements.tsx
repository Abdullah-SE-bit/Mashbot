import type { InputHTMLAttributes, ButtonHTMLAttributes } from "react";

export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-sm font-medium text-zinc-700">
        {label}
      </label>
      {children}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 ${props.className ?? ""}`}
    />
  );
}

export function SubmitButton({
  children,
  pending,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { pending?: boolean }) {
  return (
    <button
      {...rest}
      type="submit"
      disabled={pending || rest.disabled}
      className={`inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 ${rest.className ?? ""}`}
    >
      {pending ? "Please wait…" : children}
    </button>
  );
}

export function FormMessage({ success, message }: { success: boolean; message?: string }) {
  if (!message) return null;
  return (
    <p
      role={success ? "status" : "alert"}
      className={`text-sm ${success ? "text-emerald-700" : "text-red-700"}`}
    >
      {message}
    </p>
  );
}
