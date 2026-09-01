import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BrandKit } from "@/components/BrandKit";
import { Field, fieldClass, ToolForm } from "@/components/ToolForm";
import { useStudio } from "@/components/StudioShell";
import { api } from "@/lib/client";
import type { Generation } from "@/lib/types";

export const Route = createFileRoute("/studio/calendar")({
  component: CalendarPage,
  head: () => ({ meta: [{ title: "Calendar — Looply" }] }),
});

function CalendarPage() {
  const { setCredits, brand } = useStudio();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(7);
  const [items, setItems] = useState<Generation[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  async function load() {
    const res = await api<{ items: Generation[] }>("/api/generations");
    setItems(res.items.filter((i) => i.kind === "calendar" || i.status === "scheduled"));
  }

  useEffect(() => {
    load().catch(() => setItems([]));
  }, []);

  return (
    <div className="space-y-10">
      <ToolForm
        title="Calendar"
        hint="Plans 5–14 posts from the brand kit. Day-one items auto-post when due if networks are connected in Publish."
        busy={busy}
        error={error}
        submitLabel="Plan week · 3 credits"
        onSubmit={async () => {
          setBusy(true);
          setError(null);
          try {
            const res = await api<{ items: Generation[]; credits: number }>(
              "/api/generate/calendar",
              { method: "POST", body: JSON.stringify({ days }) },
            );
            setItems(res.items);
            setCredits(res.credits);
            setNotice("Queued. Studio posts each day automatically when it is due.");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          } finally {
            setBusy(false);
          }
        }}
      >
        <BrandKit brand={brand} />
        <Field label="Days (5–14)">
          <input
            type="number"
            min={5}
            max={14}
            className={fieldClass}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          />
        </Field>
      </ToolForm>
      {notice ? <p className="mx-auto max-w-3xl text-sm text-mint">{notice}</p> : null}
      {items.length ? (
        <div className="mx-auto grid w-full max-w-3xl gap-3">
          {items.map((item) => (
            <article key={item.id} className="card-surface p-5">
              <p className="text-xs uppercase tracking-widest text-mint">
                {item.scheduledFor || "unscheduled"} · {item.platform} · {item.status}
              </p>
              <h2 className="mt-1 font-serif text-2xl">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.caption}</p>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
