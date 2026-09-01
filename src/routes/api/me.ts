import { createFileRoute } from "@tanstack/react-router";
import { json, requireSession } from "@/lib/http";

export const Route = createFileRoute("/api/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await requireSession(request);
        if (!session) return json({ error: "Unauthorized" }, 401);
        return json({ user: session.publicUser, brand: session.brand });
      },
    },
  },
});
