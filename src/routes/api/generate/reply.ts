import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "@/lib/ai";
import { usedFromBrand } from "@/lib/brand";
import { fallbackReply, writerSystem } from "@/lib/copy";
import { addGeneration, addMessage, newId } from "@/lib/store";
import { handleError, json, readJson, requireSession } from "@/lib/http";
import { spend } from "@/lib/spend";
import type { Channel, GenerationKind } from "@/lib/types";

export const Route = createFileRoute("/api/generate/reply")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const session = await requireSession(request);
        if (!session) return json({ error: "Unauthorized" }, 401);
        const body = await readJson<{
          text?: string;
          channel?: Channel;
          from?: string;
          kind?: GenerationKind;
        }>(request);
        const text = (body.text ?? "").trim();
        if (!text) return json({ error: "Message text required" }, 400);
        const channel = body.channel ?? "instagram";
        const from = (body.from ?? "customer").trim();
        const kind = body.kind === "review" ? "review" : "reply";
        const fb = fallbackReply(session.brand, text);
        try {
          const generated = await generateText(
            [
              {
                role: "system",
                content: writerSystem(
                  session.brand,
                  `Draft a reply the owner can paste. Max 70 words. Answer as this shop, using the offer and products. Return plain text only.`,
                ),
              },
              {
                role: "user",
                content: `${kind} from ${from} on ${channel}: ${text}`,
              },
            ],
            fb,
            { maxTokens: 220 },
          );
          const reply = generated.text.replace(/^["']|["']$/g, "").trim() || fb;
          const spent = await spend(session.user.id, kind);
          const message = await addMessage({
            id: newId("msg"),
            userId: session.user.id,
            channel,
            from,
            text,
            reply,
            createdAt: new Date().toISOString(),
          });
          const item = await addGeneration({
            id: newId("gen"),
            userId: session.user.id,
            kind,
            title: `Reply to ${from}`,
            prompt: text,
            caption: reply,
            body: JSON.stringify(message),
            platform: channel,
            status: "draft",
            createdAt: new Date().toISOString(),
            source: generated.source,
            used: usedFromBrand(session.brand),
          });
          return json({ item, message, credits: spent.credits });
        } catch (err) {
          return handleError(err);
        }
      },
    },
  },
});
