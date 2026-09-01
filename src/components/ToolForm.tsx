import type { FormEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function ToolForm({
  title,
  hint,
  submitLabel = "Generate",
  busy,
  error,
  onSubmit,
  children,
  extra,
}: {
  title: string;
  hint: string;
  submitLabel?: string;
  busy: boolean;
  error: string | null;
  onSubmit: () => Promise<void> | void;
  children: ReactNode;
  extra?: ReactNode;
}) {
  async function handle(e: FormEvent) {
    e.preventDefault();
    await onSubmit();
  }
  return (
    <form onSubmit={handle} className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="space-y-2">
        <h1 className="font-serif text-4xl tracking-tight text-cream sm:text-5xl">{title}</h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted">{hint}</p>
      </header>
      <div className="card-surface flex flex-col gap-4 p-5 sm:p-6">{children}</div>
      {error ? (
        <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className={cn(
            "rounded-full bg-mint px-6 py-3 text-sm font-medium text-mint-ink",
            "transition-transform duration-150 ease-out active:scale-[0.96] disabled:opacity-60",
          )}
        >
          {busy ? "Generating… 8–20s" : submitLabel}
        </button>
        {extra}
      </div>
    </form>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="font-medium text-cream/80">{label}</span>
      {children}
    </label>
  );
}

export const fieldClass =
  "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-cream outline-none ring-mint/0 transition-[box-shadow] placeholder:text-cream/30 focus:ring-2 focus:ring-mint/40";
