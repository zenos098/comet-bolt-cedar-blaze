import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BrandKit } from "@/components/BrandKit";
import { CopyBlock, ResultImage } from "@/components/CopyBlock";
import { PublishPanel } from "@/components/PublishPanel";
import { Field, fieldClass, ToolForm } from "@/components/ToolForm";
import { useStudio } from "@/components/StudioShell";
import { api } from "@/lib/client";
import type { Generation } from "@/lib/types";

export const Route = createFileRoute("/studio/reels")({
  component: ReelsPage,
  head: () => ({ meta: [{ title: "Reels — Looply" }] }),
});

function parseBody(item: Generation) {
  try {
    return JSON.parse(item.body || "{}") as {
      hook?: string;
      beats?: string[];
      voiceover?: string;
      caption?: string;
    };
  } catch {
    return {};
  }
}

function ReelsPage() {
  const { setCredits, brand } = useStudio();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<Generation | null>(null);
  const [topic, setTopic] = useState(brand?.offer ?? "");

  const meta = item ? parseBody(item) : null;

  return (
    <div className="space-y-10">
      <ToolForm
        title="Reels"
        hint="Storyboard, voiceover and four 9:16 stills from the brand kit — not a full AI-actor MP4. Cover still can be published to Instagram."
        busy={busy}
        error={error}
        submitLabel="Storyboard Reel · 4 credits"
        onSubmit={async () => {
          setBusy(true);
          setError(null);
          try {
            const res = await api<{ item: Generation; credits: number }>("/api/generate/reel", {
              method: "POST",
              body: JSON.stringify({ topic }),
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
        <BrandKit brand={brand} />
        <Field label="Topic">
          <input
            className={fieldClass}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </Field>
      </ToolForm>
      {item && meta ? (
        <div className="mx-auto w-full max-w-3xl space-y-6">
          <p className="font-serif text-2xl">{meta.hook || item.title}</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(item.images ?? []).map((src, i) => (
              <div key={src}>
                <ResultImage src={src} alt={`Beat ${i + 1}`} />
                <p className="mt-2 text-xs text-muted">{meta.beats?.[i]}</p>
              </div>
            ))}
          </div>
          {meta.voiceover ? <CopyBlock text={meta.voiceover} label="Copy voiceover" /> : null}
          {item.caption ? <CopyBlock text={item.caption} /> : null}
          <PublishPanel item={item} onUpdated={setItem} />
        </div>
      ) : null}
    </div>
  );
}
