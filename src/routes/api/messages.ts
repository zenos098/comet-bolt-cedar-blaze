import { createFileRoute } from "@tanstack/react-router";
import { listMessages } from "@/lib/store";
import { json, requireSession } from "@/lib/http";

export const Route = createFileRoute("/api/messages")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await requireSession(request);
        if (!session) return json({ error: "Unauthorized" }, 401);
        const items = await listMessages(session.user.id);
        return json({ items });
      },
    },
  },
});
