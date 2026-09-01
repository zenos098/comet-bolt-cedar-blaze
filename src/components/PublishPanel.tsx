import { Check, LoaderCircle, Radio } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { api } from "@/lib/client";
import { cn } from "@/lib/cn";
import type { Generation, PublicSocialAccount, SocialPlatform } from "@/lib/types";

const LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  google: "Google Business",
  whatsapp: "WhatsApp",
};

type Step = { label: string; state: "wait" | "run" | "done" | "fail" };

export function PublishPanel({
  item,
  onUpdated,
}: {
  item: Generation;
  onUpdated?: (item: Generation) => void;
}) {
  const [accounts, setAccounts] = useState<PublicSocialAccount[]>([]);
  const [selected, setSelected] = useState<SocialPlatform[]>([]);
  const [when, setWhen] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [done, setDone] = useState<Generation | null>(item.status === "posted" ? item : null);

  useEffect(() => {
    api<{ items: PublicSocialAccount[] }>("/api/social")
      .then((d) => {
        const connected = d.items.filter((a) => a.connected);
        setAccounts(connected);
        setSelected(connected.map((a) => a.platform));
      })
      .catch(() => setAccounts([]));
  }, []);

  const preview = useMemo(
    () =>
      selected.map((platform) => {
        const acc = accounts.find((a) => a.platform === platform);
        return `${LABELS[platform]} ${acc?.handle || ""}`.trim();
      }),
    [selected, accounts],
  );

  async function publish(schedule: boolean) {
    if (!selected.length) {
      setError("Pick at least one network.");
      return;
    }
    setBusy(true);
    setError(null);
    const planned: Step[] = [
      { label: "Using the brand kit", state: "run" },
      { label: "Uploading the still", state: "wait" },
      ...selected.map((p) => ({
        label: `Posting to ${LABELS[p]}`,
        state: "wait" as const,
      })),
      { label: "Live on the shop board", state: "wait" },
    ];
    setSteps(planned);

    const advance = async () => {
      for (let i = 0; i < planned.length - 1; i += 1) {
        await new Promise((r) => setTimeout(r, 280));
        setSteps((prev) =>
          prev.map((s, idx) =>
            idx < i ? { ...s, state: "done" } : idx === i ? { ...s, state: "run" } : s,
          ),
        );
      }
    };
    const anim = advance();

    try {
      const res = await api<{
        item: Generation;
        deferred: boolean;
      }>("/api/publish", {
        method: "POST",
        body: JSON.stringify({
          generationId: item.id,
          platforms: selected,
          scheduledFor: schedule && when ? new Date(when).toISOString() : undefined,
        }),
      });
      await anim;
      setSteps((prev) => prev.map((s) => ({ ...s, state: "done" })));
      setDone(res.item);
      onUpdated?.(res.item);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not publish");
      setSteps((prev) =>
        prev.map((s) => (s.state === "run" ? { ...s, state: "fail" } : s)),
      );
    } finally {
      setBusy(false);
    }
  }

  if (!accounts.length) {
    return (
      <div className="card-surface p-5">
        <p className="text-sm text-muted">
          Connect Instagram, Facebook, Google or WhatsApp in Publish to send this live.
        </p>
        <Link to="/studio/publish" className="mt-3 inline-block text-sm text-mint">
          Open publisher
        </Link>
      </div>
    );
  }

  return (
    <div className="card-surface space-y-5 p-5 sm:p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-mint">Publish</p>
        <h2 className="mt-1 font-serif text-2xl">Send it out</h2>
        <p className="mt-1 text-sm text-muted">
          Posts go live on the shop board immediately. If a Meta Page token is saved, Looply
          also pushes to the real network.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {accounts.map((account) => {
          const on = selected.includes(account.platform);
          return (
            <button
              key={account.id}
              type="button"
              onClick={() =>
                setSelected((prev) =>
                  on
                    ? prev.filter((p) => p !== account.platform)
                    : [...prev, account.platform],
                )
              }
              className={cn(
                "rounded-full border px-3 py-2 text-sm transition-colors",
                on
                  ? "border-mint/40 bg-mint/15 text-cream"
                  : "border-white/10 text-cream/55",
              )}
            >
              {LABELS[account.platform]} · {account.handle}
            </button>
          );
        })}
      </div>
      <label className="block text-sm text-cream/70">
        Schedule (optional)
        <input
          type="datetime-local"
          value={when}
          onChange={(e) => setWhen(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-cream outline-none focus:ring-2 focus:ring-mint/40"
        />
      </label>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => publish(false)}
          className="rounded-full bg-mint px-5 py-3 text-sm font-medium text-mint-ink disabled:opacity-60"
        >
          {busy && !when ? "Publishing…" : "Post now"}
        </button>
        <button
          type="button"
          disabled={busy || !when}
          onClick={() => publish(true)}
          className="rounded-full border border-white/15 px-5 py-3 text-sm text-cream disabled:opacity-60"
        >
          Schedule auto-post
        </button>
      </div>
      {steps.length ? (
        <ol className="space-y-2">
          {steps.map((step) => (
            <li key={step.label} className="flex items-center gap-2 text-sm text-cream/80">
              {step.state === "run" ? (
                <LoaderCircle className="size-4 animate-spin text-mint" />
              ) : step.state === "done" ? (
                <Check className="size-4 text-mint" />
              ) : step.state === "fail" ? (
                <Radio className="size-4 text-red-300" />
              ) : (
                <span className="size-4 rounded-full border border-white/15" />
              )}
              {step.label}
            </li>
          ))}
        </ol>
      ) : null}
      {done?.status === "posted" ? (
        <p className="text-sm text-mint">
          Live{preview.length ? ` · ${preview.join(" · ")}` : ""}.{" "}
          <Link
            to="/p/$id"
            params={{ id: done.id }}
            className="underline decoration-mint/40 underline-offset-4"
          >
            Open the post
          </Link>
        </p>
      ) : done?.status === "scheduled" ? (
        <p className="text-sm text-mint">
          Queued for {done.scheduledFor}. Studio will post it when due.
        </p>
      ) : null}
    </div>
  );
}
