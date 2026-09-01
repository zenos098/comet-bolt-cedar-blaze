import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PublishPanel } from "@/components/PublishPanel";
import { fieldClass } from "@/components/ToolForm";
import { useStudio } from "@/components/StudioShell";
import { brandSlug } from "@/lib/brand";
import { api } from "@/lib/client";
import { cn } from "@/lib/cn";
import type {
  Generation,
  PublicSocialAccount,
  PublishJob,
  SocialPlatform,
} from "@/lib/types";

export const Route = createFileRoute("/studio/publish")({
  component: PublishPage,
  head: () => ({ meta: [{ title: "Publish — Looply" }] }),
});

const NETWORKS: { platform: SocialPlatform; label: string; hint: string }[] = [
  { platform: "instagram", label: "Instagram", hint: "Feed post with still + caption" },
  { platform: "facebook", label: "Facebook", hint: "Page photo post" },
  { platform: "google", label: "Google Business", hint: "Local update on the live board" },
  { platform: "whatsapp", label: "WhatsApp", hint: "Status card on the live board" },
];

function PublishPage() {
  const { brand } = useStudio();
  const [accounts, setAccounts] = useState<PublicSocialAccount[]>([]);
  const [queue, setQueue] = useState<Generation[]>([]);
  const [jobs, setJobs] = useState<PublishJob[]>([]);
  const [tokenOpen, setTokenOpen] = useState<SocialPlatform | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const slug = brand ? brandSlug(brand.businessName) : "";

  async function load() {
    const [social, gens, published] = await Promise.all([
      api<{ items: PublicSocialAccount[] }>("/api/social"),
      api<{ items: Generation[] }>("/api/generations"),
      api<{ items: PublishJob[] }>("/api/publish"),
    ]);
    setAccounts(social.items);
    setQueue(
      gens.items.filter((g) =>
        ["post", "image", "ad", "reel", "calendar"].includes(g.kind),
      ),
    );
    setJobs(published.items.slice(0, 12));
  }

  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  const byPlatform = useMemo(() => {
    const map = new Map(accounts.map((a) => [a.platform, a]));
    return map;
  }, [accounts]);

  async function save(platform: SocialPlatform, form: FormData) {
    setNotice(null);
    await api("/api/social", {
      method: "POST",
      body: JSON.stringify({
        platform,
        handle: String(form.get("handle") || ""),
        displayName: String(form.get("displayName") || ""),
        connected: form.get("connected") === "on",
        accessToken: String(form.get("accessToken") || ""),
        pageId: String(form.get("pageId") || ""),
        igUserId: String(form.get("igUserId") || ""),
      }),
    });
    setNotice(`${platform} saved.`);
    await load();
  }

  const ready = queue.filter((g) => g.status === "ready");
  const live = queue.filter((g) => g.status === "posted");

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <header className="space-y-2">
        <p className="text-sm text-mint">{brand?.businessName || "Publisher"}</p>
        <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">Publish</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          Approve a post, pick networks, send it now or let Looply auto-post when the
          clock hits. The shop board is public so you can see it go live.
        </p>
        {slug ? (
          <Link
            to="/live/$slug"
            params={{ slug }}
            className="inline-flex rounded-full bg-mint px-4 py-2 text-sm font-medium text-mint-ink"
          >
            Open live board
          </Link>
        ) : null}
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {NETWORKS.map((net) => {
          const acc = byPlatform.get(net.platform);
          return (
            <form
              key={net.platform}
              className="card-surface p-5"
              onSubmit={async (e) => {
                e.preventDefault();
                await save(net.platform, new FormData(e.currentTarget));
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{net.label}</p>
                  <p className="mt-1 text-sm text-muted">{net.hint}</p>
                </div>
                <label className="flex items-center gap-2 text-xs text-cream/70">
                  <input
                    type="checkbox"
                    name="connected"
                    defaultChecked={acc?.connected ?? false}
                    className="size-4 accent-mint"
                  />
                  On
                </label>
              </div>
              <input type="hidden" name="displayName" defaultValue={acc?.displayName || brand?.businessName || ""} />
              <label className="mt-4 block text-sm">
                Handle
                <input
                  name="handle"
                  defaultValue={acc?.handle || ""}
                  className={`${fieldClass} mt-2`}
                  placeholder="@yourshop"
                />
              </label>
              <button
                type="button"
                className="mt-3 text-xs text-cream/45"
                onClick={() => setTokenOpen((p) => (p === net.platform ? null : net.platform))}
              >
                {tokenOpen === net.platform ? "Hide token" : "Paste Meta token (optional)"}
              </button>
              {tokenOpen === net.platform ? (
                <div className="mt-3 space-y-3">
                  <input
                    name="accessToken"
                    placeholder={acc?.hasToken ? "Token saved — paste to replace" : "Page access token"}
                    className={fieldClass}
                  />
                  <input name="pageId" placeholder="Facebook Page ID" defaultValue="" className={fieldClass} />
                  <input name="igUserId" placeholder="Instagram Business ID" className={fieldClass} />
                </div>
              ) : null}
              <button
                type="submit"
                className="mt-4 rounded-full border border-white/15 px-4 py-2 text-sm"
              >
                Save
              </button>
            </form>
          );
        })}
      </section>
      {notice ? <p className="text-sm text-mint">{notice}</p> : null}

      <section>
        <h2 className="font-serif text-2xl">Ready to send</h2>
        <p className="mt-1 text-sm text-muted">Generated posts waiting for approval.</p>
        <div className="mt-5 grid gap-6">
          {ready.length === 0 ? (
            <p className="text-sm text-muted">Nothing in the queue. Write a post first.</p>
          ) : (
            ready.slice(0, 4).map((item) => (
              <article key={item.id} className="grid gap-4 md:grid-cols-2">
                <div className="card-surface overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="" className="aspect-square w-full object-cover" />
                  ) : null}
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-widest text-mint">
                      {item.kind} · {item.platform}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-cream/85">
                      {item.caption}
                    </p>
                  </div>
                </div>
                <PublishPanel item={item} onUpdated={() => load()} />
              </article>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl">Activity</h2>
        <div className="mt-4 grid gap-3">
          {jobs.length === 0 && live.length === 0 ? (
            <p className="text-sm text-muted">No sends yet.</p>
          ) : (
            jobs.map((job) => (
              <article key={job.id} className="card-surface flex flex-wrap items-center justify-between gap-3 p-4">
                <p className="text-sm">
                  <span
                    className={cn(
                      "mr-2 rounded-full px-2 py-0.5 text-xs",
                      job.status === "posted"
                        ? "bg-mint/20 text-mint"
                        : "bg-white/8 text-cream/70",
                    )}
                  >
                    {job.status}
                  </span>
                  {job.platforms.join(" · ")}
                </p>
                <p className="text-xs text-muted">
                  {job.scheduledFor || job.updatedAt}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
