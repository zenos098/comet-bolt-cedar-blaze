import { createFileRoute } from "@tanstack/react-router";
import { listGenerations, patchGeneration } from "@/lib/store";
import { json, readJson, requireSession } from "@/lib/http";
import type { GenerationStatus } from "@/lib/types";

export const Route = createFileRoute("/api/generations")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await requireSession(request);
        if (!session) return json({ error: "Unauthorized" }, 401);
        const items = await listGenerations(session.user.id);
        return json({ items });
      },
      PATCH: async ({ request }) => {
        const session = await requireSession(request);
        if (!session) return json({ error: "Unauthorized" }, 401);
        const body = await readJson<{
          id?: string;
          status?: GenerationStatus;
          scheduledFor?: string;
        }>(request);
        if (!body.id) return json({ error: "id required" }, 400);
        const item = await patchGeneration(session.user.id, body.id, {
          status: body.status,
          scheduledFor: body.scheduledFor,
        });
        if (!item) return json({ error: "Not found" }, 404);
        return json({ item });
      },
    },
  },
});
