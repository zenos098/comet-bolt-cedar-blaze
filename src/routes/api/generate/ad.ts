import { createFileRoute } from "@tanstack/react-router";
import { generateText, imageUrl, parseLooseJson } from "@/lib/ai";
import { usedFromBrand } from "@/lib/brand";
import { fallbackAd, stillPrompt, writerSystem } from "@/lib/copy";
import { addGeneration, newId } from "@/lib/store";
import { handleError, json, readJson, requireSession } from "@/lib/http";
import { spend } from "@/lib/spend";

export const Route = createFileRoute("/api/generate/ad")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const session = await requireSession(request);
        if (!session) return json({ error: "Unauthorized" }, 401);
        const body = await readJson<{ offer?: string; platform?: string }>(request);
        const offer = (body.offer ?? session.brand?.offer ?? "this week's offer").trim();
        const platform = (body.platform ?? "instagram").trim();
        const fb = fallbackAd(session.brand, offer, platform);
        try {
          const generated = await generateText(
            [
              {
                role: "system",
                content: writerSystem(
                  session.brand,
                  'Export ad copy only — do not spend budget. Return JSON { "headline", "primaryText", "cta" }. Name the business, city, product and offer.',
                ),
              },
              {
                role: "user",
                content: `Write a ${platform} ad for: ${offer}`,
              },
            ],
            JSON.stringify(fb),
            { maxTokens: 350 },
          );
          const parsed = parseLooseJson<typeof fb>(generated.text) ?? fb;
          const prompt = stillPrompt(
            session.brand,
            `square ad creative still for ${offer}, product hero, no text overlay`,
            "luxury boutique campaign still",
          );
          const spent = await spend(session.user.id, "ad");
          const payload = {
            headline: parsed.headline ?? fb.headline,
            primaryText: parsed.primaryText ?? fb.primaryText,
            cta: parsed.cta ?? fb.cta,
          };
          const item = await addGeneration({
            id: newId("gen"),
            userId: session.user.id,
            kind: "ad",
            title: payload.headline,
            prompt,
            caption: `${payload.headline}\n\n${payload.primaryText}\n\n${payload.cta}`,
            body: JSON.stringify(payload),
            imageUrl: imageUrl(prompt, 1080, 1080),
            platform,
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
