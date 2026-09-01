import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CopyBlock, ResultImage } from "@/components/CopyBlock";
import { ToolForm } from "@/components/ToolForm";
import { useStudio } from "@/components/StudioShell";
import { api } from "@/lib/client";
import type { Generation } from "@/lib/types";

export const Route = createFileRoute("/studio/website")({
  component: WebsitePage,
  head: () => ({ meta: [{ title: "Website — Looply" }] }),
});

type Site = {
  hero?: string;
  about?: string;
  offer?: string;
  proof?: string;
  visit?: string;
  cta?: string;
};

function WebsitePage() {
  const { setCredits, brand } = useStudio();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<Generation | null>(null);

  let site: Site = {};
  try {
    site = JSON.parse(item?.body || "{}") as Site;
  } catch {
    site = {};
  }

  return (
    <div className="space-y-10">
      <ToolForm
        title="Website"
        hint="One page of copy plus a hero still. You still host it — Looply does not publish a domain."
        busy={busy}
        error={error}
        submitLabel="Write the page · 5 credits"
        onSubmit={async () => {
          setBusy(true);
          setError(null);
          try {
            const res = await api<{ item: Generation; credits: number }>(
              "/api/generate/website",
              { method: "POST" },
            );
            setItem(res.item);
            setCredits(res.credits);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          } finally {
            setBusy(false);
          }
        }}
      >
        <p className="text-sm text-muted">
          Uses the brand kit for {brand?.businessName || "your shop"} in{" "}
          {brand?.city || "your city"}. Sections: HERO, ABOUT, OFFER, PROOF,
          VISIT, CTA.
        </p>
      </ToolForm>
      {item ? (
        <div className="mx-auto w-full max-w-3xl space-y-6">
          {item.imageUrl ? <ResultImage src={item.imageUrl} alt="Hero" /> : null}
          {(
            [
              ["HERO", site.hero],
              ["ABOUT", site.about],
              ["OFFER", site.offer],
              ["PROOF", site.proof],
              ["VISIT", site.visit],
              ["CTA", site.cta],
            ] as const
          ).map(([label, value]) =>
            value ? (
              <div key={label}>
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-mint">{label}</p>
                <CopyBlock text={value} />
              </div>
            ) : null,
          )}
        </div>
      ) : null}
    </div>
  );
}
