import { createFileRoute } from "@tanstack/react-router";
import { generateText, imageUrl, parseLooseJson } from "@/lib/ai";
import { usedFromBrand } from "@/lib/brand";
import { fallbackReel, stillPrompt, writerSystem } from "@/lib/copy";
import { addGeneration, newId } from "@/lib/store";
import { handleError, json, readJson, requireSession } from "@/lib/http";
import { spend } from "@/lib/spend";

type ReelJson = {
  title?: string;
  hook?: string;
  beats?: string[];
  caption?: string;
  voiceover?: string;
};

export const Route = createFileRoute("/api/generate/reel")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const session = await requireSession(request);
        if (!session) return json({ error: "Unauthorized" }, 401);
        const body = await readJson<{ topic?: string }>(request);
        const topic = (body.topic ?? session.brand?.offer ?? "new drop").trim();
        const fb = fallbackReel(session.brand, topic);
        try {
          const generated = await generateText(
            [
              {
                role: "system",
                content: writerSystem(
                  session.brand,
                  'This is a storyboard, not a finished MP4. Return JSON { "title", "hook", "beats": [4 strings], "caption", "voiceover" }. Beats must show THIS shop, city, products and offer.',
                ),
              },
              {
                role: "user",
                content: `Storyboard a 4-beat Instagram Reel about: ${topic}`,
              },
            ],
            JSON.stringify(fb),
            { maxTokens: 600 },
          );
          const parsed = parseLooseJson<ReelJson>(generated.text) ?? fb;
          const beats = (
            Array.isArray(parsed.beats) && parsed.beats.length >= 4
              ? parsed.beats.slice(0, 4)
              : fb.beats
          ) as string[];
          const images = beats.map((beat, i) =>
            imageUrl(
              stillPrompt(
                session.brand,
                `vertical 9:16 film still, beat ${i + 1}: ${beat}`,
                "cinematic phone vertical, boutique interior",
              ),
              720,
              1280,
              41000 + i,
            ),
          );
          const payload = {
            title: parsed.title ?? fb.title,
            hook: parsed.hook ?? fb.hook,
            beats,
            caption: parsed.caption ?? fb.caption,
            voiceover: parsed.voiceover ?? fb.voiceover,
          };
          const spent = await spend(session.user.id, "reel");
          const item = await addGeneration({
            id: newId("gen"),
            userId: session.user.id,
            kind: "reel",
            title: payload.title,
            prompt: topic,
            caption: payload.caption,
            body: JSON.stringify(payload),
            images,
            imageUrl: images[0],
            platform: "instagram",
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
