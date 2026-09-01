import type { Brand } from "./types";

export function brandSlug(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "shop";
}

export function brandFacts(brand: Brand | null): { label: string; value: string }[] {
  if (!brand) return [];
  return [
    { label: "Business", value: brand.businessName },
    { label: "City", value: brand.city },
    { label: "Industry", value: brand.industry },
    { label: "Audience", value: brand.audience },
    { label: "Offer", value: brand.offer },
    { label: "Products", value: brand.products },
    { label: "Colors", value: brand.colors },
    { label: "Tone", value: brand.tone },
    { label: "Language", value: brand.language },
  ].filter((row) => row.value.trim().length > 0);
}

export function usedFromBrand(brand: Brand | null): Record<string, string> {
  const used: Record<string, string> = {};
  for (const row of brandFacts(brand)) used[row.label] = row.value;
  return used;
}
