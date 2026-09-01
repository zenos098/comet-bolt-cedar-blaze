import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BrandKit } from "@/components/BrandKit";
import { CopyBlock, ResultImage } from "@/components/CopyBlock";
import { PublishPanel } from "@/components/PublishPanel";
import { Field, fieldClass, ToolForm } from "@/components/ToolForm";
import { useStudio } from "@/components/StudioShell";
import { api } from "@/lib/client";
import type { Generation } from "@/lib/types";

export const Route = createFileRoute("/studio/posts")({
  component: PostsPage,
  head: () => ({ meta: [{ title: "Posts — Looply" }] }),
});

function PostsPage() {
  const { setCredits, brand } = useStudio();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<Generation | null>(null);
  const [topic, setTopic] = useState(brand?.offer ?? "");
  const [platform, setPlatform] = useState("instagram");

  return (
    <div className="space-y-10">
      <ToolForm
        title="Posts"
        hint="Written from the brand kit — name, city, products, offer, tone, language. Approve, then publish to Instagram, Facebook, Google or WhatsApp."
        busy={busy}
        error={error}
        submitLabel="Write post · 1 credit"
        onSubmit={async () => {
          setBusy(true);
          setError(null);
          try {
            const res = await api<{ item: Generation; credits: number }>("/api/generate/post", {
              method: "POST",
              body: JSON.stringify({ topic, platform }),
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
            placeholder="New linen drop"
          />
        </Field>
        <Field label="Platform">
          <select
            className={fieldClass}
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="google">Google</option>
          </select>
        </Field>
      </ToolForm>
      {item ? (
        <div className="mx-auto grid w-full max-w-3xl gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            {item.imageUrl ? <ResultImage src={item.imageUrl} alt={item.title} /> : null}
            <div className="space-y-3">
              <CopyBlock text={item.caption || ""} />
              {item.used ? (
                <p className="text-xs text-cream/45">
                  Used {Object.values(item.used).join(" · ")}
                  {item.source ? ` · ${item.source}` : ""}
                </p>
              ) : null}
            </div>
          </div>
          <PublishPanel item={item} onUpdated={setItem} />
        </div>
      ) : null}
    </div>
  );
}
