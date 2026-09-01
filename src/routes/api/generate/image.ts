import { createFileRoute } from "@tanstack/react-router";
import { imageUrl } from "@/lib/ai";
import { usedFromBrand } from "@/lib/brand";
import { stillPrompt } from "@/lib/copy";
import { addGeneration, newId } from "@/lib/store";
import { handleError, json, readJson, requireSession } from "@/lib/http";
import { spend } from "@/lib/spend";

export const Route = createFileRoute("/api/generate/image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const session = await requireSession(request);
        if (!session) return json({ error: "Unauthorized" }, 401);
        const body = await readJson<{ brief?: string; style?: string }>(request);
        const brief = (body.brief ?? session.brand?.offer ?? "atelier still life").trim();
        const style = (body.style ?? "warm cinematic shop photography").trim();
        const prompt = stillPrompt(session.brand, brief, style);
        try {
          const spent = await spend(session.user.id, "image");
          const item = await addGeneration({
            id: newId("gen"),
            userId: session.user.id,
            kind: "image",
            title: brief.slice(0, 80),
            prompt,
            imageUrl: imageUrl(prompt, 1024, 1280),
            status: "ready",
            createdAt: new Date().toISOString(),
            source: "pollinations",
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
