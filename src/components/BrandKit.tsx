import { brandFacts } from "@/lib/brand";
import type { Brand } from "@/lib/types";

export function BrandKit({ brand }: { brand: Brand | null }) {
  const facts = brandFacts(brand);
  if (!facts.length) {
    return (
      <p className="text-sm text-muted">
        Save a brand kit first — every post is written from those facts, not a blank box.
      </p>
    );
  }
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-mint">Writing as this shop</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {facts.map((fact) => (
          <span
            key={fact.label}
            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-cream/80"
          >
            <span className="text-cream/40">{fact.label} · </span>
            {fact.value}
          </span>
        ))}
      </div>
    </div>
  );
}
