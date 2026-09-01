import { createFileRoute } from "@tanstack/react-router";
import { handleError, json, readJson, requireSession } from "@/lib/http";
import { executePublish, tickPublish } from "@/lib/publish";
import { listJobs } from "@/lib/store";
import type { SocialPlatform } from "@/lib/types";

export const Route = createFileRoute("/api/publish")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await requireSession(request);
        if (!session) return json({ error: "Unauthorized" }, 401);
        const jobs = await listJobs(session.user.id);
        return json({ items: jobs });
      },
      POST: async ({ request }) => {
        const session = await requireSession(request);
        if (!session) return json({ error: "Unauthorized" }, 401);
        const body = await readJson<{
          action?: string;
          generationId?: string;
          platforms?: SocialPlatform[];
          scheduledFor?: string;
        }>(request);
        try {
          if (body.action === "tick") {
            const ticked = await tickPublish();
            return json(ticked);
          }
          if (!body.generationId) return json({ error: "generationId required" }, 400);
          const result = await executePublish({
            userId: session.user.id,
            generationId: body.generationId,
            platforms: body.platforms,
            scheduledFor: body.scheduledFor,
          });
          return json(result);
        } catch (err) {
          return handleError(err);
        }
      },
    },
  },
});
