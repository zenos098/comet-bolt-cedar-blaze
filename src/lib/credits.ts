import type { GenerationKind, PlanId } from "./types";

export const CREDIT_COSTS: Record<GenerationKind, number> = {
  post: 1,
  image: 1,
  reel: 4,
  ad: 2,
  calendar: 3,
  reply: 1,
  review: 1,
  website: 5,
};

export const PLANS: Record<
  PlanId,
  {
    id: PlanId;
    name: string;
    usd: number;
    inr: number;
    credits: number;
    blurb: string;
    points: string[];
  }
> = {
  start: {
    id: "start",
    name: "Start",
    usd: 0,
    inr: 0,
    credits: 20,
    blurb: "Learn the brand and try every tool once.",
    points: ["20 credits", "1 brand kit", "Posts, stills and inbox drafts"],
  },
  growth: {
    id: "growth",
    name: "Growth",
    usd: 19.99,
    inr: 1499,
    credits: 100,
    blurb: "A week of posting, Reels and replies for a live shop.",
    points: ["100 credits", "Calendar + Reels", "Ads exported as creatives"],
  },
  pro: {
    id: "pro",
    name: "Pro",
    usd: 39.99,
    inr: 2999,
    credits: 250,
    blurb: "Ads, a site, and daily content while you run the floor.",
    points: ["250 credits", "Website copy + hero", "Priority studio tools"],
  },
};

export function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
