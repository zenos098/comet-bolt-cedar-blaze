import { brandContext, COPY_RULES } from "./ai";
import type { Brand } from "./types";

export function brandName(brand: Brand | null) {
  return brand?.businessName || "your shop";
}

export function cityOf(brand: Brand | null) {
  return brand?.city || "your city";
}

export function writerSystem(brand: Brand | null, extra: string) {
  return [
    COPY_RULES,
    "Brand kit (required facts — use them, do not invent a different shop):",
    brandContext(brand),
    extra,
  ].join("\n");
}

export function fallbackPost(brand: Brand | null, topic: string, platform: string) {
  const name = brandName(brand);
  const city = cityOf(brand);
  const offer = brand?.offer || "this week's drop";
  const products = brand?.products || "the new pieces";
  const audience = brand?.audience || "people who actually wear the clothes";
  const hindi =
    (brand?.language || "").toLowerCase().includes("hindi")
      ? "\n\nNaya linen drop hai — is hafte hemming free. Size hold karwana ho to message karo."
      : "";
  return {
    caption: `${name}, ${city}. ${topic || offer}.\n\nCut for ${audience}. We keep ${products} on the rack — not a lookbook that never leaves the studio. ${offer}. Come in, get measured, leave with something that sits right on the shoulder.${hindi}\n\nReply here or walk in this week. We'll hold a size if you message before Saturday.`,
    hashtags: `#${name.replace(/\s+/g, "")} #${city.replace(/\s+/g, "")} #${(brand?.industry || "local").replace(/\s+/g, "")} #ShopLocal #MadeToFit #ThisWeek #Atelier #D2C`,
    platform,
    used: {
      businessName: name,
      city,
      products,
      offer,
      audience,
    },
  };
}

export function fallbackAd(brand: Brand | null, offer: string, platform: string) {
  const name = brandName(brand);
  const city = cityOf(brand);
  const line = offer || brand?.offer || "New drop this week";
  const products = brand?.products || "the new pieces";
  return {
    headline: `${line}`,
    primaryText: `${name}, ${city}. ${line}. ${products} — walk in for a fitting, we finish it the same week.`,
    cta: "Book a fitting",
    platform,
  };
}

export function fallbackReply(brand: Brand | null, text: string) {
  const name = brandName(brand);
  const city = cityOf(brand);
  const offer = brand?.offer || "this week's offer";
  const products = brand?.products || "the piece you asked about";
  return `Hi, this is ${name} in ${city}. Yes — ${offer}. For ${products}, share a size and area and we'll hold it. Send a photo of the listing you mean and we'll confirm today.`;
}

export function fallbackWebsite(brand: Brand | null) {
  const name = brandName(brand);
  const city = cityOf(brand);
  const offer = brand?.offer || "New drop this week";
  const products = brand?.products || "ready-to-wear";
  const colors = brand?.colors || "quiet neutrals";
  const audience = brand?.audience || "people who wear their clothes";
  return {
    hero: `${name} — ${products} made to be worn in ${city}.`,
    about: `${name} is a small ${brand?.industry || "atelier"} for ${audience}. We cut ${products} in ${colors}, then fit them on the person who will actually wear them.`,
    offer: offer,
    proof: `Clients in ${city} come back for fittings, restocks, and the pieces that never quite stay on the rack.`,
    visit: `Visit the studio in ${city}. Message for a fitting slot — evenings by appointment.`,
    cta: "Book a fitting this week",
  };
}

export function fallbackReel(brand: Brand | null, topic: string) {
  const name = brandName(brand);
  const city = cityOf(brand);
  const offer = topic || brand?.offer || "the new drop";
  const products = brand?.products || "the new pieces";
  return {
    title: `${offer} — ${name}`,
    hook: `Stop scrolling. ${city} · ${name} · ${offer}.`,
    beats: [
      `Hands on cloth. ${products} on a quiet rack in ${city}.`,
      `A piece on a real shoulder — hem marked, pins in, no catalogue pose.`,
      `The offer card: ${offer}.`,
      `Door of the shop. Voiceover: come in this week.`,
    ],
    caption: `${name} · ${city}. ${offer}. Storyboard for a Reel — stills, not an AI actor. Book a fitting.`,
    voiceover: `This is ${name} in ${city}. ${offer}. Come in, get measured, leave with something that sits right.`,
  };
}

export function fallbackCalendar(brand: Brand | null, days: number) {
  const name = brandName(brand);
  const city = cityOf(brand);
  const offer = brand?.offer || "this week's drop";
  const products = (brand?.products || "the new pieces").split(",")[0]?.trim();
  const industry = brand?.industry || "the shop";
  const topics = [
    `${offer}`,
    `Why ${products} works in ${city}`,
    `Fitting vs ordering online — ${name}`,
    `Restock notes from the ${industry}`,
    `How we finish a piece in 48 hours`,
    `Client wall — real wear, ${city}`,
    `Sunday hours and walk-ins`,
    `${products} for workdays`,
    `Three ways to wear it this week`,
    `What to bring to a fitting`,
    `Studio notes in ${brand?.language || "English"}`,
    `Behind the rack at ${name}`,
    `Limited sizes this week`,
    `Last call on ${offer}`,
  ];
  const platforms = ["instagram", "instagram", "facebook", "instagram", "google"];
  const count = Math.min(14, Math.max(5, days));
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      day: date.toISOString().slice(0, 10),
      topic: topics[i % topics.length],
      caption: `${name} · ${city}. ${topics[i % topics.length]}. ${offer}. Reply to hold a size.`,
      platform: platforms[i % platforms.length],
    };
  });
}

export function stillPrompt(brand: Brand | null, brief: string, style: string) {
  const colors = brand?.colors || "natural neutrals";
  const products = brand?.products || "the shop's products";
  const industry = brand?.industry || "independent shop";
  return [
    "Photorealistic editorial photograph, no text, no watermark, no logo",
    style || "warm cinematic shop photography",
    brief,
    `${products} in a ${industry}`,
    `palette ${colors}`,
    brand?.city ? `set in ${brand.city}` : "",
    brand?.businessName ? `independent shop ${brand.businessName}` : "",
    "natural window light, 35mm, shallow depth of field, real material texture",
  ]
    .filter(Boolean)
    .join(", ");
}
