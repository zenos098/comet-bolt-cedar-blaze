import { createFileRoute } from "@tanstack/react-router";
import { generateText, parseLooseJson } from "@/lib/ai";
import { usedFromBrand } from "@/lib/brand";
import { fallbackCalendar, writerSystem } from "@/lib/copy";
import { addGenerations, newId } from "@/lib/store";
import { handleError, json, readJson, requireSession } from "@/lib/http";
import { spend } from "@/lib/spend";

type DayPlan = {
  day?: string;
  topic?: string;
  caption?: string;
  platform?: string;
};

export const Route = createFileRoute("/api/generate/calendar")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const session = await requireSession(request);
        if (!session) return json({ error: "Unauthorized" }, 401);
        const body = await readJson<{ days?: number }>(request);
        const days = Math.min(14, Math.max(5, Number(body.days) || 7));
        const fb = fallbackCalendar(session.brand, days);
        try {
          const generated = await generateText(
            [
              {
                role: "system",
                content: writerSystem(
                  session.brand,
                  `Return JSON array of ${days} items: { "day": "YYYY-MM-DD", "topic", "caption", "platform" }. Start from today. Each caption must name this business and city.`,
                ),
              },
              {
                role: "user",
                content: `Plan ${days} scheduled posts for this brand.`,
              },
            ],
            JSON.stringify(fb),
            { maxTokens: 900 },
          );
          const parsed = parseLooseJson<DayPlan[]>(generated.text);
          const rows = (Array.isArray(parsed) && parsed.length ? parsed : fb).slice(0, days);
          const spent = await spend(session.user.id, "calendar");
          const now = new Date().toISOString();
          const used = usedFromBrand(session.brand);
          const items = await addGenerations(
            rows.map((row, i) => {
              const day =
                row.day ||
                new Date(Date.now() + i * 86400000).toISOString().slice(0, 10);
              return {
                id: newId("gen"),
                userId: session.user.id,
                kind: "calendar" as const,
                title: row.topic || `Day ${i + 1}`,
                prompt: row.topic || "",
                caption: row.caption || fb[i]?.caption,
                platform: row.platform || "instagram",
                status: "scheduled" as const,
                scheduledFor: day,
                createdAt: now,
                source: generated.source,
                used,
              };
            }),
          );
          return json({ items, credits: spent.credits });
        } catch (err) {
          return handleError(err);
        }
      },
    },
  },
});
