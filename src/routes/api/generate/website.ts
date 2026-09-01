import { createFileRoute } from "@tanstack/react-router";
import { generateText, imageUrl, parseLooseJson } from "@/lib/ai";
import { usedFromBrand } from "@/lib/brand";
import { fallbackWebsite, stillPrompt, writerSystem } from "@/lib/copy";
import { addGeneration, newId } from "@/lib/store";
import { handleError, json, requireSession } from "@/lib/http";
import { spend } from "@/lib/spend";

type SiteJson = {
  hero?: string;
  about?: string;
  offer?: string;
  proof?: string;
  visit?: string;
  cta?: string;
};

export const Route = createFileRoute("/api/generate/website")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const session = await requireSession(request);
        if (!session) return json({ error: "Unauthorized" }, 401);
        const fb = fallbackWebsite(session.brand);
        try {
          const generated = await generateText(
            [
              {
                role: "system",
                content: writerSystem(
                  session.brand,
                  "Return JSON with keys HERO, ABOUT, OFFER, PROOF, VISIT, CTA as strings. Also accept lowercase keys. Copy must only fit this shop.",
                ),
              },
              {
                role: "user",
                content: "Write a one-page website for this brand.",
              },
            ],
            JSON.stringify(fb),
            { maxTokens: 700 },
          );
          const parsed = parseLooseJson<Record<string, string>>(generated.text);
          const pick = (key: string, fallback: string) =>
            parsed?.[key] ||
            parsed?.[key.toUpperCase()] ||
            parsed?.[key.toLowerCase()] ||
            fallback;
          const payload: SiteJson = {
            hero: pick("hero", fb.hero),
            about: pick("about", fb.about),
            offer: pick("offer", fb.offer),
            proof: pick("proof", fb.proof),
            visit: pick("visit", fb.visit),
            cta: pick("cta", fb.cta),
          };
          const prompt = stillPrompt(
            session.brand,
            `wide cinematic hero photograph of the ${session.brand?.industry || "shop"} storefront and interior`,
            "architectural shop photography, golden hour",
          );
          const spent = await spend(session.user.id, "website");
          const item = await addGeneration({
            id: newId("gen"),
            userId: session.user.id,
            kind: "website",
            title: session.brand?.businessName || "Website",
            prompt,
            caption: payload.hero,
            body: JSON.stringify(payload),
            imageUrl: imageUrl(prompt, 1920, 1080),
            status: "ready",
            createdAt: new Date().toISOString(),
            source: generated.source,
            used: usedFromBrand(session.brand),
          });
          return json({ item, credits: spent.credits });
        } catch (err) {
          return handleError(err);
        }
      },
    },
  },
});
