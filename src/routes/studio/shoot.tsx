import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ResultImage } from "@/components/CopyBlock";
import { Field, fieldClass, ToolForm } from "@/components/ToolForm";
import { useStudio } from "@/components/StudioShell";
import { api } from "@/lib/client";
import type { Generation } from "@/lib/types";

export const Route = createFileRoute("/studio/shoot")({
  component: ShootPage,
  head: () => ({ meta: [{ title: "Shoot — Looply" }] }),
});

function ShootPage() {
  const { setCredits, brand } = useStudio();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<Generation | null>(null);
  const [brief, setBrief] = useState(
    brand ? `${brand.products} on a teak table, ${brand.city} light` : "",
  );
  const [style, setStyle] = useState("warm cinematic shop photography");

  return (
    <div className="space-y-10">
      <ToolForm
        title="Shoot"
        hint="Stills only — a photograph from the brand kit. Not a model shoot, not a video."
        busy={busy}
        error={error}
        submitLabel="Shoot still · 1 credit"
        onSubmit={async () => {
          setBusy(true);
          setError(null);
          try {
            const res = await api<{ item: Generation; credits: number }>("/api/generate/image", {
              method: "POST",
              body: JSON.stringify({ brief, style }),
            });
            setItem(res.item);
            setCredits(res.credits);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          } finally {
            setBusy(false);
          }
        }}
      >
        <Field label="Brief">
          <textarea
            className={fieldClass}
            rows={3}
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
          />
        </Field>
        <Field label="Style">
          <input
            className={fieldClass}
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          />
        </Field>
      </ToolForm>
      {item?.imageUrl ? (
        <div className="mx-auto w-full max-w-xl">
          <ResultImage src={item.imageUrl} alt={item.title} />
        </div>
      ) : null}
    </div>
  );
}
