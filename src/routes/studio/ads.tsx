import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BrandKit } from "@/components/BrandKit";
import { CopyBlock, ResultImage } from "@/components/CopyBlock";
import { PublishPanel } from "@/components/PublishPanel";
import { Field, fieldClass, ToolForm } from "@/components/ToolForm";
import { useStudio } from "@/components/StudioShell";
import { api } from "@/lib/client";
import type { Generation } from "@/lib/types";

export const Route = createFileRoute("/studio/ads")({
  component: AdsPage,
  head: () => ({ meta: [{ title: "Ads — Looply" }] }),
});

function AdsPage() {
  const { setCredits, brand } = useStudio();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<Generation | null>(null);
  const [offer, setOffer] = useState(brand?.offer ?? "");
  const [platform, setPlatform] = useState("instagram");

  return (
    <div className="space-y-10">
      <ToolForm
        title="Ads"
        hint="Copy and a square still from the brand kit. Looply does not spend ad budget. Publish sends the creative to your connected networks."
        busy={busy}
        error={error}
        submitLabel="Export creative · 2 credits"
        onSubmit={async () => {
          setBusy(true);
          setError(null);
          try {
            const res = await api<{ item: Generation; credits: number }>("/api/generate/ad", {
              method: "POST",
              body: JSON.stringify({ offer, platform }),
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
        <Field label="Offer">
          <input className={fieldClass} value={offer} onChange={(e) => setOffer(e.target.value)} />
        </Field>
        <Field label="Platform">
          <select className={fieldClass} value={platform} onChange={(e) => setPlatform(e.target.value)}>
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
            <CopyBlock text={item.caption || ""} />
          </div>
          <PublishPanel item={item} onUpdated={setItem} />
        </div>
      ) : null}
    </div>
  );
}
