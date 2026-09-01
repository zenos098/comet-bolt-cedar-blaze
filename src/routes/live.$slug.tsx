import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LoopMark } from "@/components/LoopMark";
import type { Brand, Generation, PublicSocialAccount } from "@/lib/types";

export const Route = createFileRoute("/live/$slug")({
  component: LiveBoard,
  head: ({ params }) => ({
    meta: [{ title: `${params.slug} — Live · Looply` }],
  }),
});

type LivePayload = {
  brand: Brand;
  items: Generation[];
  accounts: PublicSocialAccount[];
  slug: string;
};

function LiveBoard() {
  const { slug } = Route.useParams();
  const [tab, setTab] = useState<"grid" | "feed">("grid");
  const [data, setData] = useState<LivePayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/live?slug=${encodeURIComponent(slug)}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || "Not found");
        setData(body as LivePayload);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Not found"));
  }, [slug]);

  if (error) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink text-muted">
        {error}
      </div>
    );
  }
  if (!data) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink text-muted">
        Opening live board…
      </div>
    );
  }

  const { brand, items, accounts } = data;
  const posted = items.filter((i) => i.imageUrl);

  return (
    <div className="min-h-screen bg-ink text-cream">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/80 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <LoopMark className="size-5 text-mint" />
            <span className="font-serif">looply</span>
          </Link>
          <p className="text-xs uppercase tracking-[0.18em] text-mint">Live</p>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex items-center gap-5">
          <div className="grid size-20 place-items-center rounded-full bg-mint text-2xl font-serif text-mint-ink">
            {brand.businessName.slice(0, 1)}
          </div>
          <div>
            <h1 className="font-serif text-3xl">{brand.businessName}</h1>
            <p className="mt-1 text-sm text-muted">
              {brand.industry} · {brand.city}
            </p>
            <p className="mt-2 text-sm text-cream/80">{brand.offer}</p>
          </div>
        </div>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-cream/70">
          {brand.audience}. {brand.products}.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-cream/55">
          {accounts.map((a) => (
            <span key={a.id} className="rounded-full border border-white/10 px-3 py-1">
              {a.platform} · {a.handle}
            </span>
          ))}
        </div>
        <div className="mt-8 flex gap-2">
          <button
            type="button"
            onClick={() => setTab("grid")}
            className={`rounded-full px-4 py-2 text-sm ${tab === "grid" ? "bg-mint text-mint-ink" : "text-cream/60"}`}
          >
            Instagram grid
          </button>
          <button
            type="button"
            onClick={() => setTab("feed")}
            className={`rounded-full px-4 py-2 text-sm ${tab === "feed" ? "bg-mint text-mint-ink" : "text-cream/60"}`}
          >
            Facebook feed
          </button>
        </div>
        {posted.length === 0 ? (
          <p className="mt-10 text-sm text-muted">
            Nothing live yet. Publish a post from the studio.
          </p>
        ) : tab === "grid" ? (
          <div className="mt-6 grid grid-cols-3 gap-1">
            {posted.map((item) => (
              <Link
                key={item.id}
                to="/p/$id"
                params={{ id: item.id }}
                className="aspect-square overflow-hidden bg-white/5"
              >
                <img src={item.imageUrl} alt={item.title} className="size-full object-cover" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {posted.map((item) => (
              <article key={item.id} className="card-surface overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <div className="grid size-9 place-items-center rounded-full bg-mint text-sm text-mint-ink">
                    {brand.businessName.slice(0, 1)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{brand.businessName}</p>
                    <p className="text-xs text-muted">
                      {item.postedTo?.join(" · ") || item.platform} · {item.createdAt.slice(0, 10)}
                    </p>
                  </div>
                </div>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="" className="aspect-square w-full object-cover" />
                ) : null}
                <p className="whitespace-pre-wrap p-4 text-sm leading-relaxed text-cream/85">
                  {item.caption}
                </p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
