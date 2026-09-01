import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LoopMark } from "@/components/LoopMark";
import type { Brand, Generation, PublicSocialAccount } from "@/lib/types";

export const Route = createFileRoute("/p/$id")({
  component: PublicPost,
  head: () => ({ meta: [{ title: "Post — Looply" }] }),
});

type Payload = {
  item: Generation;
  brand: Brand | null;
  accounts: PublicSocialAccount[];
  slug: string;
};

function PublicPost() {
  const { id } = Route.useParams();
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/live?id=${encodeURIComponent(id)}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || "Not found");
        setData(body as Payload);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Not found"));
  }, [id]);

  if (error) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink text-muted">{error}</div>
    );
  }
  if (!data) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink text-muted">Opening post…</div>
    );
  }

  const { item, brand, slug } = data;
  const networks = item.postedTo?.length ? item.postedTo.join(" · ") : item.platform;

  return (
    <div className="min-h-screen bg-ink text-cream">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/80 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <LoopMark className="size-5 text-mint" />
            <span className="font-serif">looply</span>
          </Link>
          {slug ? (
            <Link to="/live/$slug" params={{ slug }} className="text-sm text-mint">
              {brand?.businessName}
            </Link>
          ) : null}
        </div>
      </header>
      <main className="mx-auto grid max-w-4xl gap-0 md:grid-cols-2 md:pt-10">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="w-full object-cover md:rounded-l-3xl" />
        ) : null}
        <article className="flex flex-col p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-mint">Posted · {networks}</p>
          <h1 className="mt-3 font-serif text-3xl">{brand?.businessName}</h1>
          <p className="mt-1 text-sm text-muted">
            {brand?.city} · {item.createdAt.slice(0, 16).replace("T", " ")}
          </p>
          <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-cream/90">
            {item.caption}
          </p>
          {item.used ? (
            <p className="mt-6 text-xs text-cream/40">
              Written from the brand kit
              {item.source ? ` · ${item.source}` : ""}
            </p>
          ) : null}
        </article>
      </main>
    </div>
  );
}
