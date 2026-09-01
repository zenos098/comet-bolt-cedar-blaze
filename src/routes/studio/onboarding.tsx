import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { fieldClass } from "@/components/ToolForm";
import { useStudio } from "@/components/StudioShell";
import { api } from "@/lib/client";
import type { Brand } from "@/lib/types";

export const Route = createFileRoute("/studio/onboarding")({
  component: OnboardingPage,
  head: () => ({ meta: [{ title: "Brand — Looply" }] }),
});

const FIELDS: { key: keyof Brand; label: string; placeholder: string }[] = [
  { key: "businessName", label: "Business name", placeholder: "Nimrah Atelier" },
  { key: "website", label: "Website", placeholder: "https://" },
  { key: "industry", label: "Industry", placeholder: "boutique fashion" },
  { key: "city", label: "City", placeholder: "Delhi" },
  { key: "language", label: "Language", placeholder: "English + Hindi" },
  { key: "tone", label: "Tone", placeholder: "warm confident" },
  { key: "audience", label: "Audience", placeholder: "who you sell to" },
  { key: "offer", label: "Current offer", placeholder: "New linen drop + free hemming" },
  { key: "products", label: "Products", placeholder: "linen sets, kurtas, silk shirts" },
  { key: "colors", label: "Colors", placeholder: "ivory, forest green, warm gold" },
];

function OnboardingPage() {
  const { brand, setBrand } = useStudio();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload: Record<string, string> = {};
    for (const field of FIELDS) {
      payload[field.key] = String(form.get(field.key) || "");
    }
    try {
      const res = await api<{ brand: Brand }>("/api/brand", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setBrand(res.brand);
      navigate({ to: "/studio" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save brand");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl">
      <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">Brand kit</h1>
      <p className="mt-3 text-sm text-muted">
        Learned once. Every post, still, Reel and reply uses this — no blank
        prompt box after setup.
      </p>
      <div className="card-surface mt-8 grid gap-4 p-5 sm:p-6">
        {FIELDS.map((field) => (
          <label key={field.key} className="text-sm">
            {field.label}
            <input
              name={field.key}
              required={field.key === "businessName"}
              defaultValue={String(brand?.[field.key] ?? "")}
              placeholder={field.placeholder}
              className={`${fieldClass} mt-2`}
            />
          </label>
        ))}
      </div>
      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="mt-6 rounded-full bg-mint px-6 py-3 text-sm font-medium text-mint-ink disabled:opacity-60"
      >
        {busy ? "Saving…" : "Save brand"}
      </button>
    </form>
  );
}
