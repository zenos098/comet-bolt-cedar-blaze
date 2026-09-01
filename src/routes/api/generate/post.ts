import { createFileRoute } from "@tanstack/react-router";
import { generateText, imageUrl, parseLooseJson } from "@/lib/ai";
import { usedFromBrand } from "@/lib/brand";
import { fallbackPost, stillPrompt, writerSystem } from "@/lib/copy";
import { addGeneration, newId } from "@/lib/store";
import { handleError, json, readJson, requireSession } from "@/lib/http";
import { spend } from "@/lib/spend";

export const Route = createFileRoute("/api/generate/post")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const session = await requireSession(request);
        if (!session) return json({ error: "Unauthorized" }, 401);
        const body = await readJson<{ topic?: string; platform?: string }>(request);
        const topic = (body.topic ?? session.brand?.offer ?? "this week's drop").trim();
        const platform = (body.platform ?? "instagram").trim();
        const fb = fallbackPost(session.brand, topic, platform);
        try {
          const generated = await generateText(
            [
              {
                role: "system",
                content: writerSystem(
                  session.brand,
                  'Return JSON { "caption": string, "hashtags": string, "used": { "businessName", "city", "products", "offer", "audience" } }. Caption 80–140 words. It must only make sense for this shop.',
                ),
              },
              {
                role: "user",
                content: `Write a ${platform} post about: ${topic}. Use the brand kit. Do not write a generic caption that could fit any shop.`,
              },
            ],
            JSON.stringify(fb),
            { maxTokens: 500 },
          );
          const parsed = parseLooseJson<{
            caption?: string;
            hashtags?: string;
            used?: Record<string, string>;
          }>(generated.text);
          const caption = [parsed?.caption ?? fb.caption, parsed?.hashtags ?? fb.hashtags]
            .filter(Boolean)
            .join("\n\n");
          const prompt = stillPrompt(
            session.brand,
            `${topic}, ${session.brand?.products ?? "product"} on a shop table`,
            "editorial product still, boutique interior",
          );
          const image = imageUrl(prompt, 1024, 1024);
          const spent = await spend(session.user.id, "post");
          const item = await addGeneration({
            id: newId("gen"),
            userId: session.user.id,
            kind: "post",
            title: topic,
            prompt,
            caption,
            imageUrl: image,
            platform,
            status: "ready",
            createdAt: new Date().toISOString(),
            source: generated.source,
            used: parsed?.used ?? usedFromBrand(session.brand),
          });
          return json({ item, credits: spent.credits });
        } catch (err) {
          return handleError(err);
        }
      },
    },
  },
});
