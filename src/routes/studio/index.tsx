import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, PenLine, Radio, ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useStudio } from "@/components/StudioShell";
import { brandSlug } from "@/lib/brand";
import { api } from "@/lib/client";
import type { Generation } from "@/lib/types";

export const Route = createFileRoute("/studio/")({
  component: StudioHome,
});

const SHORTCUTS = [
  {
    to: "/studio/posts" as const,
    title: "Write a post",
    hint: "From your brand kit · 1 credit",
    icon: PenLine,
  },
  {
    to: "/studio/publish" as const,
    title: "Publish",
    hint: "Instagram, Facebook, Google, WhatsApp",
    icon: Radio,
  },
  {
    to: "/studio/shoot" as const,
    title: "Shoot stills",
    hint: "Product photo · 1 credit",
    icon: ImageIcon,
  },
  {
    to: "/studio/calendar" as const,
    title: "Plan the week",
    hint: "Auto-posts when due · 3 credits",
    icon: CalendarDays,
  },
];

function StudioHome() {
  const { user, brand } = useStudio();
  const [items, setItems] = useState<Generation[]>([]);
  const slug = brand ? brandSlug(brand.businessName) : "";

  useEffect(() => {
    api<{ items: Generation[] }>("/api/generations")
      .then((d) => setItems(d.items.slice(0, 8)))
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm text-mint">{brand?.city || "Studio"}</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">
        {brand?.businessName || "Set the brand first"}
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted">
        {brand?.offer || "Save a brand kit so every generation already knows the shop."}{" "}
        You have <span className="tabular-nums text-cream">{user.credits}</span> credits
        on the {user.plan} plan.
      </p>
      {slug ? (
        <Link
          to="/live/$slug"
          params={{ slug }}
          className="mt-4 inline-flex text-sm text-mint"
        >
          Open live board
        </Link>
      ) : null}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {SHORTCUTS.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="card-surface flex items-start gap-4 p-5 transition-[box-shadow] hover:shadow-[var(--shadow-border-hover)]"
          >
            <s.icon className="mt-0.5 size-5 text-mint" />
            <span>
              <span className="block font-medium">{s.title}</span>
              <span className="mt-1 block text-sm text-muted">{s.hint}</span>
            </span>
          </Link>
        ))}
      </div>
      <h2 className="mt-12 font-serif text-2xl">Recent work</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted">
          Nothing yet. Generate a post — then publish it to the live board.
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <article key={item.id} className="card-surface overflow-hidden">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt="" className="h-36 w-full object-cover" />
              ) : (
                <div className="grid h-36 place-items-center text-xs uppercase tracking-widest text-cream/30">
                  {item.kind}
                </div>
              )}
              <div className="p-3">
                <p className="truncate text-sm">{item.title}</p>
                <p className="text-xs capitalize text-muted">
                  {item.kind} · {item.status}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
